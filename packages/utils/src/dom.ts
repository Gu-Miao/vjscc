import isElement from 'lodash-es/isElement'
import { isString } from './isPrimitive'

/**
 * Check if value is a HTMLElement.
 *
 * @param value The value to check.
 * @returns Returns true if value is a HTMLElement, else false.
 */
export function isHTMLElement(value: unknown): value is HTMLElement {
  return isElement(value) && value instanceof HTMLElement
}

/**
 * Check if value is a HTMLElement or document.
 *
 * @param value The value to check.
 * @returns Returns true if value is a HTMLElement or document, else false.
 */
export function isHTMLElementOrDocument(value: unknown): value is HTMLElement | Document {
  return value === document || isHTMLElement(value)
}

/**
 * Check if value is a string or a HTMLELement.
 *
 * @param value The value to check.
 * @returns Returns true if value is a string or a HTMLELement, else false.
 */
export function isStringOrHTMLElement(value: unknown): value is string | HTMLElement {
  return isString(value) || isHTMLElement(value)
}

/**
 * Get DOM element.
 *
 * @param selector A CSS selector or element itself.
 * @param container A element contains target element.
 * @returns Returns target element or null if not found.
 */
export function getElement(
  selector: string | HTMLElement,
  container: HTMLElement | Document = document
) {
  if (isHTMLElement(selector)) {
    return selector as HTMLElement
  }
  return container.querySelector(selector)
}
