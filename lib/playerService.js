const EventEmitter = require('events')
const {Player, YoutubePlayer} = require('audio-director')

const PlayerEventTypes = Player.EventTypes
const playerST = new Player()
const playerYT = new YoutubePlayer()
let player = playerYT

// Facade
class PlayerService extends EventEmitter {
  constructor() {
    super()

    playerST.on(PlayerEventTypes.ENQUEUE, () => {
      this.emit('Enqueue')
    })

    playerYT.on(PlayerEventTypes.ENQUEUE, () => {
      this.emit('Enqueue')
    })

    playerST.on(PlayerEventTypes.EMPTY_QUEUE, () => {
      this.emit('EmptyQueue')
    })

    playerYT.on(PlayerEventTypes.EMPTY_QUEUE, () => {
      this.emit('EmptyQueue')
    })

    playerST.on(PlayerEventTypes.PLAY, () => {
      this.emit('Play')
    })

    playerYT.on(PlayerEventTypes.PLAY, () => {
      this.emit('Play')
    })

    playerST.on(PlayerEventTypes.STOP, () => {
      this.emit('Stop')
    })

    playerYT.on(PlayerEventTypes.STOP, () => {
      this.emit('Stop')
    })

    playerST.on(PlayerEventTypes.PREVIOUS, () => {
      this.emit('Next')
    })

    playerYT.on(PlayerEventTypes.PREVIOUS, () => {
      this.emit('Previous')
    })

    playerST.on(PlayerEventTypes.NEXT, () => {
      this.emit('Next')
    })

    playerYT.on(PlayerEventTypes.NEXT, () => {
      this.emit('Next')
    })
  }

  play() {
    return player.play()
  }

  pause() {
    return player.pause()
  }

  stop() {
    return player.stop()
  }

  next() {
    return player.next()
  }

  previous() {
    return player.previous()
  }

  setRandom(enabled) {
    return player.setRandom(enabled)
  }

  setRepeat(enabled) {
    return player.setRepeat(enabled)
  }

  hasPrevious() {
    return player.hasPrevious()
  }

  hasNext() {
    return player.hasNext()
  }

  setPlaybackRate(rate) {
    if (playerST.isReady) {
      playerST.setPlaybackRate(rate)
    }

    if (playerYT.isReady) {
      playerYT.setPlaybackRate(rate)
    }

    return Promise.resolve()
  }

  setVolume(volume) {
    if (playerST.isReady) {
      playerST.setVolume(volume)
    }

    if (playerYT.isReady) {
      playerYT.setVolume(volume)
    }

    return Promise.resolve()
  }

  setMaxVolume(maxVolume) {
    if (playerST.isReady) {
      playerST.setMaxVolume(maxVolume)
    }

    if (playerYT.isReady) {
      playerYT.setMaxVolume(maxVolume)
    }

    return Promise.resolve()
  }

  setMuted(enabled) {
    if (playerST.isReady) {
      playerST.setMuted(enabled)
    }

    if (playerYT.isReady) {
      playerYT.setMuted(enabled)
    }

    return Promise.resolve()
  }

  enqueue(data) {
    return player.enqueue(data)
  }

  emptyQueue() {
    return player.emptyQueue()
  }

  setPlaylist(url) {
    if (/youtube\.com/gi.test(url)) {
      player = playerYT
    } else {
      player = playerST
    }

    player.emptyQueue()
    return player.enqueue(url)
  }
}

module.exports = new PlayerService()
