import { linear } from './easings'

/**
 * Use timing function to calculate current value in progress.
 *
 * @param currentTime Current time.
 * @param duration Duration.
 * @param startValue Start value.
 * @param targetValue Target value.
 * @param fn Timing function.
 * @returns Current progress.
 */
export function getCurrentProgress(
  currentTime: number,
  duration: number,
  startValue: number,
  targetValue: number,
  fn: (x: number) => number = linear
): number {
  const progress = currentTime / duration
  const diff = targetValue - startValue
  return fn(progress) * diff + startValue
}

// Basic animation functions options.
export type AnimationFnOptions = {
  duration: number
  easing?: (x: number) => number
  callback?: (...args: any[]) => any
}

export type FadeFnOptions = AnimationFnOptions & {
  startOpacity?: number
  startDisplay?: string
  endOpacity?: number
  endDisplay?: string
}

/**
 * Let dom element fade out.
 *
 * @param el Dom element.
 * @param options Options.
 */
export function fadeOut(el: HTMLElement, options: FadeFnOptions): void {
  let {
    duration,
    easing,
    callback,
    startOpacity = parseFloat(getComputedStyle(el).opacity),
    startDisplay,
    endOpacity = 0,
    endDisplay = 'none'
  } = options

  el.style.opacity = startOpacity.toString()
  if (startDisplay !== undefined) el.style.display = startDisplay

  const startTime = Date.now()

  function fade() {
    const now = Date.now()
    const time = now - startTime
    const nextOpacity = getCurrentProgress(
      Math.min(time, duration),
      duration,
      startOpacity,
      endOpacity,
      easing
    )

    el.style.opacity = nextOpacity.toString()

    if (time < duration) {
      requestAnimationFrame(fade)
    } else {
      el.style.opacity = endOpacity.toString()
      el.style.display = endDisplay

      if (callback) callback()
    }
  }
  requestAnimationFrame(fade)
}

/**
 * Let element fade in.
 *
 * @param el DOM element.
 * @param options Options.
 */
export function fadeIn(el: HTMLElement, options: FadeFnOptions): void {
  let {
    duration,
    easing,
    callback,
    startOpacity = 0,
    startDisplay = '',
    endOpacity = 1,
    endDisplay = ''
  } = options

  el.style.opacity = startOpacity.toString()
  el.style.display = startDisplay

  const startTime = Date.now()

  function fade() {
    const now = Date.now()
    const time = now - startTime
    const nextOpacity = getCurrentProgress(
      Math.min(time, duration),
      duration,
      startOpacity,
      endOpacity,
      easing
    )

    el.style.opacity = nextOpacity.toString()
    if (time < duration) {
      requestAnimationFrame(fade)
    } else {
      el.style.opacity = endOpacity.toString()
      el.style.display = endDisplay

      if (callback) callback()
    }
  }
  requestAnimationFrame(fade)
}
