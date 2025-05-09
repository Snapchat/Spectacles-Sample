/**
 * Creates callbacks to be passed to UI Kit events from a script in the Inspector panel.
 * @param scriptComponent - the script to be used.
 * @param functionNames - the names of the functions within the script to be invoked during this callback.
 * @returns a callback that will invoke the specified functions in the script provided.
 */
export function createCallback<T>(
  scriptComponent: ScriptComponent,
  functionNames: string[]
): (args: T) => void {
  if (scriptComponent === undefined) {
    return () => {}
  }
  return (args) => {
    functionNames.forEach((name) => {
      if ((scriptComponent as any)[name]) {
        (scriptComponent as any)[name](args)
      }
    })
  }
}
