import { getElement, isHTMLElement, isHTMLElementOrDocument, isStringOrHTMLElement } from '../dom'

test('isHTMLElement()', () => {
  expect(isHTMLElement(document.documentElement)).toEqual(true)
  expect(isHTMLElement(document.body)).toEqual(true)
  expect(isHTMLElement(document.createElement('div'))).toEqual(true)

  expect(isHTMLElement(1)).toEqual(false)
  expect(isHTMLElement({})).toEqual(false)
  expect(isHTMLElement({ nodeType: 1 })).toEqual(false)
  expect(isHTMLElement(document)).toEqual(false)
})

test('isHTMLElementOrDocument()', () => {
  expect(isHTMLElementOrDocument(document)).toEqual(true)
  expect(isHTMLElementOrDocument(document.documentElement)).toEqual(true)
})

test('isStringOrHTMLElement()', () => {
  expect(isStringOrHTMLElement(document.documentElement)).toEqual(true)
  expect(isStringOrHTMLElement(document.body)).toEqual(true)
  expect(isStringOrHTMLElement(document.createElement('div'))).toEqual(true)

  expect(isStringOrHTMLElement(1)).toEqual(false)
  expect(isStringOrHTMLElement('#app')).toEqual(true)
  expect(isStringOrHTMLElement({ nodeType: 1 })).toEqual(false)
  expect(isStringOrHTMLElement(document)).toEqual(false)
})

test('getElement()', () => {
  const app = document.createElement('div')
  app.id = 'app'
  document.body.append(app)

  expect(getElement('#app') === app).toEqual(true)
  expect(getElement('#app') instanceof HTMLElement).toBe(true)
  expect(getElement(app) === app).toEqual(true)
  expect(getElement('#app1')).toBeNull()
})
