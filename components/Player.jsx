const React = require('react')
const ReactDOM = require('react-dom')

const VolumeSlider = require('./VolumeSlider.jsx')

class Player extends React.Component {
  constructor(props) {
    super(props)

    const {
      playButtonDisabled,
      pauseButtonDisabled,
      stopButtonDisabled,
      previousButtonDisabled,
      nextButtonDisabled,
      randomButtonDisabled,
      repeatButtonDisabled,
      randomActive,
      repeatActive
    } = props

    this.state = {
      playButtonDisabled,
      pauseButtonDisabled,
      stopButtonDisabled,
      previousButtonDisabled,
      nextButtonDisabled,
      randomButtonDisabled,
      repeatButtonDisabled,
      randomActive,
      repeatActive
    }

    this.onPlayClick = props.onPlayClick.bind(this)
    this.onPauseClick = props.onPauseClick.bind(this)
    this.onStopClick = props.onStopClick.bind(this)
    this.onPreviousClick = props.onPreviousClick.bind(this)
    this.onNextClick = props.onNextClick.bind(this)
    this.onRandomClick = props.onRandomClick.bind(this)
    this.onRepeatClick = props.onRepeatClick.bind(this)
    this.onVolumeChange = props.onVolumeChange.bind(this)
    this.onVolumeClick = props.onVolumeClick.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const {
      playButtonDisabled,
      pauseButtonDisabled,
      stopButtonDisabled,
      previousButtonDisabled,
      nextButtonDisabled,
      randomButtonDisabled,
      repeatButtonDisabled,
      randomActive,
      repeatActive
    } = nextProps

    this.setState({
      playButtonDisabled,
      pauseButtonDisabled,
      stopButtonDisabled,
      previousButtonDisabled,
      nextButtonDisabled,
      randomButtonDisabled,
      repeatButtonDisabled,
      randomActive,
      repeatActive
    });
  }

  render() {
    const {
      playButtonDisabled,
      pauseButtonDisabled,
      stopButtonDisabled,
      previousButtonDisabled,
      nextButtonDisabled,
      randomButtonDisabled,
      repeatButtonDisabled,
      randomActive,
      repeatActive
    } = this.state

    return (
      <div className="ui grid Player">
        <button
        className="PlayerControlButton PlayerControlPreviousButton"
        onClick={this.onPreviousClick}
        disabled={previousButtonDisabled}>
          <i className="fa fa-step-backward" aria-hidden="true"></i>
        </button>
        <button
        className="PlayerControlButton PlayerControlPlayButton"
        onClick={this.onPlayClick}
        disabled={playButtonDisabled}>
          <i className="fa fa-play-circle-o" aria-hidden="true"></i>
        </button>
        <button
        className="PlayerControlButton PlayerControlPauseButton"
        onClick={this.onPauseClick}
        disabled={pauseButtonDisabled}>
          <i className="fa fa-pause-circle-o" aria-hidden="true"></i>
        </button>
        <button
          className="PlayerControlButton PlayerControlNextButton"
          onClick={this.onNextClick}
          disabled={nextButtonDisabled}>
            <i className="fa fa-step-forward" aria-hidden="true"></i>
        </button>
        <button
          className={`PlayerControlButton PlayerControlRandomButton ${randomActive ? 'active' : ''}`}
          onClick={this.onRandomClick}
          disabled={randomButtonDisabled}>
            <i className="fa fa-random" aria-hidden="true"></i>
        </button>
        <button
          className={`PlayerControlButton PlayerControlRepeatButton ${repeatActive ? 'active' : ''}`}
          onClick={this.onRepeatClick}
          disabled={repeatButtonDisabled}>
            <i className="fa fa-repeat" aria-hidden="true"></i>
        </button>
        <div className="PlayerVolumeContainer">
          <VolumeSlider
            onVolumeChange={this.onVolumeChange}
            onClick={this.onVolumeClick} />
        </div>
      </div>
    )
  }
}

module.exports = Player
