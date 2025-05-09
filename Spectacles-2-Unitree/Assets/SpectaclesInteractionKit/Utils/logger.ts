const printFn = print

export const logWithTag =
  (tag: string) =>
  (...args: any[]) => {
    let result = `${tag}:`
    for (const arg of args) {
      result += " " + arg
    }
    printFn(result)
  }
