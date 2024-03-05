# Onborda
Onborda is a lightweight onboarding flow that utilises [framer-motion](https://www.framer.com/motion/) for animations and [tailwindcss](https://tailwindcss.com/) for styling.

## Demo

- [onborda.vercel.app](onborda.vercel.app)

### Install
```bash
# npm
npm i onborda
# pnpm
pnpm add onborda
# yarn
yarn add onborda
```

### `layout.tsx`
```tsx
<OnbordaProvider>
  <Onborda steps={steps} showOnborda={true}>
    {children}
  </Onborda>
 </OnbordaProvider>
```

### `page.tsx` and Components
Target anything in your app using the elements `id` attribute.
```tsx
<div id="onborda-step1">Onboard Step</div>
```

## Setup
Tailwind CSS will need to scan the node module in order to include the classes used. See [configuring source paths](https://tailwindcss.com/docs/content-configuration#configuring-source-paths) for more information about this topic.

```ts
const config: Config = {
  content: [
    './node_modules/onborda/dist/**/*.{js,ts,jsx,tsx}' // Add this
  ]
}
```

## Options

### Steps

| Property        | Type                       | Description                                                                           |
|-----------------|----------------------------|---------------------------------------------------------------------------------------|
| `icon`          | `React.ReactNode`, `string`, `null` | An icon or text to display alongside the step title.                                  |
| `title`         | `string`                   | The title of the step.                                                                |
| `content`       | `React.ReactNode`          | The content to display for the step. Can include JSX/React components.                |
| `selector`      | `string`                   | A CSS selector to attach the step to a specific DOM element.                          |
| `side`          | `"top"`, `"bottom"`, `"left"`, `"right"` | Optional. The side where the step card should appear relative to the element.         |
| `showControls`  | `boolean`                  | Optional. If `true`, shows navigation controls on the step.                           |
| `pointerPadding`| `number`                   | Optional. Padding around the highlighted area in pixels.                              |
| `pointerRadius` | `number`                   | Optional. The border-radius of the highlighted area.                                  |
| `nextRoute`     | `string`                   | Optional. Uses `useRouter` from next/navigation to push route changes                 |
| `prevRoute`     | `string`                   | Optional. Uses `useRouter` from next/navigation to push route changes                 |

### Onborda Props

| Property        | Type                       | Description                                                                           |
|-----------------|----------------------------|---------------------------------------------------------------------------------------|
| `children`      | `React.ReactNode`          | The children elements that the onboarding steps will be rendered over.                |
| `steps`         | `Step[]`                   | An array of `Step` objects defining each step of the onboarding process.              |
| `showOnborda`   | `boolean`                  | Optional. Controls the visibility of the onboarding overlay.                          |
| `shadowRgb`     | `string`                   | Optional. The RGB values for the shadow color surrounding the highlighted area.       |
| `shadowOpacity` | `string`                   | Optional. The opacity value for the shadow surrounding the highlighted area.          |
