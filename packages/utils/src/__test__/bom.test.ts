import { isWindow } from '../bom'

test('isWindow()', () => {
  expect(isWindow(document)).toEqual(false)
  expect(isWindow(window.window)).toEqual(true)
  expect(isWindow(document)).toEqual(false)
})
