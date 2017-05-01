var playButton = document.querySelector('#play');
var stopButton = document.querySelector('#stop');
var playlistUrlInput = document.querySelector('#soundcloudUrl');
var playlistUrlSubmit = document.querySelector('#soundcloudUrlSubmit');

var shredProgressFill = document.querySelector('#shredProgressFill');
var isPlaying = false;

function play() {
  audio.play();
  isPlaying = true;
}

function stop() {
  audio.pause();
}


/*
var color = d3.scaleLinear().domain([1,1.1])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb('#7f008e'), d3.rgb("#e800d7")]);
      */

var playbackRange = [1, 3];

var audio = new Audio('../media/program.mp3');

playButton.addEventListener('click', play);
stopButton.addEventListener('click', stop);

var keyup$ = Rx.Observable.fromEvent(document, 'keyup');

var volumeRange = [0.1, 1];
var scale = d3.scaleLinear()
    .domain([0, 1000])
    .range([3, 1]);

scale.clamp(true);

var progressScale = d3.scaleLinear()
    .domain([1, 1.5])
    .range([0, 100]);

progressScale.clamp(true);

var volumeScale = d3.scaleLinear()
  .domain([500, 1000])
  .range(volumeRange);

volumeScale.clamp(true);

var expScale = d3.scaleLinear()
  .domain([0.75, 3])
  .range([1, 10]);

expScale.clamp(true);

var rate = playbackRange[0];
var volume = volumeRange[0];

var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var gainNode = audioContext.createGain();

var lastRate = rate;
var currentRate = rate;
var i = -1;

var t = null;

var x = 1;

keyup$
.timestamp()
.map(obj => obj.timestamp)
.pairwise()
.map(([a, b]) => b - a)
.subscribe(delta => {
  if (!isPlaying) return false;

  console.log('delta', delta)

  x = scale(delta);

  console.log(x);

    i = 1;
  //rate = x

/*
  if (rate - lastRate >= 0) {
    i = 1;
  } else {
    i = -1;
  }
  */

  lastRate = rate;

  clearTimeout(t);
  t = setTimeout(() => {
    i = -1;
  }, 1000);

});

setInterval(() => {
  if (!isPlaying) return false;

  //console.log("X",x)

  currentRate += (x *  0.0001 * i);

  console.log("R", currentRate)

  shredProgressFill.style.width = `${100 - progressScale(currentRate)}%`;

  if (currentRate >= playbackRange[1]) {
    currentRate = playbackRange[1];
  } else if (currentRate <= playbackRange[0]) {
    currentRate = playbackRange[0];
  }


  volume += (0.001 * i);

  if (volume >= volumeRange[1]) {
    volume = volumeRange[1];
  } else if (volume <= volumeRange[0]) {
    volume = volumeRange[0];
  }

//  console.log(currentRate, volume)

  audio.playbackRate = currentRate;
  audio.volume = volume;
}, 50);

var clientIdParam = 'client_id=a0cbcf3a37c999ef9eae76469ea8db92';

function handleTrackResponse(response) {
  if (response.kind === 'track') {
    if (response.stream_url) {
      return `${response.stream_url}?${clientIdParam}`;
    }
  }

  return null;
}

function getPlaylist(url) {
  return fetch(`http://api.soundcloud.com/resolve?url=${url}&${clientIdParam}`)
  .then(response => response.json())
  .then(json => {
  console.log(json)
    var {kind} = json;
    if (kind === 'track') {
      return [handleTrackResponse(json)];
    } else if (kind === 'user') {
      return fetch(`${json.uri}/tracks?${clientIdParam}`)
      .then(response => response.json())
      .then(json => {
        return json
          .map(handleTrackResponse);
      });
    } else if (kind === 'playlist') {
      return json.tracks.map(handleTrackResponse);
    }

    return [];
  })
  .then(tracks => {
    return tracks
      .filter(x => x)
  });
}

function getTrack() {
}

var url = 'https://soundcloud.com/rm-rfall/sets/synthwave-fuckink-playlist'

soundcloudUrlSubmit
.addEventListener('click', handlePlaylistUrlSubmit);

function handlePlaylistUrlSubmit(event) {
  event.preventDefault();
  var url = playlistUrlInput.value;

  localStorage.setItem('playlist_url', url);

  setPlaylistUrl(url);
}

function setPlaylistUrl(url) {
  getPlaylist(url)
  .then(tracks => {
  console.log(tracks)
  audio.src = tracks[0];
  })
  .catch(error => {
    alert(error);
  });
}

var cachedPlaylistUrl = localStorage.getItem('playlist_url');
if (cachedPlaylistUrl) {
//  setPlaylistUrl(cachedPlaylistUrl);
}

function setRandBg() {
  const rand = getRandomInt(1, 16);
  document.body.style.backgroundImage = `url(/gifs/${rand}.gif)`;
}

setRandBg();

setInterval(setRandBg, 1e4);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
