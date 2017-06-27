const React = require('react')
const ReactDOM = require('react-dom')
const Slider = require('react-slider')

const store = require('../lib/storeService')

class VolumeSlider extends React.Component {
  constructor(props) {
    super(props)

    let volume = 1

    if (typeof props.volume === 'number') {
      volume = props.volume
    }

    let muted = false

    if (typeof props.muted === 'boolean') {
      muted = props.muted
    }

    this.state = {
      volume,
      showSlider: false,
      muted
    }

    this.onVolumeChange = (props.onVolumeChange || (()=>{})).bind(this)
    this.onMuteToggle = (props.onMutetoggle || (()=>{})).bind(this)
  }

  render() {
    const {showSlider, muted, volume} = this.state
    let volumeValue = 1 - volume
    const volumeLow = volume <= 0.5

    let volumeIcon = 'fa-volume-up'

    if (muted) {
      volumeValue = 1
    }

    if (muted || volume <= 0) {
      volumeIcon = 'fa-volume-off'
    } else if (volumeLow) {
      volumeIcon = 'fa-volume-down'
    }

    return (
      <div
        onMouseOver={this.onVolumeMouseOver.bind(this)}
        onMouseOut={this.onVolumeMouseOut.bind(this)}
        className="VolumeSliderContainer">
        <div
          className="VolumeSliderWrapper">
          <Slider
            className={`VolumeSlider ${showSlider ? 'visible' : 'hidden'}`}
            min={0}
            step={.1}
            max={1}
            defaultValue={volumeValue}
            value={volumeValue}
            orientation="vertical"
            onChange={this.onSliderChange.bind(this)}
            withBars
          >
          </Slider>
          <button
            className="PlayerControlButton PlayerControlVolumeButton"
            onClick={this.onVolumeClick.bind(this)}>
              <i className={`fa ${volumeIcon}`} aria-hidden="true"></i>
          </button>
        </div>
      </div>
    )
  }

  onSliderChange(value) {
    const volume = 1 - value
    let muted = this.state.muted

    if (volume > 0 && muted) {
      muted = false
    }

    this.setState({
      volume,
      muted
    })

    this.onVolumeChange(volume)
  }

  onVolumeMouseOver(event) {
    this.setState({showSlider: true})
  }

  onVolumeMouseOut(event) {
    this.setState({showSlider: false})
  }

  onVolumeClick(event) {
    event.preventDefault()

    const muted = !this.state.muted
    const volume = this.state.volume

    this.setState({muted})
    this.onMuteToggle(muted)
    this.onVolumeChange(muted ? 0 : volume)
  }
}

module.exports = VolumeSlider
