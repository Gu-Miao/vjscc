import {
  isStringOrHTMLElement,
  getElement,
  isNumber,
  fadeIn,
  fadeOut,
  linear,
  Easing
} from '@vjscc/utils'
import './index.less'

type AnimationAction = (el: HTMLElement, options: { duration: number; easing: Easing }) => any

type AnimationOptions = {
  in: AnimationAction
  out: AnimationAction
  duration: number
  easing: Easing
}

type Handler = (this: VjsccModal, e: MouseEvent) => any

export type VjsccModalConstructorOptions = {
  el: string | HTMLElement
  style?: 'primary' | 'success' | 'warning' | 'danger'
  width?: string | number
  show?: boolean
  mask?: boolean
  maskClose?: boolean
  escapeClose?: boolean
  animation?: AnimationOptions
  onConfirm?: Handler
  onCancel?: Handler
}

const defaultVjsccModalConstructorOptions: Partial<VjsccModalConstructorOptions> = {
  show: false,
  mask: true,
  maskClose: true,
  escapeClose: true,
  animation: {
    in: fadeIn,
    out: fadeOut,
    duration: 500,
    easing: linear
  }
}

const activeModals: VjsccModal[] = []

window.addEventListener('keyup', e => {
  if (e.key !== 'Escape' || !activeModals.length) return
  const last = activeModals.at(-1) as VjsccModal
  if (!last.escapeClose) return
  last.show = false
})

function hideScrollBar() {
  document.body.classList.add('vjscc-modal-no-scrollbar')
}
function restoreScrollBar() {
  document.body.classList.remove('vjscc-modal-no-scrollbar')
}

function setShow(this: VjsccModal, show: boolean) {
  if (show) {
    activeModals.push(this)
    hideScrollBar()
  } else {
    const index = activeModals.findIndex(modal => modal === this)
    if (index !== -1) activeModals.splice(index, 1)
    if (!activeModals.length) restoreScrollBar()
  }
  if (this.animation) {
    const options = { duration: this.animation.duration, easing: this.animation.easing }
    this.animation[show ? 'in' : 'out'](this.$root, options)
  } else {
    this.$root.style.display = show ? 'block' : 'none'
  }
}

class VjsccModal {
  $root: HTMLElement
  $container: HTMLElement
  $closeIcon: HTMLElement | null
  $header: HTMLElement | null
  $body: HTMLElement | null
  $footer: HTMLElement | null
  $confirm: HTMLElement | null
  $cancel: HTMLElement | null
  onConfirm?: Handler
  onCancel?: Handler
  mask: boolean
  maskClose: boolean
  escapeClose: boolean
  animation?: AnimationOptions
  get show(): boolean {
    return getComputedStyle(this.$root).display !== 'none'
  }
  set show(show: boolean) {
    if (this.show === show) return
    setShow.call(this, show)
  }
  /**
   * Create modal instance
   * @param options Options for creating modal instance
   */
  constructor(options: VjsccModalConstructorOptions) {
    let { el, width, show, mask, maskClose, escapeClose, animation, onConfirm, onCancel } = {
      ...defaultVjsccModalConstructorOptions,
      ...options
    }

    if (!isStringOrHTMLElement(el)) {
      throw new Error(
        `[@vjscc/modal] 'el' is not a selector string or HTMLElement when constructing.`
      )
    }
    const $root = getElement(el)
    if (!$root) {
      throw new Error(
        `[@vjscc/modal] Cann't get valid root element via ${el}, checkout your options when constructing.`
      )
    }
    this.$root = $root

    const $container = getElement('.vjscc-modal-container', this.$root)
    if (!$container) {
      throw new Error(
        `[@vjscc/modal] Cann't get valid container element via '.vjscc-modal-mask', checkout your dom structure when constructing.`
      )
    }
    this.$container = $container
    if (width) {
      this.$container.style.width = isNumber(width) ? `${width}px` : `${width}`
    }
    this.$container.addEventListener('click', e => {
      e.stopPropagation()
    })

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
    this.onConfirm = onConfirm
    if (this.$confirm) {
      this.$confirm.addEventListener('click', e => {
        e.stopPropagation()
        this.onConfirm ? this.onConfirm.call(this, e) : (this.show = false)
      })
    }

    this.$cancel = this.$footer ? getElement('.vjscc-modal-cancel', this.$footer) : null
    this.onCancel = onCancel
    if (this.$cancel) {
      this.$cancel.addEventListener('click', e => {
        e.stopPropagation()
        this.onCancel ? this.onCancel.call(this, e) : (this.show = false)
      })
    }

    this.mask = Boolean(mask)
    this.maskClose = Boolean(maskClose)
    this.$root.addEventListener('click', e => {
      e.stopPropagation()
      if (this.maskClose) this.show = false
    })

    this.escapeClose = Boolean(escapeClose)
    this.animation = animation
    if (this.show && show) {
      setShow.call(this, show)
    } else {
      this.show = Boolean(show)
    }
  }
}

export default VjsccModal
