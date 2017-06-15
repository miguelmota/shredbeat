var getStreamUrls = require('fanburst-audio').getStreamUrls

class FanburstService {
  constructor() {

  }

  getPlaylist(playlistUrl) {
    return getStreamUrls(playlistUrl)
  }
}

module.exports = new FanburstService()
