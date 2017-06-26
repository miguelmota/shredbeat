var _ = require('lodash')
var GK = require('global-keypress')
var debug = require('./debug')

// global keypress event receiver
var gk = new GK()

var keyPressLogger = {
  start: (props) => {
    debug('starting gk')
    // start global keypress listener
    gk.start()

    gk.on('press', _.throttle(data => {
      //debug('event', data)
      props.onPress(data)
    }, 250))

    gk.on('error', (error) => {
      debug(error)
    });

    gk.on('close', () => {
      debug('gk closed')
    })
  },
  stop: () => {
    // stop global keypress listener
    gk.stop()
  }
};

module.exports = keyPressLogger;
