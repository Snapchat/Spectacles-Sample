// -----JS CODE-----
function FloatArrayWrapper() {
  this.dataList = [];
  this.currentElementCount = 0;
  this._innerArraySize = 4096;
}

FloatArrayWrapper.prototype.push = function (floatArray, arrayRealSize) {
  var availableElementsInCurrentArray = this._innerArraySize - (this.currentElementCount % this._innerArraySize);
  if (this.currentElementCount % this._innerArraySize == 0) {
    availableElementsInCurrentArray = 0;
  }

  var additionalElementsCount = arrayRealSize - availableElementsInCurrentArray;
  var arraysToAddCount = Math.ceil(additionalElementsCount / this._innerArraySize);

  this.createAdditionalInnerArrays(arraysToAddCount);
  var currentCopiedElementIndex = 0;

  while (currentCopiedElementIndex < arrayRealSize) {
    var dataArrayIndex = Math.floor(this.currentElementCount / this._innerArraySize);
    var innerArrayIndex = this.currentElementCount % this._innerArraySize;
    if (this.dataList[dataArrayIndex]) {
      this.dataList[dataArrayIndex][innerArrayIndex] = floatArray[currentCopiedElementIndex];
    }

    this.currentElementCount += 1;
    currentCopiedElementIndex += 1;
  }
};

FloatArrayWrapper.prototype.shift = function () {
  // let array = this.dataList[0];
  // print(this.dataList[0].length)
  // let tmpArray = new Float32Array();
  // let element = array[0];
  // for (let i = 1; i < array.length; i++) {
  //     tmpArray[i - 1] = array[i];
  // }
  // tmpArray[array.length - 1] = array[array.length - 1];
  // this.dataList[0] = tmpArray;
  // print(this.dataList[0].length)
  return this.dataList.shift();
};

FloatArrayWrapper.prototype.createAdditionalInnerArrays = function (arraysCount) {
  for (var i = 0; i < arraysCount; i++) {
    this.dataList.push(new Float32Array(this._innerArraySize));
  }
};

FloatArrayWrapper.prototype.getElement = function (idx) {
  var arrayIndex = Math.floor(idx / this._innerArraySize);
  var elementInArrayIdx = idx % this._innerArraySize;
  if (this.dataList[arrayIndex]) {
    return this.dataList[arrayIndex][elementInArrayIdx];
  } else {
    return 0;
  }
};

FloatArrayWrapper.prototype.getSize = function () {
  return this.currentElementCount;
};

FloatArrayWrapper.prototype.clear = function () {
  this.currentElementCount = 0;
  this.dataList = [];
};

FloatArrayWrapper.prototype.validate = function () {
  print("DEBUG LENGTH = " + this.dataList.length);
};

FloatArrayWrapper.prototype.getSizeInBytes = function () {
  if (this.dataList[0]) {
    return this.currentElementCount * this.dataList[0].BYTES_PER_ELEMENT;
  } else {
    return 0;
  }
};

function getFloatArrayWithIncreasingSequence(arrSize) {
  var arr = new Float32Array(arrSize);

  for (var i = 0; i < arrSize; i++) {
    arr[i] = i;
  }
  return arr;
}

//var wrapper = new FloatArrayWrapper()
//
//wrapper.push(getFloatArrayWithIncreasingSequence(13), 13)
//wrapper.push(getFloatArrayWithIncreasingSequence(3000), 3000)
//wrapper.validate()
//print(wrapper.getElement(1025))
//print(wrapper.getSize())

global.FloatArrayWrapper = FloatArrayWrapper;
