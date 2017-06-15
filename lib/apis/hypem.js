var getStreamUrls = require('hypem-audio').getStreamUrls

class HypemService {
  constructor() {

  }

  getPlaylist(playlistUrl) {
    return getStreamUrls(playlistUrl)
  }
}

module.exports = new HypemService()

