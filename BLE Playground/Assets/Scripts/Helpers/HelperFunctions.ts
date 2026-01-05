export namespace HelperFuntions {
  export function uint8ArrayCompare(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false

    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false
    }
    return true
  }

  export function strIncludes(fullDeviceNameStr: string, commonDeviceNameSubstrings: string[]) {
    for (let i = 0; i < commonDeviceNameSubstrings.length; i++) {
      if (fullDeviceNameStr.toLowerCase().includes(commonDeviceNameSubstrings[i].toLowerCase())) {
        return true
      }
    }
    return false
  }
}
