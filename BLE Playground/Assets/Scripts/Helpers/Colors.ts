export namespace Colors {
  const violetColor = new vec4(0.56, 0, 1, 1)
  const indigoColor = new vec4(0.29, 0, 0.51, 1)
  const blueColor = new vec4(0, 0, 1, 1)
  const cyanColor = new vec4(0, 1, 1, 1)
  const greenColor = new vec4(0, 1, 0, 1)
  const yellowColor = new vec4(1, 1, 0, 1)
  const orangeColor = new vec4(1, 0.5, 0, 1)
  const redColor = new vec4(1, 0, 0, 1)
  const magentaColor = new vec4(1, 0, 1, 1)
  const whiteColor = new vec4(1, 1, 1, 1)
  const greyColor = new vec4(0.5, 0.5, 0.5, 1)
  const blackColor = new vec4(0, 0, 0, 1)

  export function violet() {
    return violetColor
  }
  export function indigo() {
    return indigoColor
  }
  export function blue() {
    return blueColor
  }
  export function cyan() {
    return cyanColor
  }
  export function green() {
    return greenColor
  }
  export function yellow() {
    return yellowColor
  }
  export function orange() {
    return orangeColor
  }
  export function red() {
    return redColor
  }
  export function magenta() {
    return magentaColor
  }
  export function white() {
    return whiteColor
  }
  export function grey() {
    return greyColor
  }
  export function black() {
    return blackColor
  }

  export function rainbowColor(x: number, y: number): vec4 {
    if (x < 0 || x > 1) {
      throw new Error("Input must be between 0 and 1")
    }

    // Map value (0 to 1) to hue (0 to 360 degrees in HSL)
    const hue = x * 360

    // Convert HSL to RGB
    function hslToRgb(h: number, s: number, l: number): [number, number, number] {
      s /= 100
      l /= 100

      const k = (n: number) => (n + h / 30) % 12
      const a = s * Math.min(l, 1 - l)
      const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))

      return [f(0), f(8), f(4)]
    }

    const [r, g, b] = hslToRgb(hue, 100, y * 100)

    return new vec4(r, g, b, 1) // RGBA with alpha 1
  }
}
