/**
 * Check if value is Window.
 *
 * @param value The value to check.
 * @returns Returns true if value is Window, else false.
 */
export function isWindow(value: unknown): value is Window {
  return value === window && value === window.window
}
