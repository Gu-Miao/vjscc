import { fadeIn, fadeOut, getCurrentProgress } from '../animation'
import { easeOutCubic } from '../easings'

test('getCurrentProgress()', () => {
  expect(getCurrentProgress(5, 10, 0, 10)).toBeCloseTo(5)
  expect(getCurrentProgress(5, 10, 0, 10, easeOutCubic)).toBeCloseTo(8.75)
})

jest.useFakeTimers()

test('fadeOut()', () => {
  const node = document.createElement('div')
  document.body.append(node)

  Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({ opacity: '1' }),
  })

  fadeOut(node, {
    duration: 2000,
    startDisplay: 'flex',
  })

  expect(node.style.opacity).toEqual('1')
  expect(node.style.display).toEqual('flex')

  jest.advanceTimersByTime(500)
  expect(Number(node.style.opacity)).toBeCloseTo(0.75, 2)

  jest.advanceTimersByTime(500)
  expect(Number(node.style.opacity)).toBeCloseTo(0.5, 2)

  jest.advanceTimersByTime(1000)
  expect(node.style.opacity).toEqual('0')
  expect(node.style.display).toEqual('none')

  node.style.opacity = ''
  node.style.display = ''

  const fn = jest.fn(() => void 0)

  fadeOut(node, {
    duration: 2000,
    callback: fn,
  })

  expect(node.style.display).toEqual('')

  jest.advanceTimersByTime(2000)
  expect(fn).toBeCalledTimes(1)
})

test('fadeIn()', () => {
  const node = document.createElement('div')
  document.body.append(node)

  fadeIn(node, {
    duration: 2000,
  })

  expect(node.style.opacity).toEqual('0')
  expect(node.style.display).toEqual('')

  jest.advanceTimersByTime(500)
  expect(Number(node.style.opacity)).toBeCloseTo(0.25, 2)

  jest.advanceTimersByTime(500)
  expect(Number(node.style.opacity)).toBeCloseTo(0.5, 2)

  jest.advanceTimersByTime(1000)
  expect(node.style.opacity).toEqual('1')
  expect(node.style.display).toEqual('')

  node.style.opacity = '0'
  node.style.display = 'none'

  const fn = jest.fn(() => void 0)

  fadeIn(node, {
    duration: 2000,
    callback: fn,
  })

  expect(node.style.display).toEqual('')

  jest.advanceTimersByTime(2000)
  expect(fn).toBeCalledTimes(1)
})
