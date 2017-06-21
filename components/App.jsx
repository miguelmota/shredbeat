const React = require('react')
const ReactDOM = require('react-dom')

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
        <div>
        <div className="ui grid stackable padded">
          <div className="DragRegion">drag me</div>
          <Route exact path="/" component={Main}/>
        </div>
        </div>
      </Router>
    )
  }
}

module.exports = App
