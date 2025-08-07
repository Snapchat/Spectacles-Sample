# :hammer::construction_worker: Spectacles UI Kit :construction_worker::hammer:

## About

Spectacles UI Kit (or, simply, UIKit) is a collection of components, <br>
prefabs, scripts and assets designed to facilitate the development <br>
of graphical user interfaces (GUI) in Lens Studio.<br>
<br>

## Installation

UIKit can easily be imported into your project using the Asset Library package manager! <br>
<br>

### Setup

Note that UIKit depends on Spectacles Interaction Kit (SIK). <br>
So, when you download UIKit, from the Asset Library, Lens Studio will make sure you also <br>
have SIK installed in your project. <br>
If you're downloading SIK for the first time, be sure to follow the [set up instructions for SIK](https://developers.snap.com/spectacles/spectacles-frameworks/spectacles-interaction-kit/get-started) before using UIKit. <br>

<br>

## Components

### Interactive

###### Components with an Element (interactive logic) and a Visual (graphic representation)

- Button
- Slider
- Switch
- Toggle
- TextInputField

### Interface

###### Components of only interactive logic

- ScrollWindow
- GridLayout
- ScrollLayout

<br>

## Usage

Once installed, you can simply add any of the above components directly <br>
into your scene on the desired SceneObject. <br>
<br>

## Example

With the following basic starting hierarchy, add a SceneObject <br>
and position it appropriately.<br>

![alt text](./ReadMeAssets/new-hierarchy.jpg "Typical Lens Studio new project hierarchy.")

<br>

Then add the `Button` component from SpectaclesUIKit. <br>
It should look like this:<br>

![alt text](./ReadMeAssets/button-added.jpg "Above SceneObject with a new Button component added.")

<br>
Voila, a button! Check it out:<br><br>

![alt text](./ReadMeAssets/button-action-edit.gif "Scene preview clicking your brand new button.")

<br>

---

### Scripting

You may ask: "How do I make it... do something??" <br>
The answer: with `TypeScript` :mage: <br>
Add another new component-- this time a new `TypeScript` script. <br>
That will look like this: <br><br>
![alt text](./ReadMeAssets/button-script-component.jpg "SceneObject with a new TypeScript script component added.")
<br>
<br>

Now, edit your script file to look like this:

```TypeScript
import {Button} from "SpectaclesUIKit/Scripts/Components/Button/Button"

@component
export class CoolButtonScript extends BaseScriptComponent {
  private button: Button = this.sceneObject.getComponent(Button.getTypeName())

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this))
  }

  onStart() {
    let counter = 0
    this.button.onTriggerUp.add(() => {
      ++counter
      print(`button clicked and counter incremented: ${counter}`)
    })
  }
}
```

<br>
<br>

Now you have a callback on your button!

![alt text](./ReadMeAssets/button-script-edit.gif "Clicking the button with a counter incrementing in the console")
<br>
<br>

---

### Visuals

But, what if you want to change the (already totally perfect) visuals? <br>
Again, we do that in `TypeScript`! <br><br>
There are two approaches : <br>

1. Adjust the default visuals settings. <br>
2. Create your own visual from scratch. <br><br>

#### Update Default

The following is an example of updating the default visual <br>
This method means any default parameters will update with updates to UIKit <br>
Example : <br>

```TypeScript
import {Button} from "SpectaclesUIKit/Scripts/Components/Button/Button"
import {StateName} from "SpectaclesUIKit/Scripts/Components/Element"
import {RoundedRectangleVisual} from "SpectaclesUIKit/Scripts/Visuals/RoundedRectangle/RoundedRectangleVisual"

@component
export class CoolButtonScript extends BaseScriptComponent {
  private button: Button = this.sceneObject.getComponent(Button.getTypeName())
  private visual: RoundedRectangleVisual

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this))
  }

  onStart() {
    this.visual = this.button.visual as RoundedRectangleVisual

    this.visual.defaultGradient = {
      type: "Linear",
      stop1: {
        color: new vec4(1, 1, 0, 1),
        percent: 0
      },
      stop2: {
        color: new vec4(1, 0, 0, 1),
        percent: 1
      },
      stop3: {
        enabled: false
      },
      stop4: {
        enabled: false
      },
      stop5: {
        enabled: false
      }
    }

    this.visual.setState(StateName.default) // ensure changes propagate to current state ( automating this in future )

    let counter = 0
    this.button.onTriggerUp.add(() => {
      ++counter
      print(`button clicked and counter incremented: ${counter}`)
    })
  }
}
```

<br>

#### Full Custom

The following is an example of creating your own visual. <br>
This allows for the most control, but requires more setup. <br>
Also it is _required to happen in_ `OnAwake` (for now-- will be updated in the future). <br>
Example : <br>

```TypeScript
import {Button} from "SpectaclesUIKit/Scripts/Components/Button/Button"
import {RoundedRectangleVisual} from "SpectaclesUIKit/Scripts/Visuals/RoundedRectangle/RoundedRectangleVisual"

@component
export class CoolButtonScript extends BaseScriptComponent {
  private button: Button = this.sceneObject.getComponent(Button.getTypeName())
  private visual: RoundedRectangleVisual

  onAwake() {
    this.visual = new RoundedRectangleVisual(this.button.sceneObject)
    this.visual.isBaseGradient = true
    this.visual.defaultGradient = {
      type: "Linear",
      stop1: {
        color: new vec4(1, 1, 0, 1),
        percent: 0
      },
      stop2: {
        color: new vec4(1, 0, 0, 1),
        percent: 1
      },
      stop3: {
        enabled: false
      },
      stop4: {
        enabled: false
      },
      stop5: {
        enabled: false
      }
    }
    this.button.visual = this.visual

    this.createEvent("OnStartEvent").bind(this.onStart.bind(this))
  }

  onStart() {
    let counter = 0
    this.button.onTriggerUp.add(() => {
      ++counter
      print(`button clicked and counter incremented: ${counter}`)
    })
  }
}
```

<br><br>

Both of which get you a result like this : <br><br>
![alt text](./ReadMeAssets/gradient-button.jpg "SceneObject with a new TypeScript script component added.")

<br>

## Architecture

UIKit components are (usually) made up of two parts: an `Element` and a `Visual`. <br>
The `Element` contains all of the business logic. While the `Visual` contains <br>
all of the rendering and presentation code. This is why, in the above example <br>
where we added an event, we added it to the `Button` itself ( which extends `Element`). <br>
But, when we updated the gradient, we used the `Visual` or more specifically the `RoundedRectangleVisual` <br>

## Future

There are many more components, example prefabs, helper scripts and <br>
visual assets planned for UIKit in the future. If you have any questions <br>
please reach out to @ncline or @twu2. <br><br>

Thank you!
