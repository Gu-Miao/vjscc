let i = 0
const idMap = new Map<number, ReturnType<typeof requestAnimationFrame>>()

/**
 * Create a RAF with dealy frames.
 *
 * @param callback Callback to call after delay frames.
 * @param delay Length of frames before callback executing.
 * @returns Returns index of RAF id in map for cleaning up.
 */
export function rafWithDelay(callback: (...args: any[]) => any, delay = 0) {
  const index = i++

  function execute(left: number) {
    if (left === 0) {
      idMap.delete(index)
      callback()
      return
    }

    const rafId = requestAnimationFrame(() => execute(left - 1))
    idMap.set(index, rafId)
  }

  delay === 0 ? callback() : execute(delay)

  return index
}

/**
 * Clean up RAF.
 *
 * @param index Index of RAF id.
 */
export function cleanRaf(index: number) {
  const rafId = idMap.get(index)
  if (rafId) {
    idMap.delete(index)
    cancelAnimationFrame(rafId)
  }
}
