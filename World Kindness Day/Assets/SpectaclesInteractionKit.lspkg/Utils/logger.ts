const printFn = print

export const formatLogMessage = (tag: string, args: any[]): string => {
  let result = `${tag}:`
  for (const arg of args) {
    result += " " + arg
  }
  return result
}

export const formatWithTag =
  (tag: string) =>
  (...args: any[]): string => {
    return formatLogMessage(tag, args)
  }

export const logWithTag =
  (tag: string) =>
  (...args: any[]) => {
    const message = formatLogMessage(tag, args)
    printFn(message)
  }
