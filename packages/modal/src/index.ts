import {
  isStringOrHTMLElement,
  getElement,
  isNumber,
  fadeIn,
  fadeOut,
  linear,
  Easing,
} from '@vjscc/utils'
import './index.less'

export type AnimationAction = (
  el: HTMLElement,
  options: { duration: number; easing: Easing },
) => any

export type AnimationOptions = {
  in: AnimationAction
  out: AnimationAction
  duration: number
  easing: Easing
}

export type Handler = (this: VjsccModal, e: MouseEvent) => any

export type ButtonOptions = {
  text: string
  props?: Record<string, any>
  onClick?: Handler
}

export type VjsccModalStyle = 'default' | 'primary' | 'success' | 'warning' | 'danger'

export type VjsccModalConstructorOptions = {
  el: string | HTMLElement
  style?: VjsccModalStyle
  width?: string | number
  show?: boolean
  mask?: boolean
  maskClose?: boolean
  escapeClose?: boolean
  animation?: Partial<AnimationOptions>
  onConfirm?: Handler
  onCancel?: Handler
}

export type VjsccModalCreateOptions = {
  style?: VjsccModalStyle
  width?: string | number
  show?: boolean
  mask?: boolean
  maskClose?: boolean
  escapeClose?: boolean
  closeIcon?: boolean
  title?: string | HTMLElement
  content?: string | HTMLElement
  footer?: string | HTMLElement | null
  confirm?: ButtonOptions
  cancel?: ButtonOptions
  animation?: AnimationOptions
}

const defaultOptions: Partial<VjsccModalConstructorOptions> = {
  maskClose: true,
  escapeClose: true,
  animation: {
    in: fadeIn,
    out: fadeOut,
    duration: 500,
    easing: linear,
  },
}

const defaultCreateOptions: Partial<VjsccModalCreateOptions> = {
  closeIcon: true,
  confirm: { text: 'OK' },
  cancel: { text: 'Cancel' },
}

/** An array to save displayed modals. */
const activeModals: VjsccModal[] = []

// Setup a listener to handle esc pressing
window.addEventListener('keyup', e => {
  if (e.key !== 'Escape' || !activeModals.length) return
  const last = activeModals.at(-1) as VjsccModal
  if (!last.escapeClose) return
  last.show = false
})

class VjsccModal {
  /** Root element of modal. */
  $root: HTMLElement
  /** Container element of modal. */
  $container: HTMLElement
  /** Close button element of modal. */
  $closeIcon: HTMLElement | null
  /** Header element of modal. */
  $header: HTMLElement | null
  /** Body element of modal. */
  $body: HTMLElement | null
  /** Footer element of modal. */
  $footer: HTMLElement | null
  /** Confirm button of modal. */
  $confirm: HTMLElement | null
  /** Cancel button of modal. */
  $cancel: HTMLElement | null
  /** handler of clicking the confirm button. */
  onConfirm?: Handler
  /** handler of clicking the cancel button. */
  onCancel?: Handler
  /** Whether modal should be closed when the mask is clicked. */
  maskClose: boolean
  /** Whether modal should be closed when the esc is pressed. */
  escapeClose: boolean
  /** Animation options for entering and leaving. */
  animation?: AnimationOptions
  /**
   * Whether modal is show or not. It uses `this.$root.display` as a condition,
   * so pay attention to the animation, this property changes when the animation
   * completely done.
   */
  get show(): boolean {
    return getComputedStyle(this.$root).display !== 'none'
  }
  /** Set show property and visiblity of modal. */
  set show(show: boolean) {
    if (this.show === show) return
    setShow.call(this, show)
  }
  /** Whether modal has a mask. */
  get mask(): boolean {
    return !this.$root.classList.contains('vjscc-modal-no-mask')
  }
  /** Set mask of modal */
  set mask(mask: boolean) {
    if (mask === this.mask) return
    this.$root.classList[mask ? 'remove' : 'add']('vjscc-modal-no-mask')
  }
  /** Style of modal */
  get style(): VjsccModalStyle {
    let style: VjsccModalStyle = 'default'
    this.$root.classList.value.split(' ').some(className => {
      const match = className.match(/vjscc-modal-(primary|success|warning|danger)/)
      if (match) {
        style = match[1] as VjsccModalStyle
        return true
      }
    })
    return style
  }
  /** Set style of modal */
  set style(style: VjsccModalStyle) {
    if (this.style === style) return
    const classList = this.$root.classList
    classList.forEach(className => {
      if (/vjscc-modal-(primary|success|warning|danger)/.test(className)) {
        classList.remove(className)
      }
    })
    if (style !== 'default') classList.add(`vjscc-modal-${style}`)
  }
  /**
   * Constructor of VjsccModal.
   * @param options Constructor options.
   */
  constructor(options: VjsccModalConstructorOptions) {
    const { el, style, width, show, mask, maskClose, escapeClose, animation, onConfirm, onCancel } =
      mergeOptions(defaultOptions, options)

    if (!isStringOrHTMLElement(el)) {
      throw err('`el` is not a CSS selector string or HTMLElement.')
    }

    // Root
    const $root = getElement(el)
    if (!$root) {
      throw err('Can not get root element, check `el` option passed to constructor.')
    }
    this.$root = $root

    // Container
    const $container = getElement('.vjscc-modal-container', this.$root)
    if (!$container) {
      throw err('Can not get container element, check if the `.vjscc-modal-mask` element exists.')
    }
    this.$container = $container
    this.$container.addEventListener('click', e => e.stopPropagation())

    // Close icon
    this.$closeIcon = getElement('.vjscc-modal-close', this.$container)
    if (this.$closeIcon) {
      this.$closeIcon.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="m13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29l-4.3 4.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l4.29-4.3l4.29 4.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42Z"/></svg>'
      this.$closeIcon.addEventListener('click', e => {
        e.stopPropagation()
        this.show = false
      })
    }

    // Header, body and footer
    this.$header = getElement('.vjscc-modal-header', this.$container)
    this.$body = getElement('.vjscc-modal-body', this.$container)
    this.$footer = getElement('.vjscc-modal-footer', this.$container)

    // Confirm button
    this.$confirm = this.$footer ? getElement('.vjscc-modal-confirm', this.$footer) : null
    this.onConfirm = onConfirm
    if (this.$confirm) {
      this.$confirm.addEventListener('click', e => {
        e.stopPropagation()
        this.onConfirm ? this.onConfirm.call(this, e) : (this.show = false)
      })
    }

    // Cancel button
    this.$cancel = this.$footer ? getElement('.vjscc-modal-cancel', this.$footer) : null
    this.onCancel = onCancel
    if (this.$cancel) {
      this.$cancel.addEventListener('click', e => {
        e.stopPropagation()
        this.onCancel ? this.onCancel.call(this, e) : (this.show = false)
      })
    }

    // Style
    if (style !== undefined) {
      this.style = style
    }

    // Width
    if (width) {
      this.$container.style.width = isNumber(width) ? `${width}px` : `${width}`
    }

    // Mask
    if (mask !== undefined) {
      this.mask = Boolean(mask)
    }

    // Mask close
    this.maskClose = Boolean(maskClose)
    this.$root.addEventListener('click', e => {
      e.stopPropagation()
      if (this.maskClose) this.show = false
    })

    // Esc close
    this.escapeClose = Boolean(escapeClose)

    // Animation
    this.animation = animation as AnimationOptions

    // Show
    if (this.show && show) {
      enter(this)
    } else {
      this.show = Boolean(show)
    }
  }
  /**
   * Create VjsccModal.
   * @param options Modal options.
   * @returns Modal instance.
   */
  static create(options: VjsccModalCreateOptions) {
    const {
      style,
      width,
      show,
      mask,
      maskClose,
      closeIcon,
      escapeClose,
      title,
      content,
      footer,
      confirm,
      cancel,
      animation,
    } = mergeOptions(defaultCreateOptions, options)

    // Root
    const $root = document.createElement('div')
    $root.classList.add('vjscc-modal')
    document.body.append($root)

    // Container
    const $container = document.createElement('div')
    $container.classList.add('vjscc-modal-container')
    $root.append($container)

    // Close icon
    if (closeIcon) {
      const $closeIcon = document.createElement('button')
      $closeIcon.classList.add('vjscc-modal-close')
      $container.prepend($closeIcon)
    }

    // Header
    const $header = document.createElement('div')
    $header.classList.add('vjscc-modal-header')
    if (title) $header.append(title)
    $container.append($header)

    // Body
    const $body = document.createElement('div')
    $body.classList.add('vjscc-modal-body')
    if (content) $body.append(content)
    $container.append($body)

    // If `footer` is `null`, we will not render footer element.
    if (footer !== null) {
      // Footer
      const $footer = document.createElement('div')
      $footer.classList.add('vjscc-modal-footer')
      $container.append($footer)

      // If `footer` is `undefined`, it means we should render it by
      // default way: a confirm button and a cancel button in it.
      if (footer === undefined) {
        // Confirm button
        const $confirm = createButton(confirm as ButtonOptions)
        $confirm.classList.add('vjscc-modal-confirm')

        // Cacncel button
        const $cancel = createButton(cancel as ButtonOptions)
        $cancel.classList.add('vjscc-modal-cancel')

        $footer.append($confirm, $cancel)
      } else {
        // `footer` is not `null` or `undefined`, it means user customizes
        // the inner content of footer, so just call `append`.
        $footer.append(footer)
      }
    }

    return new VjsccModal({
      el: $root,
      style,
      width,
      show,
      mask,
      maskClose,
      escapeClose,
      onConfirm: (confirm as ButtonOptions).onClick,
      onCancel: (cancel as ButtonOptions).onClick,
      animation,
    })
  }
}

/**
 * Set show property of modal. This will handle the data in `activeModals`,
 * hide or restore sroll bar of `document.body` and hide or show the modal
 * by animation or do it deriectly.
 *
 * @param this The context this of function point to.
 * @param show Whether show modal or not.
 */
function setShow(this: VjsccModal, show: boolean) {
  if (show) {
    enter(this)
  } else {
    const index = activeModals.findIndex(modal => modal === this)
    if (index !== -1) activeModals.splice(index, 1)
    if (!activeModals.length) restoreScrollBar()
    if (this.animation) {
      this.animation.out(this.$root, {
        duration: this.animation.duration,
        easing: this.animation.easing,
      })
    } else {
      this.$root.style.display = 'none'
    }
  }
}

/**
 * Let modal enter.
 * @param modal The modal to show.
 */
function enter(modal: VjsccModal) {
  activeModals.push(modal)
  hideScrollBar()
  if (modal.animation) {
    modal.animation.in(modal.$root, {
      duration: modal.animation.duration,
      easing: modal.animation.easing,
    })
  } else {
    modal.$root.style.display = ''
  }
}

/**
 * Merge options recursively.
 * @param defaultOptions Default options.
 * @param options Options passed.
 * @returns Merged options.
 */
function mergeOptions<T extends Record<string, any>>(defaultOptions: Partial<T>, options: T) {
  const mergedOptions = { ...defaultOptions } as T
  for (const key in options) {
    if (options[key] !== undefined) {
      if (typeof mergedOptions[key] === 'object') {
        mergedOptions[key] = mergeOptions(mergedOptions[key], options[key])
      } else {
        mergedOptions[key] = options[key]
      }
    }
  }
  return mergedOptions
}

/**
 * Create button element.
 * @param options Options for creating button.
 * @returns HTMLButtonElement.
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

/**
 * Hide scroll bar of `document.body` by adding `.vjscc-modal-no-scrollbar` class name.
 */
function hideScrollBar() {
  document.body.classList.add('vjscc-modal-no-scrollbar')
}

/**
 * Restore scroll bar of `document.body` by removing `.vjscc-modal-no-scrollbar` class name.
 */
function restoreScrollBar() {
  document.body.classList.remove('vjscc-modal-no-scrollbar')
}

/**
 * Create an error with message.
 * @param msg Message.
 * @returns An error instance.
 */
function err(msg: string) {
  return new Error(`[@vjscc/modal]: ${msg}`)
}

export default VjsccModal
