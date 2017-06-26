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

    this.state = {
      volume,
      showSlider: false
    }

    this.onVolumeChange = props.onVolumeChange.bind(this)
  }

  render() {
    const volume = 1 - this.state.volume
    const showSlider = this.state.showSlider

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
            defaultValue={volume}
            orientation="vertical"
            onChange={this.onSliderChange.bind(this)}
            withBars
          >
          </Slider>
          <button
            className="PlayerControlButton PlayerControlVolumeButton"
            onClick={this.onVolumeClick}>
              <i className="fa fa-volume-up" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    )
  }

  onSliderChange(value) {
    const volume = 1 - value

    this.onVolumeChange(volume)
  }

  onVolumeMouseOver(event) {
    this.setState({showSlider: true})
  }

  onVolumeMouseOut(event) {
    this.setState({showSlider: false})
  }
}

/*
    <i className="fa fa-volume-up" aria-hidden="true"></i>
    <i className="fa fa-volume-down" aria-hidden="true"></i>
    <i className="fa fa-volume-off" aria-hidden="true"></i>
*/

module.exports = VolumeSlider
