#!/bin/bash

set -e
set -x

<<comment
In order to generate an xcframework, we need the module name and target name to be identical, as this is a implicit assumption of many different parts of the Xcode toolchain.
We also need the target to be explicitly marked as dynamic, or the build process won't include the actual binary library.
However, to allow the base module to continue to work with Swift package manager as normal, we do not mark the base SpectaclesKit target as dynamic, and instead add a separate SpectaclesKitDynamic target for this build.
comment

WORKSPACE="SpectaclesKitFramework.xcworkspace"
LIBRARY_NAME="SpectaclesKit"
TARGET_NAME="SpectaclesKitDynamic"
BUILD_FOLDER="./build"
OUTPUT_PATH="${BUILD_FOLDER}/${TARGET_NAME}.xcframework"

rm -rf "$BUILD_FOLDER"
mkdir -p "$BUILD_FOLDER"

ARCHIVE_COMMAND="xcodebuild -create-xcframework -output $OUTPUT_PATH"

for PLATFORM in "iOS" "iOS Simulator"; do
    case $PLATFORM in
      "iOS")
        SDK="iphoneos"
      ;;
      "iOS Simulator")
        SDK="iphonesimulator"
      ;;
    esac
    ARCHIVE="${BUILD_FOLDER}/${TARGET_NAME}-${SDK}.xcarchive"
    xcodebuild archive \
      -workspace $WORKSPACE \
      -scheme $TARGET_NAME \
      -destination="generic/platform=${PLATFORM}" \
      -archivePath $ARCHIVE \
      -sdk $SDK \
      -derivedDataPath $BUILD_FOLDER \
      SKIP_INSTALL=NO \
      BUILD_LIBRARY_FOR_DISTRIBUTION=YES \
      PRODUCT_MODULE_NAME="${TARGET_NAME}" \
      PRODUCT_NAME="${TARGET_NAME}" \

    BUILD_PRODUCTS_PATH="${BUILD_FOLDER}/Build/Intermediates.noindex/ArchiveIntermediates/${TARGET_NAME}/BuildProductsPath"
    RELEASE_PATH="${BUILD_PRODUCTS_PATH}/Release-${SDK}"
    SWIFT_MODULE_PATH="${RELEASE_PATH}/${TARGET_NAME}.swiftmodule"
    RESOURCES_BUNDLE_PATH="${RELEASE_PATH}/${TARGET_NAME}.bundle"

    FRAMEWORK_PATH="${ARCHIVE}/Products/Library/Frameworks/${TARGET_NAME}.framework"
    MODULES_PATH="$FRAMEWORK_PATH/Modules"

    # Swift modules need to be added manually, or else the target app won't be able to import the library
    mkdir $MODULES_PATH
    cp -r $SWIFT_MODULE_PATH $MODULES_PATH

    # Swift package manager expects a certain bundle name, so we need to rename the bundle here
    cp -r $RESOURCES_BUNDLE_PATH $FRAMEWORK_PATH/${LIBRARY_NAME}_${LIBRARY_NAME}.bundle

    ARCHIVE_COMMAND="$ARCHIVE_COMMAND -framework $FRAMEWORK_PATH"
done

eval "$ARCHIVE_COMMAND"

# strip abi.json files, as they include absolute paths to the build directories on the local machine
rm $(find $OUTPUT_PATH -name *.abi.json)
