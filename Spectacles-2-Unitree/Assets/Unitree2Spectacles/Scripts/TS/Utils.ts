/**
 * Flatten a vec3, quat, or mat4.
 * @param data The data to flatten. Can be a vec3, quat, or mat4.
 * @returns Flattened array of numbers.
 */
export function flat(data: vec3 | vec4 | quat | mat4): number[] {
    if (data instanceof vec3) {
        return [data.x, data.y, data.z];
    } else if (data instanceof quat) {
        return [data.x, data.y, data.z, data.w];
    } else if (data instanceof vec4) {
        return [data.x, data.y, data.z, data.w];
    } else if (data instanceof mat4) {
        return [data.column0, data.column1, data.column2, data.column3].flatMap(c => flat(c));
    }
    throw new Error("Unknown type");
}

/**
 * Create a 4x4 homogeneous transformation matrix from a position and rotation.
 * @param pos Position of the transform.
 * @param rot Rotation of the transform.
 * @returns A 4x4 transformation matrix.
 */
export function tr(pos: vec3, rot: quat): mat4 {
    // Create a new matrix
    const matrix = new mat4();  
    // Extract quaternion components
    const x = rot.x;
    const y = rot.y;
    const z = rot.z;
    const w = rot.w;  
    // Calculate rotation matrix components
    // First column
    matrix.column0 = new vec4(
        1 - 2 * (y * y + z * z),
        2 * (x * y + w * z),
        2 * (x * z - w * y),
        0
    );  
    // Second column
    matrix.column1 = new vec4(
        2 * (x * y - w * z),
        1 - 2 * (x * x + z * z),
        2 * (y * z + w * x),
        0
    );  
    // Third column
    matrix.column2 = new vec4(
        2 * (x * z + w * y),
        2 * (y * z - w * x),
        1 - 2 * (x * x + y * y),
        0
    );  
    // Fourth column (translation)
    matrix.column3 = new vec4(
        pos.x,
        pos.y,
        pos.z,
        1
    );  
    return matrix;
}