import { isWindow, isDocument, getCurrentProgress, easeInCubic, AnyFn, Easing } from '@vjscc/utils'
import './index.less'

type Container = Window | Document | HTMLElement

type Options = {
  container?: Container
  callback?: AnyFn
  duration?: number
  easing?: Easing
  visibilityHeight?: number | false
  btn?: HTMLElement
}

const defaultOptions: Options = {
  container: window,
  visibilityHeight: 500,
  duration: 1 * 1000,
  easing: easeInCubic,
}

let instance: VjsccBackTop | null = null
let handleClick: AnyFn | null = null
let handleScroll: AnyFn | null = null

export default class VjsccBackTop {
  container: Container
  btn: HTMLElement
  visibilityHeight: number
  duration: number
  easing: Easing
  callback?: AnyFn

  constructor(options: Options) {
    if (instance) {
      instance.destroy()
      instance = null
    }

    const config = { ...defaultOptions, ...options } as Required<Options>
    this.container = config.container
    this.callback = config.callback
    this.duration = config.duration
    this.easing = config.easing
    this.visibilityHeight = +config.visibilityHeight
    this.btn = config.btn || createBtn()

    handleClick = () => this.backTop()
    handleScroll = () => {
      const scrollTop = getScrollTop(this.container)
      if (scrollTop < this.visibilityHeight) {
        this.btn.style.display = 'none'
      } else {
        this.btn.style.display = ''
      }
    }

    this.btn.addEventListener('click', handleClick)
    this.container.addEventListener('scroll', handleScroll)

    handleScroll()

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    instance = this
  }

  /**
   * Back to top
   * @param y Padding of top, default is 0
   */
  backTop(y = 0) {
    const from = getScrollTop(this.container)
    const startTime = Date.now()

    const scroll = () => {
      const now = Date.now()
      const time = now - startTime
      const scrollTop = getCurrentProgress(time, this.duration, from, y, this.easing)

      if (isWindow(this.container)) {
        window.scrollTo(window.pageXOffset, scrollTop)
      } else if (isDocument(this.container)) {
        document.documentElement.scrollTop = scrollTop
      } else {
        this.container.scrollTop = scrollTop
      }
      if (time < this.duration) {
        requestAnimationFrame(scroll)
      } else if (typeof this.callback === 'function') {
        this.callback()
      }
    }

    requestAnimationFrame(scroll)
  }

  destroy() {
    this.btn.removeEventListener('click', handleClick as AnyFn)
    this.container.removeEventListener('scroll', handleScroll as AnyFn)

    handleClick = null
    handleScroll = null

    if (this.btn.classList.contains('vjscc-backtop')) {
      this.btn.remove()
    }

    for (const name in this) {
      delete this[name]
    }

    Object.setPrototypeOf(this, null)
  }
}

/**
 * Create back to top button and append it to `document.body`.
 *
 * @returns Created button element.
 */
function createBtn() {
  const btn = document.createElement('button')
  btn.innerHTML =
    '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M853.333333 170.666667H170.666667v85.333333h288L221.866667 571.733333A42.624 42.624 0 0 0 256 640h85.333333v170.666667a42.666667 42.666667 0 0 0 42.666667 42.666666h256a42.666667 42.666667 0 0 0 42.666667-42.666666v-170.666667h85.333333a42.709333 42.709333 0 0 0 34.133333-68.266667L565.333333 256H853.333333V170.666667z m-213.333333 384a42.666667 42.666667 0 0 0-42.666667 42.666666v170.666667h-170.666666v-170.666667a42.666667 42.666667 0 0 0-42.666667-42.666666H341.333333l170.666667-227.541334L682.666667 554.666667h-42.666667z" fill="#fff"></path></svg>'
  btn.classList.add('vjscc-backtop')
  if (document.body) {
    document.body.append(btn)
  } else {
    window.addEventListener('load', () => document.body.append(btn))
  }
  return btn
}

/**
 * Get Scroll distance of container.
 *
 * @param container Container of scroll.
 * @returns Scroll distance.
 */
function getScrollTop(container: Container) {
  let result = 0
  if (isWindow(container)) {
    result = container.scrollY
  } else if (isDocument(container)) {
    result = document.documentElement.scrollTop
  } else {
    result = container.scrollTop
  }
  if (container && !isWindow(container) && typeof result !== 'number') {
    result = (container.ownerDocument || container).documentElement.scrollTop
  }
  return result
}
