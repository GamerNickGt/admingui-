import confetti from 'canvas-confetti'

const ConfettiOptions = {
  default: {
    particleCount: 100,
    angle: -90,
    spread: 100,
    startVelocity: 25,
    decay: 1,
    gravity: 1,
    drift: 0,
    flat: true,
    ticks: 200,
    origin: {
      x: 0.5,
      y: -1
    },
    scalar: 2
  }
}
ConfettiOptions['ban'] = {
  ...ConfettiOptions.default,
  shapes: [confetti.shapeFromText({ text: '🔨', scalar: 2 })]
}
ConfettiOptions['kick'] = {
  ...ConfettiOptions.default,
  shapes: [confetti.shapeFromText({ text: '🥾', scalar: 2 })]
}

export { ConfettiOptions }
