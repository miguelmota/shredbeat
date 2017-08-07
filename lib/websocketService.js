class WebsocketService {
  constructor () {
    this.SocketStates = {
      CONNECTING: 0,
      OPEN: 1,
      CLOSING: 2,
      CLOSED: 3
    }

    this.onPeerUpdateCb = () => {}

    let pathname = '/'
    let host = 'connect.shredbeat.com'
    //let host = 'localhost:3834'
    const protocol = window.location.protocol
    const socket = new window.WebSocket(`${protocol === 'https:' ? `wss` : `ws`}://${host}${pathname}`)

    this.socket = socket

    function yourId (id) {
      console.log('id= ' + id)
    }

    function onMessage (message) {
      console.log('Received message: ', message)
    }

    socket.addEventListener('message', event => {
      var message = event.data
      console.log('MESSAGE', message)

      try {
        message = JSON.parse(message)
      } catch (error) {
        console.error('PARSE ERROR', error)
        return false
      }

      const {eventName, data} = message
      console.log('eventName', eventName)

      if (eventName === 'socket_id') {
        yourId(data)
        return false
      } else if (eventName === 'disconnected') {
        // disconnected(data)
        return false
      } else if (eventName === 'logon') {
        // logon(data)
        return false
      } else if (eventName === 'logoff') {
        // logoff(data)
        return false
      } else if (eventName === 'connections') {
        console.log('connections', data)
        return false
      } else if (eventName === 'update') {
        this.onPeerUpdateCb(data)
        console.log('UPDATE', data)
        return false
      } else if (eventName === 'message') {
        onMessage(data)
        return false
      }
    })
  }

  getSocket () {
    return this.socket
  }

  send (eventName, data) {
    this.socket.send(JSON.stringify({eventName, data}))
  }

  isOpen () {
    return this.socket.readyState === this.SocketStates.OPEN
  }

  connectToPeer (id) {
    this.send('connectToPeer', {id})
  }

  onPeerUpdate (cb) {
    this.onPeerUpdateCb = cb.bind(this)
  }
}

const websocketService = new WebsocketService()

window.connectToPeer = (id) => websocketService.connectToPeer(id)

module.exports = websocketService
