var url = require('url')

var soundcloud = require('./apis/soundcloud')
var mixcloud = require('./apis/mixcloud')

class MusicService {
  constructor() {

  }

  getPlaylist(playlistUrl) {
    var hostname = url.parse(playlistUrl).hostname

    if (/soundcloud/gi.test(hostname)) {
      return soundcloud.getPlaylist(playlistUrl)
    } else if (/mixcloud/gi.test(hostname)) {
      return mixcloud.getPlaylist(playlistUrl)
    } else {
      return Promise.reject(hostname + ' music service not supported')
    }
  }
}

module.exports = new MusicService()
