const EventEmitter2 = require('eventemitter2').EventEmitter2
const {Player, YoutubePlayer} = require('audio-director')

const PlayerEventTypes = Player.EventTypes

const ee = new EventEmitter2({
  wildcard: true
})

// Facade
class PlayerService {
  constructor () {
    this.emit = ee.emit.bind(ee)
    this.on = ee.on.bind(ee)

    this.playerST = new Player()
    this.playerYT = new YoutubePlayer()
    this.player = this.playerYT

    for (let type in PlayerEventTypes) {
      this.playerST.on(PlayerEventTypes[type], () => {
        this.emit(type)
      })

      this.playerYT.on(PlayerEventTypes[type], () => {
        this.emit(type)
      })
    }

    this.EventTypes = PlayerEventTypes
  }

  isReady () {
    return this.player.isReady()
  }

  play () {
    return this.player.play()
  }

  pause () {
    return this.player.pause()
  }

  stop () {
    return this.player.stop()
  }

  next () {
    return this.player.next()
  }

  previous () {
    return this.player.previous()
  }

  setRandom (enabled) {
    return this.player.setRandom(enabled)
  }

  setRepeat (enabled) {
    return this.player.setRepeat(enabled)
  }

  hasPrevious () {
    return this.player.hasPrevious()
  }

  hasNext () {
    return this.player.hasNext()
  }

  setPlaybackRate (rate) {
    if (this.playerST.isReady()) {
      this.playerST.setPlaybackRate(rate)
    }

    if (this.playerYT.isReady) {
      this.playerYT.setPlaybackRate(rate)
    }

    return Promise.resolve()
  }

  setVolume (volume) {
    if (this.playerST.isReady()) {
      this.playerST.setVolume(volume)
    }

    if (this.playerYT.isReady) {
      this.playerYT.setVolume(volume)
    }

    return Promise.resolve()
  }

  setMaxVolume (maxVolume) {
    if (this.playerST.isReady()) {
      this.playerST.setMaxVolume(maxVolume)
    }

    if (this.playerYT.isReady) {
      this.playerYT.setMaxVolume(maxVolume)
    }

    return Promise.resolve()
  }

  setMuted (enabled) {
    if (this.playerST.isReady()) {
      this.playerST.setMuted(enabled)
    }

    if (this.playerYT.isReady) {
      this.playerYT.setMuted(enabled)
    }

    return Promise.resolve()
  }

  enqueue (data) {
    return this.player.enqueue(data)
  }

  emptyQueue () {
    return this.player.emptyQueue()
  }

  setPlaylist (url) {
    if (/youtube\.com/gi.test(url)) {
      this.player = this.playerYT
    } else {
      this.player = this.playerST
    }

    this.player.emptyQueue()
    return this.player.enqueue(url)
  }

  getCurrentAudioBuffer () {
    return this.player.getCurrentAudioBuffer()
  }

  getCurrentTime () {
    return this.player.getCurrentTime()
  }

  seekTo (seconds) {
    return this.player.seekTo(seconds)
  }

  getDuration () {
    return this.player.getDuration()
  }

  getCurrentState () {
    return this.player.getCurrentState()
  }

  toJSON () {
    return {
      volume: this.player.getVolume(),
      maxVolume: this.player.getMaxVolume(),
      playbackRate: this.player.getPlaybackRate(),
      currentTime: this.player.getCurrentTime(),
      url: this.player.getCurrentUrl(),
      currentState: this.player.getCurrentState()
    }
  }
}

module.exports = PlayerService
