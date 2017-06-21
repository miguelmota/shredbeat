const React = require('react')
const ReactDOM = require('react-dom')
const _ = require('lodash')
const {Player, YoutubePlayer} = require('audio-director')

// https://github.com/electron/electron/issues/7300
const {remote} = window.require('electron')

const Shredometer = require('./Shredometer.jsx')
const ConfigSettings = require('./ConfigSettings.jsx')
const musicService = require('../lib/musicService')
const shredometerService = require('../lib/shredometerService')
const store = require('../lib/storeService')

var PlayerEventTypes = Player.EventTypes
var playerA = new Player()
var playerB = new YoutubePlayer()

var player = playerB

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      playlistUrlInput: '',
      playlistUrlSubmitDisabled: false,
      playButtonDisabled: true,
      stopButtonDisabled: true,
      isPlaying: true,
      shredProgress: 0
    }

    playerA.on(PlayerEventTypes.ENQUEUE, () => {
      this.setState({playButtonDisabled: false})
    })
    playerB.on(PlayerEventTypes.ENQUEUE, () => {
      this.setState({playButtonDisabled: false})
    })

    playerA.on(PlayerEventTypes.PLAY, () => {
      this.setState({
        playButtonDisabled: true,
        stopButtonDisabled: false
      })
    })

    playerB.on(PlayerEventTypes.PLAY, () => {
      this.setState({
        playButtonDisabled: true,
        stopButtonDisabled: false
      })
    })

    playerA.on(PlayerEventTypes.STOP, () => {
      this.setState({
        playButtonDisabled: false,
        stopButtonDisabled: true
      })
    })

    playerB.on(PlayerEventTypes.STOP, () => {
      this.setState({
        playButtonDisabled: false,
        stopButtonDisabled: true
      })
    })

    shredometerService.on('ShredProgress', _.throttle(shredProgress => {
      this.setState({shredProgress})
    }, 100))

    shredometerService.on('ShredRate', shredRate => {
      if (playerA.isReady) {
        playerA.setPlaybackRate(shredRate)
      }

      if (playerB.isReady) {
        playerB.setPlaybackRate(shredRate)
      }
    })

    shredometerService.on('AmplitudeRate', volume => {
      if (playerA.isReady) {
        playerA.setVolume(volume)
      }

      if (playerB.isReady) {
        playerB.setVolume(volume)
      }
    })

    store.on('sensitivity', (value) => {
      shredometerService.setSensitivity(value)
    })

    this.setPlaylistUrl.bind(this)

    const playlistUrl = store.get('playlistUrl')

    if (playlistUrl) {
      this.state.playlistUrlInput = playlistUrl;
      this.setPlaylistUrl(playlistUrl)
    }
  }

  render() {
    const {
      playlistUrlInput,
      playlistUrlSubmitDisabled,
      playButtonDisabled,
      stopButtonDisabled,
      shredProgress,
    } = this.state

    return (
      <div className="ui grid stackable padded MainView">
        <div className="ui large header MainTitle">
          Shredbeat
        </div>
        <form
          className="ui form PlaylistForm"
          onSubmit={this.onPlaylistFormSubmit.bind(this)}>
          <div>
            <input
              type="text"
              className="ui input PlaylistUrlInput"
              defaultValue={playlistUrlInput}
              onInput={this.onPlaylistUrlInput.bind(this)}
              placeholder="Playlist URL" />
            <div className="PlaylistUrlInputHelp">
              <p>
              <small>Use <a href="https://www.youtube.com/" target="_blank">YouTube</a>, <a href="https://soundcloud.com/" target="_blank">SoundCloud</a>, <a href="http://hypem.com/" target="_blank">Hype Machine</a>, <a href="https://www.mixcloud.com/" target="_blank">Mixcloud</a>, or <a href="https://fanburst.com/" target="_blank">Fanburst</a> playlist urls</small>
              </p>
            </div>
          </div>
          <button
            className="ui button PlaylistUrlSubmit"
            type="submit"
            disabled={playlistUrlSubmitDisabled}>
            Set
          </button>
          <div className="actions">
            <button
            className="ui button PlayButton"
            onClick={this.onPlay.bind(this)}
            disabled={playButtonDisabled}>
            play
            </button>

            <button
              className="ui button StopButton"
              onClick={this.onStop.bind(this)}
              disabled={stopButtonDisabled}>
              stop
              </button>
          </div>
        </form>

        <Shredometer shredProgress={shredProgress} />

        <div id="bottom">
          <a id="settings" onClick={this.onSettingsClick}>settings</a>
          <a id="quit" onClick={this.onQuitClick.bind(this)}>quit</a>
        </div>

        <ConfigSettings />
      </div>
    )
  }

  onPlaylistUrlInput(event) {
    const value = event.target.value

    this.setState({
      playlistUrlInput: value
    })
  }

  setPlaylistUrl(url) {
    player.stop()

    // timeout used because of player stop/play events listener
    setTimeout(() => {
      this.setState({
        playlistUrlSubmitDisabled: true,
        playButtonDisabled: true,
        stopButtonDisabled: true
      })
    }, 0)

    if (/youtube\.com/gi.test(url)) {
      player = playerB
      player.emptyQueue()
      setTimeout(() => {
        this.setState({
          playlistUrlSubmitDisabled: false,
          playButtonDisabled: false
        })
      }, 1e3)
      return player.enqueue(url)
    } else {
      player = playerA
    }

    musicService.getPlaylist(url)
    .then(tracks => {
      console.log(tracks)
      player.emptyQueue()

      this.setState({
        playlistUrlSubmitDisabled: false,
        playButtonDisabled: false
      })

      return player.enqueue(tracks)
    })
    .catch(error => {
      console.error(error)
    });
  }

  onPlaylistFormSubmit(event) {
    event.preventDefault();

    const url = this.state.playlistUrlInput

    store.set('playlistUrl', url)
    this.setPlaylistUrl(url);
  }

  onPlay() {
    player.play();

    this.setState({
      isPlaying: true,
      stopButtonDisabled: false,
      playButtonDisabled: true
    })
  }

  onStop() {
    player.pause()

    this.setState({
      stopButtonDisabled: true,
      playButtonDisabled: false
    })
  }

  onSettingsClick(event) {
    event.preventDefault()

    document.body.scrollTop = window.outerHeight + 200
  }

  onQuitClick(event) {
    event.preventDefault()

    remote.app.quit()
  }
}

module.exports = Main
