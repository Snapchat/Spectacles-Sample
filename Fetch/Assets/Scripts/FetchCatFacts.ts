import Event from "Scripts/Events"

interface CatFact {
  fact: string
  length: number
}

const MAX_LENGTH = 93

@component
export class FetchCatFacts extends BaseScriptComponent {
  private internetModule: InternetModule = require("LensStudio:InternetModule")
  private url = "https://catfact.ninja/fact?max_length=" + MAX_LENGTH

  catFactReceived: Event<string>

  onAwake() {
    this.catFactReceived = new Event<string>()
  }

  public getCatFacts() {
    this.internetModule
      .fetch(this.url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then((response) => response.json())
      .then((data) => {
        const randomCatFact = data as CatFact
        this.catFactReceived.invoke(randomCatFact.fact)
      })
      .catch(failAsync)
  }
}
