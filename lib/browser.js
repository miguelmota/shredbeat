var path = require('path')
var Rx = require('rxjs')
var _ = require('lodash')
var d3 = require('d3')
var Datastore = require('nedb')
var {remote} = require('electron')

var {Player, YoutubePlayer} = require('audio-director')
var player = null

var musicService = require('./musicService')

var db = new Datastore({
  filename: 'shredbeat.db',
  autoload: true,
  inMemoryOnly: false
})

var playButton = document.querySelector('#play');
var stopButton = document.querySelector('#stop');
var playlistUrlInput = document.querySelector('#playlistUrl');
var playlistUrlSubmit = document.querySelector('#playlistUrlSubmit');

var shredProgressFill = document.querySelector('#shredProgressFill');
var isPlaying = false;

function play() {
  player.play();
  isPlaying = true;

  stopButton.disabled = false;
  playButton.disabled = true;
}

function stop() {
  player.pause();

  stopButton.disabled = true;
  playButton.disabled = false;
}


/*
var color = d3.scaleLinear().domain([1,1.1])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb('#7f008e'), d3.rgb("#e800d7")]);
      */

var playbackRange = [1, 3];

playButton.addEventListener('click', play);
stopButton.addEventListener('click', stop);

var keyup$ = Rx.Observable.fromEvent(document, 'keyup');

var shredbeat = window.shredbeat || {};

if (typeof shredbeat.osGlobalKeyPress === 'function') {
  keyup$ = new Rx.Subject();
  shredbeat.osGlobalKeyPress((event) => {
    keyup$.next(event);
  });
}

var volumeRange = [0.1, 1];
var scale = d3.scaleLinear()
    .domain([0, 1000])
    .range([3, 1]);

scale.clamp(true);

var progressScale = d3.scaleLinear()
    .domain([1, 2.5])
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

  currentRate += (x *  0.001 * i);

  console.log("R", currentRate)

  shredProgressFill.style.width = `${100 - progressScale(currentRate)}%`;

  if (currentRate >= playbackRange[1]) {
    currentRate = playbackRange[1];
  } else if (currentRate <= playbackRange[0]) {
    currentRate = playbackRange[0];
  }


  volume += (0.005 * i);

  if (volume >= volumeRange[1]) {
    volume = volumeRange[1];
  } else if (volume <= volumeRange[0]) {
    volume = volumeRange[0];
  }

//  console.log(currentRate, volume)

  player.setPlaybackRate(currentRate)
  player.setVolume(volume)
}, 50);

var url = null

playlistUrlSubmit
.addEventListener('click', handlePlaylistUrlSubmit);

function handlePlaylistUrlSubmit(event) {
  event.preventDefault();
  var url = playlistUrlInput.value;

  db.update({
    id: 1
  }, {
    id: 1,
    playlistUrl: url
  }, {upsert: true}, (error, newDoc) => {
    if (error) {
      console.error(error)
    }
  });

  setPlaylistUrl(url);
}

var playerA = new Player()
var playerB = new YoutubePlayer()

function setPlaylistUrl(url) {
  playlistUrlSubmit.disabled = true;

  if (/youtube\.com/gi.test(url)) {
    player = playerB
    player.emptyQueue()
    return player.enqueue(url)
  } else {
    player = playerA
  }

  musicService.getPlaylist(url)
  .then(tracks => {
    playlistUrlSubmit.disabled = false;
    playButton.disabled = false;
    console.log(tracks)
    player.emptyQueue()
    return player.enqueue(tracks)
  })
  .catch(error => {
    console.error(error)
  });
}

db.findOne({
  id: 1
}, (error, doc) => {
  if (error) {
    console.error(error)
  }

  if (doc) {
    var playlistUrl = doc.playlistUrl
    setPlaylistUrl(playlistUrl);
    playlistUrlInput.value = playlistUrl;
  }
});

function setRandBg() {
  var rand = _.random(1, 16);
  //document.body.style.backgroundImage = `url(../gifs/${rand}.gif)`;
}

setRandBg();

setInterval(setRandBg, 1e4);

var quit = document.querySelector('#quit');
quit.addEventListener('click', event => {
  event.preventDefault()

  remote.app.quit()
})
