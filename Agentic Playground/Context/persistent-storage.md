# Snap Lens Studio Persistent Storage Guide

## Persistent Cloud Storage Overview

Persistent Cloud Storage allows you to store data in the cloud, such that it can persist across account logins, as well as be shared in a multiplayer session. It's a great way to maintain the state of a Lens for a user. Each user has one Persistent Cloud Storage (Cloud Store) for each Lens.

Persistent Cloud Storage is a part of Lens Cloud, a collection of backend services, built on the same infrastructure that powers Snapchat. To learn more about Lens Cloud and how to power a new generation of AR experiences that are more dynamic, useful, and interactive than ever before, please visit Lens Cloud Overview.

If you've used the store related method in MultiplayerSession, you can think of using Persistent Cloud Storage very similarly. Alternatively, you can think of Persistent Cloud Storage as PersistentStorageSystem, except it's backed by the cloud rather than on device.

## Creating a Persistent Cloud Storage

A user can access their Persistent Cloud Storage through the CloudStorage module. Each call to get the cloud store will return the same instance of a Cloud Store.

```javascript
// @input Asset.CloudStorageModule cloudStorageModule
```

You can create a CloudStorageModule in the Asset Browser panel > +, then attach it to it to the scene object containing your script in the Inspector panel.

When getting a CloudStore, the user passes in a CloudStorageOptions. One of the settings that can be passed in is whether this CloudStore is shared with a Session. It is possible to getCloudStore multiple times. However, every time you call it, regardless of the options passed in, the same instance is returned.

```javascript
const cloudStorageOptions = CloudStorageOptions.create();

script.cloudStorageModule.getCloudStore(
  cloudStorageOptions,
  onCloudStoreReady,
  onError
);

function onCloudStoreReady(store) {
  print('CloudStore created');
  script.store = store;
}

function onError(code, message) {
  print('Error: ' + code + ' ' + message);
}
```

The session property of a CloudStore is immutable once it is set. Practically speaking: if you want a multiplayer CloudStore, you need to create the CloudStore after you have received a MultiplayerSession.

When adding data to the CloudStore, you will pass in additional options that describe the permission of the data. For example: who can read, write, or list the data. These permissions can be scoped to:

- **User**: accessible only to the current user.
- **Session**: accessible to any user in the same MultiplayerSession.

```javascript
const writeOptions = CloudStorageWriteOptions.create();
writeOptions.scope = StorageScope.User;

const key = 'myKey';
const value = Date.now();

script.store.setValue(
  key,
  value,
  writeOptions,
  function onSuccess() {
    print('stored successfully');
  },
  function onError(code, message) {
    print('Error: ' + code + ' ' + message);
  }
);
```

As shown in the code above, sharing a CloudStore without a MultiplayerSession attached would be ineffective, as only a single user would have access to the store. Therefore, it is not possible to share it in this case.

## Spatial Persistent Cloud Storage

Spatial Persistent Cloud Storage is build on top of Persistent Cloud Storage which allows user to store/pin content against any location asset (Snap provided, custom or world). It is very much similar to cloud storage as it allow us to store information against a location asset in a privacy centric way.

A user can access their Spatial Persistent Cloud Storage through the Location Cloud Storage Module. Depending upon type of location asset, one or more cloud storage instances would be returned. For world location asset, depending upon the user location, we will return the closest location cloud store.

As user moves through in the world, Location Cloud Storage Module will fire events that return the nearest cloud store and related location asset to the user. Developers are expected to add the locationAsset to a Located At Component.

This Located At component will position its SceneObject at exact position of the cloud store.

Therefore, if users want to persist content near this cloud store, it is recommended they add their content as a child of the locatedAtComponent's SceneObject then store details about the content along with the offset from the locatedAtComponent.

This way, the next time a user accesses the store, all the store's values can be listed, and the content can be recreated and positioned using the stored offset from the cloud store.

You can create a Location Cloud Storage Module and Location Asset in the Asset Browser panel → +, then attach them to the script input field in the Inspector panel.

```javascript
//@input Asset.Location locationAsset
//@input Asset.LocationCloudStorageModule locationCloudStorageModule

const options = LocationCloudStorageOptions.create();
options.location = script.locationAsset; //could be world, custom or snap.
options.onDiscoveredNearby.add(handleOnDiscoveredNearbyTo);
options.onError.add(handleOnError);

function handleOnDiscoveredNearbyTo(locationAsset, locationCloudStore) {
  // associate the locationAsset to a locatedAtComponent
  var locationStoreSceneObject =
    global.scene.createSceneObject('LocationStore');
  var locatedAtComponent =
    locationStoreSceneObject.createComponent('LocatedAtComponent');
  locatedAtComponent.location = locationAsset;
  
  var writeOptions = CloudStorageWriteOptions.create();
  writeOptions.scope = StorageScope.User;
  
  // persist content
  locationCloudStore.setValue(
    'test-key',
    'test-value',
    writeOptions,
    function onSuccess() {
      print('stored successfully');
    },
    function onError(code, message) {
      print('Error: ' + code + ' ' + message);
    }
  );
}

function handleOnError(locationAsset, code, description) {
  print('code:' + code + ' description:' + description);
}

script.locationCloudStorageModule.getNearbyLocationStores(options);
```

Currently, Spatial Persistence Cloud Storage does not support multiplayer sessions. We only support user scope for Spatial Persistent Cloud Storage.

## Restrictions

When using Persistent Cloud Storage, some APIs will be restricted in order to protect the user's privacy, similar to Connected Lenses.

See the "Restrictions" section from "Connected Lenses Overview" for a complete list of disabled APIs.

## Examples

Try making your first Peristent Cloud Storage Lenses with these following examples:

- Single Player Example
- Multiplayer Example using ConnectedLensModule
- Spatial Persistence Example

---

# Persistent Storage

## Overview

By default, script variables retain their value only while the Lens is active. When a user closes and reopens a Lens, all script variables are reset. The Persistent Storage system enables you to create Lenses that can selectively read and write data between Lens sessions. This is perfect for keeping track of a high score in a game, for example.

In this guide, we'll write a simple script that increments a score every time the user opens their mouth, and then saves that count.

Please visit the High Score Template Guide for a more detailed example.

## Writing Data To Persistent Storage

First, create a variable that refers to the Persistent Storage system's data store.

```javascript
var store = global.persistentStorageSystem.store;
```

Next, create a key which you'll use to read and write the score value. In this case, we'll name our key `totalScore`.

```javascript
var scoreKey = 'totalScore';
```

Using this key, we can create an integer variable in the Persistent Storage system's data store.
Since we haven't yet placed any data in the store, the first time we retrieve `totalScore` its value will be the default integer value of 0.

```javascript
var currentGameScore = store.getInt(scoreKey);
print('Loaded score: ' + currentGameScore);
```

For a full list of supported data types, please visit the GeneralDataStore API Reference.

Next, we'll write a function that increments the score and updates our variable in the Persistent Storage store.

```javascript
function incrementScore() {
  currentGameScore += 1;
  store.putInt(scoreKey, currentGameScore);
  print('Current score: ' + currentGameScore);
}
```

And bind the new function `incrementScore` to the MouthOpenedEvent:

```javascript
script.createEvent('MouthOpenedEvent').bind(incrementScore);
```

Now, each time the user opens their mouth, they will increment the integer value stored at the persistent key `totalScore`.

Once a value is stored in Persistent Storage, it stays there even after the user closes the Lens. In Lens Studio, a notification appears in the Preview panel to remind you that there is data in Persistent Storage.

> **Note:** Snapchat will clear the Lens' persistent storage 60 days after the user does not touch the Lens.

## Printing and Clearing Keys

In Lens Studio, you can print and clear the Persistent Storage system's keys in the Preview Panel.

### Printing Keys

You can print the keys and values you have stored in Persistent Storage in the Preview Panel by selecting `...` > `Print Persistent Storage`

The result will be printed in the Logger Panel.

### Clearing Keys

You can clear Lens Studio's Persistent Storage in the Preview Panel by selecting `...` > `Clear Persistent Storage`

You can clear Persistent Storage in Snapchat by going to `Settings` > `Clear Lens Data`

## Storage Capacity

Persistent Storage has a limited capacity. Once it's full, no new data keys can be added until it's cleared.

`onStoreFull` is a callback function called every time Persistent Storage is full. We can call clear each time this happens to add new values.

```javascript
store.onStoreFull = function () {
  store.clear();
  print('Storage cleared');
};
```

## The Final Script

Below you'll find the completed script from this guide:

```javascript
// Create key for the score variable
var store = global.persistentStorageSystem.store;
var scoreKey = 'totalScore';

// Retrieve the score from persistent storage
var currentGameScore = store.getInt(scoreKey);

// Print the score
print('Loaded score: ' + currentGameScore);

// Function that increments the score
function incrementScore() {
  // Increment the score by 1
  currentGameScore += 1;
  // Store the current score in persistent storage
  store.putInt(scoreKey, currentGameScore);
  // Print the current score
  print('Current score: ' + currentGameScore);
}

// Bind the incrementScore function to the "Mouth Opened" event
script.createEvent('MouthOpenedEvent').bind(incrementScore);

// If persistent storage is full, clear it
store.onStoreFull = function () {
  store.clear();
  print('Storage cleared');
};
```

---

*Documentation for Snap Lens Studio Persistent Storage System* 