const React = require('react')
const ReactDOM = require('react-dom')
const _ = require('lodash')

// https://github.com/electron/electron/issues/7300
const {remote, shell} = window.require('electron')

const musicService = require('../lib/musicService')
const shredometerService = require('../lib/shredometerService')
const store = require('../lib/storeService')
const player = require('../lib/playerService')

const Shredometer = require('./Shredometer.jsx')
const ConfigSettings = require('./ConfigSettings.jsx')
const Player = require('./Player.jsx')

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      playlistUrlInput: '',
      playlistUrlSubmitDisabled: false,
      playButtonDisabled: true,
      stopButtonDisabled: true,
      nextButtonDisabled: true,
      prevButtonDisabled: true,
      randomButtonDisabled: false,
      repeatButtonDisabled: false,
      randomActive: false,
      repeatActive: false,
      isMuted: false,
      maxVolume: 1,
      isPlaying: true,
      shredProgress: 0,
      errorMessage: null,
      isFetchingPlaylist: false
    }

    player.on('EmptyQueue', () => {
      this.setState({
        playButtonDisabled: true,
        stopButtonDisabled: true,
        nextButtonDisabled: true,
        prevButtonDisabled: true,
        randomButtonDisabled: false,
        repeatButtonDisabled: false
      })
    })

    player.on('Enqueue', () => {
      this.setState({playButtonDisabled: false})

      player.hasPrevious()
      .then(hasPrevious => {
        this.setState({
          previousButtonDisabled: !hasPrevious
        })
      })

      player.hasNext()
      .then(hasNext => {
        this.setState({
          nextButtonDisabled: !hasNext
        })
      })
    })

    player.on('Play', () => {
      this.setState({
        playButtonDisabled: true,
        stopButtonDisabled: false
      })
    })

    player.on('Stop', () => {
      this.setState({
        playButtonDisabled: false,
        stopButtonDisabled: true
      })
    })

    player.on('Previous', () => {
      player.hasPrevious()
      .then(hasPrevious => {
        this.setState({
          previousButtonDisabled: !hasPrevious
        })
      })

      player.hasNext()
      .then(hasNext => {
        this.setState({
          nextButtonDisabled: !hasNext
        })
      })
    })

    player.on('Next', () => {
      player.hasPrevious()
      .then(hasPrevious => {
        this.setState({
          previousButtonDisabled: !hasPrevious
        })
      })

      player.hasNext()
      .then(hasNext => {
        this.setState({
          nextButtonDisabled: !hasNext
        })
      })
    })

    shredometerService.setSensitivity(store.get('sensitivity'))
    shredometerService.setStartingAmplitude(store.get('startingVolume'))
    shredometerService.setAmplitudeSensitivity(store.get('volumeSensitivity'))

    shredometerService.on('ShredProgress', _.throttle(shredProgress => {
      this.setState({shredProgress})
    }, 100))

    shredometerService.on('ShredRate', _.throttle(shredRate => {
      player.setPlaybackRate(shredRate)
    }, 100))

    shredometerService.on('AmplitudeRate', _.throttle(volume => {
      player.setVolume(volume)
    }, 100))

    store.on('sensitivity', _.throttle(value => {
      shredometerService.setSensitivity(value)
    }, 100))

    store.on('startingVolume', _.throttle(value => {
      shredometerService.setStartingAmplitude(value)
    }, 100))

    store.on('volumeSensitivity', _.throttle(value => {
      shredometerService.setAmplitudeSensitivity(value)
    }, 100))

    this.handleError = this.handleError.bind(this)
    this.onExternalClick = this.onExternalClick.bind(this)
    this.setPlaylistUrl = this.setPlaylistUrl.bind(this)

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
      nextButtonDisabled,
      previousButtonDisabled,
      randomButtonDisabled,
      repeatButtonDisabled,
      randomActive,
      repeatActive,
      isMuted,
      maxVolume,
      shredProgress,
      errorMessage,
      isFetchingPlaylist
    } = this.state

    return (
      <div className="ui grid stackable padded MainView">
        <div className="ui large header MainTitle">
          Shredbeat
        </div>
        {errorMessage ?
          <div className="ui message error">
            {errorMessage}
          </div>
        : null}
        <div className="PlaylistFormContainer">
          <form
            className="ui form PlaylistForm"
            onSubmit={this.onPlaylistFormSubmit.bind(this)}>
            <div className="PlaylistUrlInputContainer">
              <input
                type="text"
                className="ui input PlaylistUrlInput"
                defaultValue={playlistUrlInput}
                onInput={this.onPlaylistUrlInput.bind(this)}
                placeholder="Playlist URL" />
              <button
                className={`ui button PlaylistUrlSubmit ${isFetchingPlaylist ? 'loading': ''}`}
                type="submit"
                disabled={playlistUrlSubmitDisabled}>
                {isFetchingPlaylist ? <i className="fa fa-circle-o-notch fa-spin"></i> : <span>Set</span>}
              </button>
            </div>
            <div className="PlaylistUrlInputHelp">
              <p>
              <small>Use&nbsp;
                <a
                  onClick={this.onExternalClick}
                  href="https://www.youtube.com/">YouTube</a>,&nbsp;
                <a
                  onClick={this.onExternalClick}
                  href="https://soundcloud.com/">SoundCloud</a>,&nbsp;
                <a
                  onClick={this.onExternalClick}
                  href="http://hypem.com/">Hype Machine</a>,&nbsp;
                <a
                  onClick={this.onExternalClick}
                  href="https://www.mixcloud.com/">Mixcloud</a>,&nbsp;
                or&nbsp;
                <a
                  onClick={this.onExternalClick}
                  href="https://fanburst.com/">Fanburst</a>&nbsp;
                playlist urls</small>
              </p>
            </div>
          </form>
          <div className="PlayerContainer">
            <Player
              playButtonDisabled={playButtonDisabled}
              pauseButtonDisabled={stopButtonDisabled}
              stopButtonDisabled={stopButtonDisabled}
              previousButtonDisabled={previousButtonDisabled}
              nextButtonDisabled={nextButtonDisabled}
              randomButtonDisabled={randomButtonDisabled}
              repeatButtonDisabled={repeatButtonDisabled}
              onPlayClick={this.onPlay.bind(this)}
              onPauseClick={this.onStop.bind(this)}
              onStopClick={this.onStop.bind(this)}
              onPreviousClick={this.onPrev.bind(this)}
              onNextClick={this.onNext.bind(this)}
              onRandomClick={this.onRandom.bind(this)}
              onRepeatClick={this.onRepeat.bind(this)}
              onVolumeClick={this.onVolumeClick.bind(this)}
              onVolumeChange={this.onVolumeChange.bind(this)}
              repeatActive={repeatActive}
              randomActive={randomActive}
            />
          </div>
        </div>

        <Shredometer shredProgress={shredProgress} />

        <div id="bottom">
          <a id="settings"
            onClick={this.onSettingsClick}>
            <i className="fa fa-cog" aria-hidden="true"></i>&nbsp;
            settings
          </a>
          <a id="quit" onClick={this.onQuitClick.bind(this)}>quit</a>
        </div>

        <ConfigSettings />
      </div>
    )
  }

  onExternalClick(event) {
    event.preventDefault()
    shell.openExternal(event.target.href)
  }

  onPlaylistUrlInput(event) {
    const value = event.target.value

    this.setState({
      playlistUrlInput: value
    })
  }

  setPlaylistUrl(url) {
    this.setState({
      errorMessage: null,
      isFetchingPlaylist: true
    })

    player.stop()

    // timeout used because of player stop/play events listener
    setTimeout(() => {
      this.setState({
        //playlistUrlSubmitDisabled: true,
        playButtonDisabled: true,
        stopButtonDisabled: true
      })
    }, 0)

    if (/youtube\.com/gi.test(url)) {
      setTimeout(() => {
        this.setState({
          playlistUrlSubmitDisabled: false,
          playButtonDisabled: false,
          isFetchingPlaylist: false
        })
      }, 1e3)

      return player.setPlaylist(url)
      .catch(this.handleError)
    } else {
      musicService.getPlaylist(url)
      .then(tracks => {
        console.log(tracks)

        this.setState({
          playButtonDisabled: false
        })

        setTimeout(() => {
          this.setState({
            playlistUrlSubmitDisabled: false,
            isFetchingPlaylist: false
          })
        }, 10)

        return player.setPlaylist(tracks)
      })
      .catch(error => {
        setTimeout(() => {
          this.setState({
            isFetchingPlaylist: false
          })
        }, 10)

        this.handleError(error)
      })
    }
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

  onRandom() {
    const enabled = !this.state.randomActive

    player.setRandom(enabled)

    this.setState({
      randomActive: enabled
    })
  }

  onRepeat() {
    const enabled = !this.state.repeatActive

    player.setRepeat(enabled)

    this.setState({
      repeatActive: enabled
    })
  }

  onVolumeChange(volume) {
    player.setMaxVolume(volume)
  }

  onVolumeClick() {
    const enabled = !this.state.isMuted

    player.setMute(enabled)
  }

  onStop() {
    player.pause()

    this.setState({
      stopButtonDisabled: true,
      playButtonDisabled: false
    })
  }

  onPrev() {
    player.previous()
  }

  onNext() {
    player.next()
  }

  onSettingsClick(event) {
    event.preventDefault()

    document.body.scrollTop = window.outerHeight + 200
  }

  onQuitClick(event) {
    event.preventDefault()

    remote.app.quit()
  }

  handleError(error) {
    console.error(error)

    this.setState({
      errorMessage: error
    })
  }
}

module.exports = Main
