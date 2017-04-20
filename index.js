var playButton = document.querySelector('#play');
var stopButton = document.querySelector('#stop');

var shredProgressFill = document.querySelector('#shredProgressFill');

var isPlaying = false;

function play() {
  audio.play();
  isPlaying = true;
}

function stop() {
  audio.pause();
}

var playbackRange = [0.75, 3];

var audio = new Audio('program.mp3');

playButton.addEventListener('click', play);
stopButton.addEventListener('click', stop);

var keyup$ = Rx.Observable.fromEvent(document, 'keyup');

var volumeRange = [0.1, 1];
var scale = LinearScale([500, 1000], playbackRange);
var progressScale = LinearScale([0.75, 3], [0, 100]);
var volumeScale = LinearScale([500, 1000], volumeRange);

var rate = playbackRange[0];
var volume = volumeRange[0];

var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var gainNode = audioContext.createGain();

var lastRate = rate;
var currentRate = rate;
var i = -1;

var t = null;

keyup$
.timestamp()
.map(x => x.timestamp)
.pairwise()
.map(([a, b]) => b - a)
.subscribe(delta => {
  if (!isPlaying) return false;

  rate = scale(delta);

  rate = playbackRange[1] - rate;

  if (rate >= playbackRange[1]) {
    rate = playbackRange[1];
  } else if (rate <= playbackRange[0]) {
    rate = playbackRange[0];
  }

  if (rate - lastRate >= 0) {
    i = 1;
  } else {
    i = -1;
  }

  lastRate = rate;

  clearTimeout(t);
  t = setTimeout(() => {
    i = -1;
  }, 1000);

});

setInterval(() => {
  if (!isPlaying) return false;

  currentRate += (0.001 * i);

  shredProgressFill.style.width = `${progressScale(currentRate)}%`;

  if (currentRate >= playbackRange[1]) {
    currentRate = playbackRange[1];
  } else if (currentRate <= playbackRange[0]) {
    currentRate = playbackRange[0];
  }


  volume += (0.01 * i);

  if (volume >= volumeRange[1]) {
    volume = volumeRange[1];
  } else if (volume <= volumeRange[0]) {
    volume = volumeRange[0];
  }

  console.log(currentRate, volume)

  audio.playbackRate = currentRate;
  audio.volume = volume;
}, 100);
