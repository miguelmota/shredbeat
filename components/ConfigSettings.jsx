const React = require('react')
const ReactDOM = require('react-dom')
const Slider = require('react-slider')

const store = require('../lib/storeService')

class ConfigSettings extends React.Component {
  constructor() {
    super()

    this.state = {
      sensitivity: ((store.get('sensitivity') || 0.10)*100)|0,
      startingVolume: store.get('startingVolume') || -50
    }
  }

  render() {
    const {sensitivity, startingVolume} = this.state

    return (
      <div className="ui grid ConfigSettings" id="ConfigSettings">
      <form className="ui form">
        <div className="ui field">
          <label>Sensitivity</label>

          <Slider
          className="SettingRangeSlider"
          min={0}
          step={1}
          max={100}
          defaultValue={sensitivity}
          orientation="horizontal"
          onChange={this.onSensitivityChange.bind(this)}
          withBars
          >
            <div className="handle-label">
              {sensitivity}%
            </div>
          </Slider>
        </div>
        <div className="ui field">
          <label>Starting volume</label>

          <Slider
          className="SettingRangeSlider"
          min={-100}
          step={1}
          max={0}
          defaultValue={startingVolume}
          orientation="horizontal"
          onChange={this.onStartingVolumeChange.bind(this)}
          withBars
          >
            <div className="handle-label">
              {startingVolume}%
            </div>
          </Slider>
        </div>
      </form>
      </div>
    )
  }

  onSensitivityChange(value) {
    const sensitivity = (value / 100)

    store.set('sensitivity', sensitivity)
    this.setState({sensitivity: value})
  }

  onStartingVolumeChange(startingVolume) {
    store.set('startingVolume', startingVolume)
    this.setState({startingVolume})
  }
}

module.exports = ConfigSettings
