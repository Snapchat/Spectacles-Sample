"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRITICAL_COLOR_STOPS = exports.DEFAULT_COLOR_STOPS = exports.DARKGRAY = exports.GRAY = exports.BLACK = exports.RED = exports.WHITE = exports.YELLOW = void 0;
exports.parseColor = parseColor;
exports.withAlpha = withAlpha;
exports.withoutAlpha = withoutAlpha;
exports.HSLToRGB = HSLToRGB;
exports.HSLToRGBInPlace = HSLToRGBInPlace;
exports.RGBToHSL = RGBToHSL;
exports.RGBToHSLInPlace = RGBToHSLInPlace;
exports.getMostCommonHue = getMostCommonHue;
const SeededRandomNumberGenerator_1 = require("./SeededRandomNumberGenerator");
// Parse the std color format "#RRGGBB" into a lensCore vec3
function parseColor(str, alpha = 1.0) {
    if (str[0] === "#") {
        str = str.substr(1);
    }
    if (str.length !== 6) {
        throw new Error(`parseColor: can't parse string of length ${str.length} "${str}"`);
    }
    return new vec4(parseInt(str.substr(0, 2), 16) / 255, parseInt(str.substr(2, 2), 16) / 255, parseInt(str.substr(4, 2), 16) / 255, alpha);
}
// withAlpha is a simple utility for constructing a color value
// that is the same as the given color value, but with a new
// alpha value.
function withAlpha(color, alpha) {
    return new vec4(color.r, color.g, color.b, alpha);
}
// withAlpha is a simple utility for constructing a color value
// that is the same as the given color value, but without any
// alpha value.
function withoutAlpha(color) {
    return new vec3(color.r, color.g, color.b);
}
// Known Colors
const YELLOW = (alpha = 1) => parseColor("#FFFC00", alpha);
exports.YELLOW = YELLOW;
const WHITE = (alpha = 1) => parseColor("#FFFFFF", alpha);
exports.WHITE = WHITE;
const RED = (alpha = 1) => parseColor("#FF0000", alpha);
exports.RED = RED;
const BLACK = (alpha = 1) => parseColor("#000000", alpha);
exports.BLACK = BLACK;
const GRAY = (alpha = 1) => parseColor("#3A383A", alpha);
exports.GRAY = GRAY;
const DARKGRAY = (alpha = 1) => parseColor("#202020", alpha);
exports.DARKGRAY = DARKGRAY;
/**
 * Defines all [ColorStop] for the default color theme in [LinearGradientBackground]
 */
exports.DEFAULT_COLOR_STOPS = [
    {
        color: parseColor("#E92754"),
        percent: 4.42
    },
    {
        color: parseColor("#2B7391"),
        percent: 52.2
    },
    {
        color: parseColor("#FFFC00"),
        percent: 98.98
    }
];
/**
 * Defines all [ColorStop] for the critical color theme in [LinearGradientBackground]
 */
exports.CRITICAL_COLOR_STOPS = [
    {
        color: parseColor("#541858"),
        percent: 25.98
    },
    {
        color: parseColor("#921633"),
        percent: 47.28
    },
    {
        color: parseColor("#FFFC0C"),
        percent: 106.17
    }
];
/**
 * This function converts a color from HSL to RGB. Reference: https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB
 * @param HSL {vec3} A color expressed as Hue (x [0, 360]), Saturation (y [0, 1]), and Lightness (z [0,1])
 * @returns {vec3} The same color expressed as Red (x [0, 1]), Green (y [0, 1]), and Blue (z [0, 1])
 */
function HSLToRGB(HSL) {
    const vector = new vec3(HSL.x, HSL.y, HSL.z);
    HSLToRGBInPlace(vector);
    return vector;
}
const ONE_OVER_60 = 0.01666666666;
/**
 * This function converts a color from HSL to RGB. Reference: https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB
 * @param vector {vec3} A color expressed as Hue (x [0, 360]), Saturation (y [0, 1]), and Lightness (z [0,1])
 * This vector will be modified to express the same color as Red (x [0, 1]), Green (y [0, 1]), and Blue (z [0, 1])
 */
function HSLToRGBInPlace(vector) {
    const h = vector.x;
    const s = vector.y;
    const l = vector.z;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const ho = h * ONE_OVER_60;
    const x = c * (1 - Math.abs((ho % 2) - 1));
    const matchLightness = l - c * 0.5;
    if (ho < 1) {
        vector.x = c + matchLightness;
        vector.y = x + matchLightness;
        vector.z = matchLightness;
    }
    else if (ho < 2) {
        vector.x = x + matchLightness;
        vector.y = c + matchLightness;
        vector.z = matchLightness;
    }
    else if (ho < 3) {
        vector.x = matchLightness;
        vector.y = c + matchLightness;
        vector.z = x + matchLightness;
    }
    else if (ho < 4) {
        vector.x = matchLightness;
        vector.y = x + matchLightness;
        vector.z = c + matchLightness;
    }
    else if (ho < 5) {
        vector.x = x + matchLightness;
        vector.y = matchLightness;
        vector.z = c + matchLightness;
    }
    else if (ho <= 6) {
        vector.x = c + matchLightness;
        vector.y = matchLightness;
        vector.z = x + matchLightness;
    }
    else {
        throw "Could not determine HSL conversion";
    }
}
/**
 * This function converts a color from RGB to HSL. Reference: https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB
 * @param RGB {vec3} A color expressed as Red (x [0, 1]), Green (y [0, 1]), and Blue (z [0, 1])
 * @returns {vec3} The same color expressed as Hue (x [0, 360]), Saturation (y [0, 1]), and Lightness (z [0,1])
 */
function RGBToHSL(RGB) {
    const vector = new vec3(RGB.x, RGB.y, RGB.z);
    RGBToHSLInPlace(vector);
    return vector;
}
/**
 * This function converts a color from RGB to HSL. Reference: https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB
 * @param vector {vec3} A color expressed as Red (x [0, 1]), Green (y [0, 1]), and Blue (z [0, 1]).
 * This vector will be modified to express the same color as Hue (x [0, 360]), Saturation (y [0, 1]), and Lightness (z [0,1])
 */
function RGBToHSLInPlace(vector) {
    const rScaled = vector.x;
    const gScaled = vector.y;
    const bScaled = vector.z;
    const xMax = Math.max(rScaled, gScaled, bScaled);
    const xMin = Math.min(rScaled, gScaled, bScaled);
    const c = xMax - xMin;
    const l = (xMax + xMin) / 2;
    let h = 0;
    if (xMax === rScaled) {
        h = 60 * (((gScaled - bScaled) / c) % 6);
    }
    else if (xMax === gScaled) {
        h = 60 * ((bScaled - rScaled) / c + 2);
    }
    else if (xMax === bScaled) {
        h = 60 * ((rScaled - gScaled) / c + 4);
    }
    let s = 0;
    if (l > 0 && l < 1) {
        s = (2 * (xMax - l)) / (1 - Math.abs(2 * l - 1));
    }
    vector.x = h;
    vector.y = s;
    vector.z = l;
}
// How many color buckets to use when calculating the most common hue
const BUCKET_COUNT = 16;
// How many samples of the image to take when calculating the most common hue
const MOST_COMMON_HUE_SAMPLES = 100;
// Multiplication is typically much faster than division
const ONE_OVER_255 = 0.00392156862;
const ONE_OVER_360 = 0.00277777777;
/**
 * Returns the most common hue in the texture, using subjective criteria. The algorithm
 * used is an artistic decision, and subject to change at any time.
 * @param texture The texture to measure
 * @returns The most common hue in the texture [0,360]
 */
function getMostCommonHue(texture) {
    // Divide the possible colors up into buckets, to limit the number of options
    const bucketCount = BUCKET_COUNT;
    const colors = new Array(bucketCount);
    for (let i = 0; i < bucketCount; i++) {
        colors[i] = 0;
    }
    // Allocate a buffer big enough to store the data from the texture
    const width = texture.getWidth();
    const height = texture.getHeight();
    const pixelBuffer = new Uint8Array(width * height * 4);
    // Extract the data from the texture into the pixel buffer
    const proceduralTexture = ProceduralTextureProvider.createFromTexture(texture);
    const proceduralTextureControl = proceduralTexture.control;
    proceduralTextureControl.getPixels(0, 0, width, height, pixelBuffer);
    const sampleCount = MOST_COMMON_HUE_SAMPLES;
    const pixels = width * height;
    const samples = new SeededRandomNumberGenerator_1.SeededRandomNumberGenerator(pixels).getRandomNumberArrayInRangeNoDuplicates(0, pixels - 1, sampleCount);
    // Reuse the vector for each loop to reduce allocations
    const pixelColor = vec3.zero();
    // This loop runs many times, so needs to be efficient
    samples.forEach((pixelIndex) => {
        const i = pixelIndex * 4;
        // Divide by 255 to convert it to the [0,1] range
        pixelColor.x = pixelBuffer[i] * ONE_OVER_255;
        pixelColor.y = pixelBuffer[i + 1] * ONE_OVER_255;
        pixelColor.z = pixelBuffer[i + 2] * ONE_OVER_255;
        // Convert the color in place to reduce allocations
        // Before this function, pixelColor is in RGB. After, it is in HSL
        RGBToHSLInPlace(pixelColor);
        // Only count the pixel if it has some saturation (otherwise it will look gray)
        // and a middling lightness (otherwise it will look black / white).
        if (pixelColor.y > 0.2 && pixelColor.z > 0.2 && pixelColor.z < 0.8) {
            // Divide the bucketCount by 360 to get the size of each bucket, then find the one it falls into
            const bucket = Math.round(pixelColor.x * bucketCount * ONE_OVER_360);
            // Weight the effect of the pixel by its alpha transparency since
            // transparent pixels won't make the texture look more that color
            const a = pixelBuffer[i + 3];
            colors[bucket] += a;
        }
    });
    // Find the bucket with the most pixels in it
    const maxBucket = Math.max(...colors);
    const maxBucketIndex = colors.findIndex((value) => {
        return value === maxBucket;
    });
    // Return the hue of the biggest bucket
    const mostCommonHue = (maxBucketIndex / bucketCount) * 360;
    return mostCommonHue;
}
//# sourceMappingURL=color.js.map