const React = require('react')
const ReactDOM = require('react-dom')

const {ipcRenderer} = window.require('electron')

const {
  HashRouter: Router,
  Route,
  Link
} = require('react-router-dom')

const Main = require('./Main.jsx')

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="ui grid stackable padded">
          <div className="DragRegion">
            <a
              onClick={this.onMinimizeWindowClick.bind(this)}
              className="MinimizeHandle">
              <i className="fa fa-window-minimize" aria-hidden="true"></i>
            </a>

            <span>hold and drag</span>

            <span className="ResizeHandle">
              resize ↗
            </span>
          </div>
          <Route exact path="/" component={Main}/>
        </div>
      </Router>
    )
  }

  onMinimizeWindowClick(event) {
    event.preventDefault()

    ipcRenderer.send('minimize-window', true)
  }
}

module.exports = App
