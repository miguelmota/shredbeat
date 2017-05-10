var GK = require('global-keypress')
var debug = require('./debug')

// global keypress event receiver
var gk = new GK()

var keyPressLogger = {
  start: (props) => {
    // start global keypress listener
    gk.start()

    gk.on('press', (data) => {
      debug(data)

      props.onPress(data)
    })

    gk.on('error', (error) => {
      debug(error)
    });

    gk.on('close', () => {
      debug('gk closed')
    })
  },
  stop: () => {
    // stop global keypress listener
    //gk.stop()
  }
};

module.exports = keyPressLogger;