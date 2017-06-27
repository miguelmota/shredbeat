const EventEmitter = require('events')
const Rx = require('rxjs')
const _ = require('lodash')
const d3 = require('d3')

const keyup$ = new Rx.Subject()

// from index.html
const shredbeat = window.shredbeat || {}
if (typeof shredbeat.osGlobalKeyPress === 'function') {
  shredbeat.osGlobalKeyPress((event) => {
    keyup$.next(event)
  })
}

class ShredometerService extends EventEmitter {
  constructor() {
    super()

    this.sensitivity = 0.001
    this.sensitivityScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0.0001, 0.003])
        .clamp(true)

    this.playbackRange = [1, 3]

    this.startingAmplitude = 0.5
    this.amplitudeRange = [this.startingAmplitude, 1]
    this.amplitudeScale = d3.scaleLinear()
        .domain([-100, 0])
        .range([0, 1])
        .clamp(true)
    this.amplitude = this.amplitudeRange[0]
    this.amplitudeSensitivity = 0.005
    this.amplitudeSensitivityScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0.0001, 0.01])
        .clamp(true)

    this.deltaScale = d3.scaleLinear()
        .domain([0, 1000]) // milliseconds
        .range([3, 1])
        .clamp(true)

    this.progressScale = d3.scaleLinear()
        .domain([1, 2.5])
        .range([0, 100])
        .clamp(true)

    this.currentRate = this.playbackRange[0]
    this.direction = -1

    this.directionTimeout = null
    this.rate = 1

    keyup$
    .timestamp()
    .map(obj => obj.timestamp)
    .pairwise()
    .map(([a, b]) => b - a)
    .subscribe(delta => {
      this.rate = this.deltaScale(delta)
      this.direction = 1

      // reverse direction after a second of no activity
      clearTimeout(this.directionTimeout)
      this.directionTimeout = setTimeout(() => {
        this.direction = -1
      }, 1e3)
    })

    setInterval(() => {
      this.currentRate += (this.rate *  this.sensitivity * this.direction)
      const shredProgress = this.progressScale(this.currentRate)

      // clamping
      if (this.currentRate >= this.playbackRange[1]) {
        this.currentRate = this.playbackRange[1]
      } else if (this.currentRate <= this.playbackRange[0]) {
        this.currentRate = this.playbackRange[0]
      }

      this.amplitude += (this.amplitudeSensitivity * this.direction)

      // clamping
      if (this.amplitude >= this.amplitudeRange[1]) {
        this.amplitude = this.amplitudeRange[1]
      } else if (this.amplitude <= this.amplitudeRange[0]) {
        this.amplitude = this.amplitudeRange[0]
      }

      this.emit('ShredProgress', shredProgress)
      this.emit('ShredRate', this.currentRate)
      this.emit('AmplitudeRate', this.amplitude)
    }, 50)
  }

  setSensitivity(value) {
    if (typeof value === 'number') {
      this.sensitivity = this.sensitivityScale(value)
    }
  }

  setAmplitudeSensitivity(value) {
    if (typeof value === 'number') {
      this.amplitudeSensitivity = this.amplitudeSensitivityScale(value)
    }
  }

  setStartingAmplitude(value) {
    if (typeof value === 'number') {
      this.startingAmplitude = this.amplitudeScale(value)
      this.amplitudeRange = [this.startingAmplitude, 1]
      this.amplitude = this.amplitudeRange[0]
    }
  }
}

module.exports = new ShredometerService()
