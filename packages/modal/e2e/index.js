/** @type {typeof import('..').default} */
const VjsccModal = window.VjsccModal

const modal = new VjsccModal({
  el: '.vjscc-modal',
  show: true,
  maskClose: true,
  escapeClose: false,
  onConfirm() {
    console.log(modal)
  }
})
