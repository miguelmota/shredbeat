const React = require('react')
const ReactDOM = require('react-dom')
const Slider = require('react-slider')

const store = require('../lib/storeService')

class ConfigSettings extends React.Component {
  constructor() {
    super()

    this.state = {
      sensitivity: ((store.get('sensitivity') || 0.10)*100)|0
    }
  }

  render() {
    const {sensitivity} = this.state

    return (
      <div className="ui grid ConfigSettings" id="ConfigSettings">
      <form className="ui form">
      <div className="ui field">
      <label>Sensitivity</label>

      <Slider
      className="slider horizontal-slider"
      min={0}
      step={1}
      max={100}
      defaultValue={sensitivity}
      orientation="horizontal"
      onChange={this.onSensitivityChange.bind(this)}
      withBars
      >
      <div className="handle">
      <span>{sensitivity}%</span>
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
}

module.exports = ConfigSettings
