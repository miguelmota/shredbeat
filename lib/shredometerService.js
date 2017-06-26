const EventEmitter = require('events')
const Rx = require('rxjs')
const _ = require('lodash')
const d3 = require('d3')

var isPlaying = true

class ShredometerService extends EventEmitter {
  constructor() {
    super()

    this.sensitivity = 0.001
    this.sensitivityScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0.0001, 0.003])
        .clamp(true)

    var playbackRange = [1, 3];

    var keyup$ = Rx.Observable.fromEvent(document, 'keyup');

    var shredbeat = window.shredbeat || {};

    if (typeof shredbeat.osGlobalKeyPress === 'function') {
      keyup$ = new Rx.Subject();
      shredbeat.osGlobalKeyPress((event) => {
        keyup$.next(event);
      });
    }

    //var volumeRange = [0.1, 1];
    var volumeRange = [1, 1];
    var scale = d3.scaleLinear()
        .domain([0, 1000])
        .range([3, 1])
        .clamp(true)

    var progressScale = d3.scaleLinear()
        .domain([1, 2.5])
        .range([0, 100])
        .clamp(true)

    var volumeScale = d3.scaleLinear()
      .domain([500, 1000])
      .range(volumeRange);

    volumeScale.clamp(true);

    var expScale = d3.scaleLinear()
      .domain([0.75, 3])
      .range([1, 10]);

    expScale.clamp(true);

    var rate = playbackRange[0];
    var volume = volumeRange[0];

    var lastRate = rate;
    var currentRate = rate;
    var i = -1;

    var t = null;

    var x = 1;

    keyup$
    .timestamp()
    .map(obj => obj.timestamp)
    .pairwise()
    .map(([a, b]) => b - a)
    .subscribe(delta => {
      if (!isPlaying) return false;

      x = scale(delta);

        i = 1;
      //rate = x

    /*
      if (rate - lastRate >= 0) {
        i = 1;
      } else {
        i = -1;
      }
      */

      lastRate = rate;

      clearTimeout(t);
      t = setTimeout(() => {
        i = -1;
      }, 1000);

    });

    setInterval(() => {
      if (!isPlaying) return false;

      currentRate += (x *  this.sensitivity * i);

      var shredProgress = progressScale(currentRate)
      this.emit('ShredProgress', shredProgress)

      if (currentRate >= playbackRange[1]) {
        currentRate = playbackRange[1];
      } else if (currentRate <= playbackRange[0]) {
        currentRate = playbackRange[0];
      }


      volume += (0.005 * i);

      if (volume >= volumeRange[1]) {
        volume = volumeRange[1];
      } else if (volume <= volumeRange[0]) {
        volume = volumeRange[0];
      }

      this.emit('ShredRate', currentRate)
      this.emit('AmplitudeRate', volume)
    }, 50);
  }

  setSensitivity(value) {
    this.sensitivity = this.sensitivityScale(value);
  }
}

module.exports = new ShredometerService()
