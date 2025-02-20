# @vjscc/utils

Vanilla JavaScript utils collection.

![npm](https://img.shields.io/npm/v/@vjscc/utils?logo=npm&style=flat-square)
![npm type definitions](https://img.shields.io/npm/types/@vjscc/utils?logo=typescript&style=flat-square)
![npm bundle size](https://img.shields.io/bundlephobia/min/@vjscc/utils?logo=npm&style=flat-square)
![Codecov](https://img.shields.io/codecov/c/github/vjscc/utils?logo=codecov&style=flat-square)
![GitHub](https://img.shields.io/github/license/vjscc/utils?logo=github&style=flat-square)

## Install

```bash
npm install @vjscc/utils -S
```

- Or some CDN service supported github like [jsdelivr](https://www.jsdelivr.com/).

- Or visit [github releases page](https://github.com/vjscc/utils/releases) to download dist zip.

## Usage

import utility funcions and call them as you wish.

```js
// ESM
import { isHTMLElement } from '@vjscc/utils'
const random1 = isHTMLElement(document.body)

// CommonJS
const { isHTMLElement } = require('@vjscc/utils')
const random2 = isHTMLElement(document.body)

// From window
const { isHTMLElement } = window.VjsccUtils
const random3 = isHTMLElement(document.body)
```

## API

### AnyFn

A type describes any function.

```ts
type AnyFn = (...args: any[]) => any
```

### isUndefined(value)

Checks if value is `undefined`.

### isNull(value)

Checks if value is `null`.

### isString(value)

Checks if value is classified as a String primitive or object.

### isNumber(value)

Checks if value is classified as a Number primitive or object.

### isArray(value)

Checks if value is classified as an Array object.

### isPlainObject(value)

Checks if value is a plain object, that is, an object created by the Object constructor or one with a `[[Prototype]]` of null.

### isFunction(value)

Checks if value is a callable function.

### isHTMLElement(value)

Checks if value is a HTMLElement.

### isDocument(value)

Checks if value is `Document`.

### isHTMLElementOrDocument(value)

Checks if value is `Document` or a HTMLElement.

### isStringOrHTMLElement(value)

Checks if value is a HTMLElement or String primitive or object.

### getElement(selector, container)

Function type:

```ts
type getElement = (
  selector: string | HTMLElement,
  container: HTMLElement | Document = document,
) => HTMLElement | null
```

Arguments:

- `selector`: CSS selector or a HTMLElement.
- `container`: A container element that will call `querySelector`.

Get element by `container` and `selector`.

If `selector` is `HTMLElement`, return it directly. Otherwise, use `querySelector` to find the element using CSS selector.

### isWindow(value)

Checks if value is `window`.

### Easing Functions

All the easing functions fit this type:

```ts
type EasingFunction = (x: number) => number
```

We will list all the function names below, if you want to check detail, plase go [/src/easings.ts](./src/easings.ts).

- linear
- swing
- easeInQuad
- easeOutQuad
- easeInOutQuad
- easeInCubic
- easeOutCubic
- easeInOutCubic
- easeInQuart
- easeOutQuart
- easeInOutQuart
- easeInQuint
- easeOutQuint
- easeInOutQuint
- easeInSine
- easeOutSine
- easeInOutSine
- easeInExpo
- easeOutExpo
- easeInCirc
- easeOutCirc
- easeInOutCirc
- easeInElastic
- easeOutElastic
- easeInOutElastic
- easeInBack
- easeOutBack
- easeInOutBack
- easeInBounce
- easeOutBounce
- easeInOutBounce

### getCurrentProgress(currentTime, duration, startValue, targetValue, fn)

Use easing function to calculate current value in progress.

Type:

```ts
type getCurrentProgress = (
  currentTime: number,
  duration: number,
  startValue: number,
  targetValue: number,
  fn?: (x: number) => number,
) => number
```

- `currentTime`: current time.
- `duration`: duration.
- `startValue`: start value.
- `targetValue`: target value.
- `fn`: _[optional]_ easing function, default is [`linear`](#easing-functions).

example:

```js
getCurrentProgress(1, 10, 0, 10) // Value rang is [0, 10], total duration is 10, current is 1, so the result should be (10 - 0) * (1 / 10) = 1
getCurrentProgress(5, 10, 0, 10) // Value rang is [0, 10], total duration is 10, current is 5, so the result should be (10 - 0) * (5 / 10) = 5
```

### AnimationFnOptions

A type describes the options of animation functions.

```ts
type AnimationFnOptions = {
  duration: number
  easing?: (x: number) => number
  callback?: (...args: any[]) => any
}
```

### fadeIn/fadeOut

Animation function that let element fade in/out.

Options type:

```ts
type FadeFnOptions = AnimationFnOptions & {
  startOpacity?: number
  startDisplay?: string
  endOpacity?: number
  endDisplay?: string
}
```

#### fadeIn(el, options)

Type:

```ts
type fadeIn = (el: HTMLElement, options: FadeFnOptions) => void
```

- el: DOM element.
- options: options.

| name           | description                             | optional | type                    |
| -------------- | --------------------------------------- | -------- | ----------------------- |
| `duration`     | animation duration                      |          | `number`                |
| `easing`       | easing function                         | ✅       | `(x: number) => number` |
| `callback`     | callback function after the animation   | ✅       | `AnyFn`                 |
| `startOpacity` | opacity value when the animation starts | ✅       | `number`                |
| `startDisplay` | display when the animation starts       | ✅       | `string`                |
| `endOpacity`   | opacity value when the animation starts | ✅       | `number`                |
| `endDisplay`   | display when the animation starts       | ✅       | `string`                |

## LICENSE

MIT
