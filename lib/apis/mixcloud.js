var getStreamUrls = require('mixcloud-audio').getStreamUrls

class MixcloudService {
  constructor() {

  }

  getPlaylist(playlistUrl) {
    return getStreamUrls(playlistUrl)
  }
}

module.exports = new MixcloudService()
