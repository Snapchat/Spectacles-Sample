//Install from boards manager esp32 by Espressif Systems
//Install from libraries MPU6050_light.h library by rfetick
//Choose board Esp32 -> Node32s
//Choose port /dev/cu.usbserial-0001

//I did not have to install any special drivers for connecting with my macbook pro but I did have to try like 3 different microUSB cables until it was visible by my mac.

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

#include <MPU6050_light.h>
#include <Wire.h>

#define SERVICE_UUID        "0000ffe5-0000-1000-8000-00805f9b34fb"
#define CHARACTERISTIC_UUID "0000ffe6-0000-1000-8000-00805f9b34fb"

static BLEAdvertisementData advData;  

bool deviceConnected = false;

BLECharacteristic *characteristic;
BLEAdvertising *pAdvertising;

MPU6050 mpu(Wire);

class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      String value = String(pCharacteristic->getValue().c_str());  // make an Arduino String
      if (value.length()) {                     
        Serial.print(F("GOT MESSAGE: "));
        Serial.println(value);
      }
    }
};

class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      Serial.println("Connected!");
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      Serial.println("Disconnected...");
      pAdvertising->start();
      Serial.println("Start advertising...again...");
    }
};

void setup() {
  Serial.begin(115200);
  while (!Serial){
    delay(10);
  }

   //init gyro
   Wire.begin();
   byte status = mpu.begin();
   Serial.print(F("MPU6050 status: "));
   Serial.println(status);
   while (status != 0) { } // stop everything if could not connect to MPU6050
   Serial.println(F("Calculating offsets, do not move MPU6050"));
   delay(1000);
   mpu.calcOffsets();
   Serial.println("Done!\n");

  Serial.println("Starting BLE...");

  BLEDevice::init("MyESP32");
  BLEDevice::setMTU(128);

  BLESecurity *pSecurity = new BLESecurity();
  pSecurity->setAuthenticationMode(ESP_GATT_AUTH_REQ_NONE);
  
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);

  characteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_NOTIFY |
                                         BLECharacteristic::PROPERTY_WRITE |
                                         BLECharacteristic::PROPERTY_READ
                                       );
  characteristic->setCallbacks(new MyCallbacks());

  pService->start();

  advData.setName("MyESP32");
  pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->setAdvertisementData(advData);
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->start();

  Serial.println("Start advertising...");
}

void loop() {
  if (deviceConnected){
    mpu.update();
    String msg = String(mpu.getAngleX()) + "," + String(mpu.getAngleZ()) + "," + String(mpu.getAngleY());
    //Serial.println(msg);
    characteristic->setValue(msg.c_str());
    characteristic->notify();
    delay(10);
  }
}