import { fadeIn, fadeOut, isStringOrHTMLElement, getElement, linear, isNumber } from '@vjscc/utils'
import './index.less'

type AnimationHandler = (el: HTMLElement, duration: number, easing: (x: number) => number) => any

export type AnimationOptions = {
  easing?: (x: number) => number
  duration?: number
  in?: AnimationHandler
  out?: AnimationHandler
}

export type Handler = (this: VjsccModal, e: MouseEvent) => VjsccModal

export type VjsccModalConstructorOptions = {
  el: string | HTMLElement
  width?: string | number
  show?: boolean
  maskClose?: boolean
  onConfirm?: Handler
  onCancel?: Handler
  animation?: boolean | AnimationOptions
}

export type ButtonOptions = {
  text: string
  props?: Record<string, any>
  onClick?: Handler
}

export type VjsccModalUtilOptions = {
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  width?: string | number
  show?: boolean
  mask?: boolean
  maskClose?: boolean
  closeIcon?: boolean
  title?: string | HTMLElement
  content?: string | HTMLElement
  footer?: string | HTMLElement | null
  confirm?: ButtonOptions
  cancel?: ButtonOptions
  animation?: boolean | AnimationOptions
}

const defaultAnimationOptions: Required<AnimationOptions> = {
  easing: linear,
  duration: 350,
  in(el, duration, easing) {
    fadeIn(el, { duration, easing })
  },
  out(el, duration, easing) {
    fadeOut(el, { duration, easing })
  }
}

/**
 * Create button element
 * @param options Options for creating button
 * @returns HTMLButtonElement
 */
function createButton(options: ButtonOptions) {
  const { text, props = {} } = options

  const $btn = document.createElement('button')
  $btn.innerHTML = text

  for (const key in props) {
    $btn.setAttribute(key, props[key])
  }

  return $btn
}

const activeModals: VjsccModal[] = []

function hideScrollBar() {
  if (getElement('#vjscc-modal-hide-scroll-bar')) return
  const style = document.createElement('style')
  style.innerText = 'html,body{overflow:hidden !important;width:calc(100% - 15px)}'
  style.id = 'vjscc-modal-hide-scroll-bar'
  document.head.append(style)
}

function restoreScrollBar() {
  const style = getElement('#vjscc-modal-hide-scroll-bar')
  style?.remove()
}

window.addEventListener('keyup', e => {
  if (e.key !== 'Escape' || !activeModals.length) return
  const last = activeModals.at(-1) as VjsccModal
  last.show = false
})

class VjsccModal {
  maskClose: boolean
  $root: HTMLElement
  $mask: HTMLElement | null
  $container: HTMLElement
  $closeIcon: HTMLElement | null
  $header: HTMLElement | null
  $body: HTMLElement | null
  $footer: HTMLElement | null
  $confirm: HTMLElement | null
  $cancel: HTMLElement | null
  #animation?: Required<AnimationOptions>
  #onConfirm?: (e: MouseEvent) => void
  #onCancel?: (e: MouseEvent) => void
  #status: 'creating' | 'show' | 'showing' | 'hide' | 'hidding'
  get show() {
    return getComputedStyle(this.$root).display !== 'none'
  }
  set show(show: boolean) {
    if (
      (show && ['show', 'showing'].includes(this.#status)) ||
      (!show && ['hide', 'hiding'].includes(this.#status))
    ) {
      return
    }
    if (show) {
      activeModals.push(this)
      hideScrollBar()
    } else {
      const i = activeModals.findIndex(modal => modal === this)
      activeModals.splice(i, 1)
      if (activeModals.length === 0) restoreScrollBar()
    }
    if (this.#animation) {
      const { duration, easing } = this.#animation
      this.#status = show ? 'showing' : 'hidding'
      const fn = this.#animation[show ? 'in' : 'out']
      fn(this.$root, duration, easing)
      return
    }
    this.$root.style.display = show ? '' : 'none'
  }
  /**
   * Create modal instance
   * @param options Options for creating modal instance
   */
  constructor(options: VjsccModalConstructorOptions) {
    let {
      el,
      width = 400,
      show = false,
      maskClose = false,
      onConfirm,
      onCancel,
      animation
    } = options

    this.#status = 'creating'

    if (!isStringOrHTMLElement(el)) {
      throw new Error(
        `[@vjscc/modal] 'el' is not a selector string or HTMLElement when constructing.`
      )
    }
    const element = getElement(el)
    if (!element) {
      throw new Error(
        `[@vjscc/modal] Cann't get valid root element via ${el}, checkout your options when constructing.`
      )
    }
    this.$root = element

    this.$mask = getElement('.vjscc-modal-mask', this.$root)
    const $container = getElement('.vjscc-modal-container', this.$root)
    if (!$container) {
      throw new Error(
        `[@vjscc/modal] Cann't get valid container element via '.vjscc-modal-mask', checkout your dom structure when constructing.`
      )
    }
    this.$container = $container
    this.$container.style.width = isNumber(width) ? `${width}px` : width

    this.$closeIcon = getElement('.vjscc-modal-close', this.$container)
    if (this.$closeIcon) {
      this.$closeIcon.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="m13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29l-4.3 4.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l4.29-4.3l4.29 4.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42Z"/></svg>'
      this.$closeIcon.addEventListener('click', e => {
        e.stopPropagation()
        this.show = false
      })
    }

    this.$header = getElement('.vjscc-modal-header', this.$container)
    this.$body = getElement('.vjscc-modal-body', this.$container)
    this.$footer = getElement('.vjscc-modal-footer', this.$container)

    this.$confirm = this.$footer ? getElement('.vjscc-modal-confirm', this.$footer) : null
    this.$cancel = this.$footer ? getElement('.vjscc-modal-cancel', this.$footer) : null

    this.maskClose = maskClose
    if (this.maskClose && this.$mask) {
      this.$mask.addEventListener('click', e => {
        e.stopPropagation()
        this.show = false
      })
    }

    if (animation !== false) {
      this.#animation = {
        ...defaultAnimationOptions,
        ...(typeof animation === 'object' ? animation : {})
      }
    }

    this.setConfirm(onConfirm)
    this.setCancel(onCancel)

    this.show = show
  }
  /**
   * Set click handler of confirm button
   * @param onConfirm Click handler of confirm button
   */
  setConfirm(onConfirm?: Handler) {
    if (!this.$confirm) {
      console.warn(`[@vjscc/modal] Can't get '$confirm' element when setting 'onConfirm'.`)
      return
    }
    if (this.#onConfirm) this.$confirm.removeEventListener('click', this.#onConfirm)
    this.#onConfirm = onConfirm
      ? (e: MouseEvent) => {
          e.stopPropagation()
          onConfirm.call(this, e)
        }
      : (e: MouseEvent) => {
          e.stopPropagation()
          this.show = false
        }
    this.$confirm.addEventListener('click', this.#onConfirm)
  }
  /**
   * Set click handler of cancel button
   * @param onCancel Click handler of cancel button
   */
  setCancel(onCancel?: Handler) {
    if (!this.$cancel) {
      console.warn(`[@vjscc/modal] Can't get '$cancel' element when setting 'onCancel'.`)
      return
    }
    if (this.#onCancel) this.$cancel.removeEventListener('click', this.#onCancel)
    this.#onCancel = onCancel
      ? (e: MouseEvent) => {
          e.stopPropagation()
          onCancel.call(this, e)
        }
      : (e: MouseEvent) => {
          e.stopPropagation()
          this.show = false
        }
    this.$cancel.addEventListener('click', this.#onCancel)
  }
  /**
   *
   * @param options
   * @returns
   */
  static create(options: VjsccModalUtilOptions) {
    const {
      type = 'default',
      width,
      show,
      mask = true,
      maskClose,
      closeIcon = true,
      title,
      content,
      footer,
      confirm = { text: 'OK' },
      cancel = { text: 'Cancel' },
      animation
    } = options

    const $root = document.createElement('div')
    $root.classList.add('vjscc-modal-root')
    if (type !== 'default') $root.classList.add(`vjscc-modal-${type}`)
    $root.innerHTML = '<div class="vjscc-modal-container">'
    document.body.append($root)

    const $container = getElement('.vjscc-modal-container', $root) as HTMLDivElement

    if (mask) {
      const $mask = document.createElement('div')
      $mask.classList.add('vjscc-modal-mask')
      $root.prepend($mask)
    }

    if (closeIcon) {
      const $closeIcon = document.createElement('button')
      $closeIcon.classList.add('vjscc-modal-close')
      $container.prepend($closeIcon)
    }

    const $header = document.createElement('div')
    $header.classList.add('vjscc-modal-header')
    if (title) $header.append(title)
    $container.append($header)

    const $body = document.createElement('div')
    $body.classList.add('vjscc-modal-body')
    if (content) $body.append(content)
    $container.append($body)

    if (footer !== null) {
      const $footer = document.createElement('div')
      $footer.classList.add('vjscc-modal-footer')
      $container.append($footer)
      if (footer === undefined) {
        const $confirm = createButton(confirm)
        $confirm.classList.add('vjscc-modal-confirm')
        const $cancel = createButton(cancel)
        $cancel.classList.add('vjscc-modal-cancel')
        $footer.append($confirm, $cancel)
      } else {
        $footer.append(footer)
      }
    }

    return new VjsccModal({
      el: $root,
      width,
      show,
      maskClose,
      onConfirm: confirm.onClick,
      onCancel: cancel.onClick,
      animation
    })
  }
}

export default VjsccModal
