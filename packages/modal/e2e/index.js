/** @type {typeof import('..').default} */
const VjsccModal = window.VjsccModal

const modal = new VjsccModal({
  el: '.vjscc-modal-root',
  show: true,
  maskClose: true,
  onConfirm(e) {
    onConfirm()
  }
})

let i = 0

function onConfirm() {
  const content = new Array(200).fill(i++).join(' ')
  VjsccModal.create({
    width: Math.round(Math.random() * 1000),
    show: true,
    mask: true,
    maskClose: true,
    closeIcon: true,
    title: 'Delete this blog?',
    type: 'danger',
    content,
    confirm: {
      text: 'Yes',
      props: {
        // disabled: true
      },
      onClick: onConfirm
    },
    cancel: {
      text: 'fuck',
      props: {
        // disabled: true
      }
    },
    // footer: 'asfasdf',
    animation: {
      duration: 300,
      easing(x) {
        return x ** 2
      }
    },
    hideScrollBar: true
  })
}
