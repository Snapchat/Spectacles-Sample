"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeededRandomNumberGenerator = void 0;
/**
 * Optimal constant, per:
 * Steele, GL, Vigna, S. Computationally easy, spectrally good multipliers for congruential pseudorandom number generators. Softw Pract Exper. 2022; 52( 2): 443– 458. doi:10.1002/spe.3030
 * https://onlinelibrary.wiley.com/doi/10.1002/spe.3030
 */
const a = 0x915f77f5;
// The c constant has no effect on the potency of the generator, and can be set to anything
const c = 12345;
// Choosing a low modulus keeps javascript from losing precision
const m = Math.pow(2, 32);
/**
 * This is a random number generator that allows you to set the seed used, for generating
 * consistent random values between runs.
 * It is implemented as a linear congruential generator, which is fast but not very random.
 *
 * NOTE: The seed you pass needs to be an Integer
 *
 * See: https://en.wikipedia.org/wiki/Linear_congruential_generator
 */
class SeededRandomNumberGenerator {
    constructor(seed) {
        this.seed = seed ?? 0;
        if (!Number.isInteger(this.seed)) {
            throw new Error(`Illegal value: Non-Integer seed passed to SeededRandomNumberGenerator: ${this.seed}`);
        }
    }
    /**
     * Returns a random integer between 0 and 2^32
     * @returns A random integer between 0 and 2^32
     */
    randomInteger() {
        const x = (a * this.seed + c) % m;
        this.seed = x;
        return x;
    }
    /**
     * Generate a floating-point number in the given range
     * @param {number} start The lowest value in the range.
     * @param {number} end The highest value in the range.
     * @returns A function that, when called, returns a number within the given range.
     */
    randomRange(start, end) {
        const range = end - start;
        return () => {
            const x = this.randomInteger();
            return (x / m) * range + start;
        };
    }
    /**
     * Generate an integer in the given range.
     * @param {number} start The lowest value in the range. If this is a decimal, the start of the range will be the floor of the value.
     * @param {number} end The highest value in the range. If this is a decimal, the end of the range will be the floor of the value.
     * @returns A function that, when called, returns an integer within the given range.
     */
    randomIntegerRange(start, end) {
        const startFloor = Math.floor(start);
        const endFloor = Math.floor(end);
        const range = endFloor - startFloor + 1;
        return () => {
            const x = this.randomInteger();
            return (x % range) + startFloor;
        };
    }
    /**
     * Returns an Array of random numbers within a specified range (no duplicates).
     * @param rangeMin - The minimum value of the range (inclusive).
     * @param rangeMax - The maximum value of the range (exclusive).
     * @param numRandomNumbers - The number of random numbers to generate.
     * @returns An Array of random numbers within the specified range.
     * @throws Will throw an error if rangeMin >= rangeMax.
     * @throws Will throw an error if numRandomNumbers > rangeMax - rangeMin.
     */
    getRandomNumberArrayInRangeNoDuplicates(rangeMin, rangeMax, numRandomNumbers) {
        if (rangeMin >= rangeMax) {
            throw new Error(`Illegal arguments, rangeMin (${rangeMin}) cannot be >= rangeMax (${rangeMax})`);
        }
        if (numRandomNumbers > rangeMax - rangeMin) {
            throw new Error(`Illegal arguments, numRandomNumbers (${numRandomNumbers}) cannot be > rangeMax - rangeMin (${rangeMax - rangeMin})`);
        }
        // To avoid choosing duplicate indexes, populate a list with all possible numbers so we can remove them as they are chosen
        const possibleNumbers = [];
        for (let i = rangeMin; i < rangeMax; i++) {
            possibleNumbers.push(i);
        }
        const chosenNumbers = [];
        for (let i = 0; i < numRandomNumbers; i++) {
            const index = this.randomIntegerRange(0, possibleNumbers.length - 1)();
            chosenNumbers.push(possibleNumbers[index]);
            possibleNumbers.splice(index, 1);
        }
        return chosenNumbers;
    }
    /**
     * Generates a random quaternion.
     * The resulting quaternion is of unit length and its components range between -1 and 1.
     *
     * @returns A randomly generated quaternion of unit length.
     */
    randomQuaternion() {
        const w = MathUtils.remap(this.randomRange(0, 1)(), 1, 0, 1, -1);
        const x = MathUtils.remap(this.randomRange(0, 1)(), 1, 0, 1, -1);
        const y = MathUtils.remap(this.randomRange(0, 1)(), 1, 0, 1, -1);
        const z = MathUtils.remap(this.randomRange(0, 1)(), 1, 0, 1, -1);
        const returnQuat = new quat(w, x, y, z);
        returnQuat.normalize();
        return returnQuat;
    }
    /**
     * Generates a random point within an Axis-Aligned Bounding Box (AABB). An AABB is a rectangular box
     * specified by providing the minimum and maximum x, y, and z coordinates.
     *
     * @param {vec3} minPoint - The minimum point of the AABB.
     * @param {vec3} maxPoint - The maximum point of the AABB.
     * @throws Will throw an error if any component of minPoint is greater than the corresponding component of maxPoint.
     * @returns A randomly generated point within the specified AABB, where minPoint.x <= x <= maxPont.x etc.
     */
    randomPointInAABB(minPoint, maxPoint) {
        if (minPoint.x > maxPoint.x || minPoint.y > maxPoint.y || minPoint.z > maxPoint.z) {
            throw new Error("Illegal arguments, each component of minPoint cannot be greater than the corresponding component of maxPoint");
        }
        const x = MathUtils.remap(this.randomRange(0, 1)(), 1, 0, maxPoint.x, minPoint.x);
        const y = MathUtils.remap(this.randomRange(0, 1)(), 1, 0, maxPoint.y, minPoint.y);
        const z = MathUtils.remap(this.randomRange(0, 1)(), 1, 0, maxPoint.z, minPoint.z);
        return new vec3(x, y, z);
    }
}
exports.SeededRandomNumberGenerator = SeededRandomNumberGenerator;
//# sourceMappingURL=SeededRandomNumberGenerator.js.map