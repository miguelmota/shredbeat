var config = {
  clientId: 'a0cbcf3a37c999ef9eae76469ea8db92'
}

class SoundCloudService {
  constructor(config) {
    this.clientId = config.clientId

    this.handleTrackResponse = this.handleTrackResponse.bind(this)
    this.getPlaylist = this.getPlaylist.bind(this)
  }

  clientIdParam() {
    return 'client_id=' + this.clientId
  }

  handleTrackResponse(response) {
    if (response.kind === 'track') {
      if (response.stream_url) {
        return `${response.stream_url}?${this.clientIdParam()}`
      }
    }

    return null
  }

  getPlaylist(url) {
    return fetch(`https://api.soundcloud.com/resolve?url=${url}&${this.clientIdParam()}`)
    .then(response => response.json())
    .then(json => {
      console.log(json)
      var {kind} = json
      if (kind === 'track') {
        return [this.handleTrackResponse(json)]
      } else if (kind === 'user') {
        return fetch(`${json.uri}/tracks?${this.clientIdParam()}`)
        .then(response => response.json())
        .then(json => {
          return json
            .map(this.handleTrackResponse)
        })
      } else if (kind === 'playlist') {
        return json.tracks.map(this.handleTrackResponse)
      }

      return []
    })
    .then(tracks => {
      return tracks
        .filter(x => x)
    })
  }
}

module.exports = new SoundCloudService(config)
