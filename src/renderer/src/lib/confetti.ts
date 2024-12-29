import confetti from 'canvas-confetti'

interface ConfettiOptions {
  default: confetti.Options
  ban: confetti.Options
  kick: confetti.Options
}

const ConfettiOptions = {
  default: {
    particleCount: 100,
    angle: -90,
    spread: 100,
    startVelocity: 25,
    decay: 1,
    gravity: 1,
    drift: 0,
    ticks: 200,
    origin: {
      x: 0.5,
      y: -1
    },
    scalar: 2
  }
} as ConfettiOptions

ConfettiOptions.ban = {
  ...ConfettiOptions.default,
  shapes: [confetti.shapeFromText({ text: '🔨', scalar: 2 })]
}
ConfettiOptions.kick = {
  ...ConfettiOptions.default,
  shapes: [confetti.shapeFromText({ text: '🥾', scalar: 2 })]
}

export { ConfettiOptions }
