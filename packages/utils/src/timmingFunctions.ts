export type TimingFunction = (x: number) => number

const { pow, sqrt, sin, cos, PI } = Math
const c1 = 1.70158
const c2 = c1 * 1.525
const c3 = c1 + 1
const c4 = (2 * PI) / 3
const c5 = (2 * PI) / 4.5

function bounceOut(x: number) {
  const n1 = 7.5625,
    d1 = 2.75
  if (x < 1 / d1) {
    return n1 * pow(x, 2)
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375
  }
}

export function linear(x: number) {
  return x
}
export function swing(x: number) {
  return 0.5 - cos(x * Math.PI) / 2
}
export function easeInQuad(x: number) {
  return pow(x, 2)
}
export function easeOutQuad(x: number) {
  return 1 - (1 - x) * (1 - x)
}
export function easeInOutQuad(x: number) {
  return x < 0.5 ? 2 * pow(x, 2) : 1 - pow(-2 * x + 2, 2) / 2
}
export function easeInCubic(x: number) {
  return pow(x, 3)
}
export function easeOutCubic(x: number) {
  return 1 - pow(1 - x, 3)
}
export function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * pow(x, 3) : 1 - pow(-2 * x + 2, 3) / 2
}
export function easeInQuart(x: number) {
  return pow(x, 4)
}
export function easeOutQuart(x: number) {
  return 1 - pow(1 - x, 4)
}
export function easeInOutQuart(x: number) {
  return x < 0.5 ? 8 * pow(x, 4) : 1 - pow(-2 * x + 2, 4) / 2
}
export function easeInQuint(x: number) {
  return pow(x, 5)
}
export function easeOutQuint(x: number) {
  return 1 - pow(1 - x, 5)
}
export function easeInOutQuint(x: number) {
  return x < 0.5 ? 16 * pow(x, 5) : 1 - pow(-2 * x + 2, 5) / 2
}
export function easeInSine(x: number) {
  return 1 - cos((x * PI) / 2)
}
export function easeOutSine(x: number) {
  return sin((x * PI) / 2)
}
export function easeInOutSine(x: number) {
  return -(cos(PI * x) - 1) / 2
}
export function easeInExpo(x: number) {
  return x === 0 ? 0 : pow(2, 10 * x - 10)
}
export function easeOutExpo(x: number) {
  return x === 1 ? 1 : 1 - pow(2, -10 * x)
}
export function easeInOutExpo(x: number) {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? pow(2, 20 * x - 10) / 2
    : (2 - pow(2, -20 * x + 10)) / 2
}
export function easeInCirc(x: number) {
  return 1 - sqrt(1 - pow(x, 2))
}
export function easeOutCirc(x: number) {
  return sqrt(1 - pow(x - 1, 2))
}
export function easeInOutCirc(x: number) {
  return x < 0.5 ? (1 - sqrt(1 - pow(2 * x, 2))) / 2 : (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2
}
export function easeInElastic(x: number) {
  return x === 0 ? 0 : x === 1 ? 1 : -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4)
}
export function easeOutElastic(x: number) {
  return x === 0 ? 0 : x === 1 ? 1 : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1
}
export function easeInOutElastic(x: number) {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2
    : (pow(2, -20 * x + 10) * sin((20 * x - 11.125) * c5)) / 2 + 1
}
export function easeInBack(x: number) {
  return c3 * pow(x, 3) - c1 * pow(x, 2)
}
export function easeOutBack(x: number) {
  return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2)
}
export function easeInOutBack(x: number) {
  return x < 0.5
    ? (pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
    : (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2
}
export function easeInBounce(x: number) {
  return 1 - bounceOut(1 - x)
}
export const easeOutBounce = bounceOut
export function easeInOutBounce(x: number) {
  return x < 0.5 ? (1 - bounceOut(1 - 2 * x)) / 2 : (1 + bounceOut(2 * x - 1)) / 2
}

/**
 * Use timing function to calculate current value in progress.
 *
 * @param currentTime Current time.
 * @param duration Duration.
 * @param startValue Start value.
 * @param targetValue Target value.
 * @param fn Timing function.
 * @returns Current value.
 */
export function useTimingFunction(
  currentTime: number,
  duration: number,
  startValue: number,
  targetValue: number,
  fn: TimingFunction = linear
): number {
  const progress = currentTime / duration
  const diff = targetValue - startValue
  return fn(progress) * diff + startValue
}
