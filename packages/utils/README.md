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

## LICENSE

MIT
