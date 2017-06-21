const React = require('react')
const ReactDOM = require('react-dom')

function Shredometer(props) {
  const shredProgress = props.shredProgress;
  var level = null

  if (shredProgress >= 0 && shredProgress < 30) {
    level = 'low'
  } else if (shredProgress >= 30 && shredProgress < 70) {
    level = 'medium'
  } else if (shredProgress >= 70) {
    level = 'high'
  }

  return (
      <div className="Shredometer">
        <div className="ui header ShredometerTitle">
          Shredometer
        </div>
        <div className="ShredometerProgress">
          |
          <div
            className={`ShredometerProgressFill ${level}`}
            style={{width: `${shredProgress}%`}}>
            </div>
        </div>
      </div>
    )
}

module.exports = Shredometer
