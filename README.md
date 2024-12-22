# Onborda - Next.js onboarding flow
Onborda is a lightweight onboarding flow that utilises [framer-motion](https://www.framer.com/motion/) for animations and [tailwindcss](https://tailwindcss.com/) for styling. Fully customisable pointers (tooltips) that can easily be used with [shadcn/ui](https://ui.shadcn.com/) for modern web applications.

- **Demo - [onborda.vercel.app](https://onborda.vercel.app)**
- **[Demo repository](https://github.com/uixmat/onborda-demo)**


## Getting started
```bash
# npm
npm i onborda
# pnpm
pnpm add onborda
# yarn
yarn add onborda
```

### Global `layout.tsx`
```tsx
<OnbordaProvider>
  <Onborda steps={steps}>
    {children}
  </Onborda>
 </OnbordaProvider>
```

### Components & `page.tsx`
Target anything in your app using the elements `id` attribute.
```tsx
<div id="onborda-step1">Onboard Step</div>
```

### Tailwind config
Tailwind CSS will need to scan the node module in order to include the classes used. See [configuring source paths](https://tailwindcss.com/docs/content-configuration#configuring-source-paths) for more information about this topic.

> **Note** _You only require this if you're **not using** a custom component.

```ts
const config: Config = {
  content: [
    './node_modules/onborda/dist/**/*.{js,ts,jsx,tsx}' // Add this
  ]
}
```

### Custom Card 
If you require greater control over the card design or simply wish to create a totally custom component then you can do so easily.

| Prop          | Type             | Description                                                          |
|---------------|------------------|----------------------------------------------------------------------|
| `step`         | `Object`          | The current `Step` object from your steps array, including content, title, etc.         |
| `currentStep`   | `number`         | The index of the current step in the steps array.                    |
| `totalSteps`    | `number`         | The total number of steps in the onboarding process.                 |
| `nextStep`      |                  | A function to advance to the next step in the onboarding process.    |
| `prevStep`      |                  | A function to go back to the previous step in the onboarding process.|
| `arrow`         |                  | Returns an SVG object, the orientation is controlled by the steps side prop |

```tsx
"use client"
import type { CardComponentProps } from "onborda";

export const CustomCard = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  arrow,
}: CardComponentProps) => {
  return (
    <div>
      <h1>{step.icon} {step.title}</h1>
      <h2>{currentStep} of {totalSteps}</h2>
      <p>{step.content}</p>
      <button onClick={prevStep}>Previous</button>
      <button onClick={nextStep}>Next</button>
      {arrow}
    </div>
  )
}
```

### Steps object
Steps have changed since Onborda v1.2.3 and now fully supports multiple "tours" so you have the option to create multple product tours should you need to! The original Step format remains but with some additional content as shown in the example below!

```tsx
{
  tour: "firstyour",
  steps: [
    Step
  ],
  tour: "secondtour",
  steps: [
    Step
  ]
}
```

### Step object

| Prop           | Type                          | Description                                                                           |
|----------------|-------------------------------|---------------------------------------------------------------------------------------|
| `icon`           | `React.ReactNode`, `string`, `null` | Optional. An icon or element to display alongside the step title.                                |
| `title`          | `string`                        | The title of your step                     |
| `content`        | `React.ReactNode`               | The main content or body of the step.                                                 |
| `selector`       | `string`                        | A string used to target an `id` that this step refers to.            |
| `side`           | `"top"`, `"bottom"`, `"left"`, `"right"` | Optional. Determines where the tooltip should appear relative to the selector.          |
| `showControls`   | `boolean`                       | Optional. Determines whether control buttons (next, prev) should be shown if using the default card.           |
| `pointerPadding` | `number`                        | Optional. The padding around the pointer (keyhole) highlighting the target element.             |
| `pointerRadius`  | `number`                        | Optional. The border-radius of the pointer (keyhole) highlighting the target element.           |
| `nextRoute`      | `string`                        | Optional. The route to navigate to using `next/navigation` when moving to the next step.                      |
| `prevRoute`      | `string`                        | Optional. The route to navigate to using `next/navigation` when moving to the previous step.                  |

> **Note** _Both `nextRoute` and `prevRoute` have a `500`ms delay before setting the next step, a function will be added soon to control the delay in case your application loads slower than this._

### Example `steps`

```tsx
{
  tour: "firsttour",
  steps: [
    {
      icon: <>👋</>,
      title: "Tour 1, Step 1",
      content: <>First tour, first step</>,
      selector: "#tour1-step1",
      side: "top",
      showControls: true,
      pointerPadding: 10,
      pointerRadius: 10,
      nextRoute: "/foo",
      prevRoute: "/bar"
    }
    ...
  ],
  tour: "secondtour",
  steps: [
    icon: <>👋👋</>,
      title: "Second tour, Step 1",
      content: <>Second tour, first step!</>,
      selector: "#onborda-step1",
      side: "top",
      showControls: true,
      pointerPadding: 10,
      pointerRadius: 10,
      nextRoute: "/foo",
      prevRoute: "/bar"
  ]
}
```

### Onborda Props

| Property        | Type                  | Description                                                                           |
|-----------------|-----------------------|---------------------------------------------------------------------------------------|
| `children`      | `React.ReactNode`     | Your website or application content.                                                  |
| `interact`      | `boolean`             | Optional. Controls whether the onboarding overlay should be interactive. Defaults to `false`. |
| `steps`         | `Array[]`             | An array of `Step` objects defining each step of the onboarding process.              |
| `showOnborda`   | `boolean`             | Optional. Controls the visibility of the onboarding overlay, eg. if the user is a first time visitor. Defaults to `false`.                         |
| `shadowRgb`     | `string`              | Optional. The RGB values for the shadow color surrounding the target area. Defaults to black `"0,0,0"`.      |
| `shadowOpacity` | `string`              | Optional. The opacity value for the shadow surrounding the target area. Defaults to `"0.2"`          |
| `customCard`    | `React.ReactNode`     | Optional. A custom card (or tooltip) that can be used to replace the default TailwindCSS card. |
| `cardTransition`| `Transition`          | Transitions between steps are of the type Transition from [framer-motion](https://www.framer.com/motion/transition/), see the [transition docs](https://www.framer.com/motion/transition/) for more info. Example: `{{ type: "spring" }}`. |


```tsx
<Onborda
  steps={steps}
  showOnborda={true}
  shadowRgb="55,48,163"
  shadowOpacity="0.8"
  cardComponent={CustomCard}
  cardTransition={{ duration: 2, type: "tween" }}
>
  {children}
</Onborda>
```
