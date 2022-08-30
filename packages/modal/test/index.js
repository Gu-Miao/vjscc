/** @type {typeof import('..').default} */
const VjsccModal = window.VjsccModal

const modal = new VjsccModal({
  el: '.vjscc-modal-root',
  show: true,
  maskClose: true,
  onConfirm(e) {
    console.log(e, this)
  }
})
