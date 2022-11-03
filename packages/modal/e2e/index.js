/** @type {typeof import('..').default} */
const VjsccModal = window.VjsccModal

// const modal = new VjsccModal({
//   el: '.vjscc-modal',
//   show: true,
//   mask: false,
//   maskClose: true,
//   escapeClose: false,
//   onConfirm() {
//     console.log(modal)
//   }
// })

const modal = VjsccModal.create({
  show: true,
  title: 'asdfa',
  content: 'fasdfasdfasdf',
  footer: 'no',
  // mask: false,
  maskClose: false,
  escapeClose: false,
  animation: {
    easing(x) {
      return x ** 1.2
    },
    duration: 2000
  }
})

modal.show = true
