const video = document.querySelector('video');
const playBtn = document.getElementById('play');
const playBtnIcon = playBtn.querySelector('i');
const muteBtn = document.getElementById('mute');
const muteBtnIcon = muteBtn.querySelector('i');
const volumeRange = document.getElementById('volume');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const timeline = document.getElementById('timeline');
const fullScreenBtn = document.getElementById('fullScreen');
const fullScreenIcon = fullScreenBtn.querySelector('i');
const videoContainer = document.getElementById('videoContainer');
const videoControls = document.getElementById('videoControls');

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(14, 5);

const playPauseVideo = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? 'fas fa-play' : 'fas fa-pause';
};

const changeVideoTime = (seconds) => {
  video.currentTime += seconds;
};

const handlePlayClick = (event) => {
  playPauseVideo();
};

const handleMute = (event) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? 'fas fa-volume-mute'
    : 'fas fa-volume-up';
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;

  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = 'Mute';
  }
  volumeValue = value;
  video.volume = value;
};

const handleLoadedMetadata = (event) => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = (event) => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  video.currentTime = event.target.value;
};

const handleFullScreenClick = (event) => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = 'fas fa-expand';
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = 'fas fa-compress';
  }
};
const hideControls = () => videoControls.classList.remove('showing');

const handleMouseMove = (event) => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add('showing');
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMousLeave = (event) => {
  controlsTimeout = setTimeout(() => {
    hideControls();
  }, 2000);
};

const handleClickVideoContainer = (event) => {
  playPauseVideo();
};

const handleEnded = () => {
  const { videoId } = videoContainer.dataset;
  fetch(`/api//videos/${videoId}/view`, {
    method: 'POST',
  });
};

playBtn.addEventListener('click', handlePlayClick);
muteBtn.addEventListener('click', handleMute);
volumeRange.addEventListener('input', handleVolumeChange);
video.addEventListener('loadeddata', handleLoadedMetadata);
video.addEventListener('timeupdate', handleTimeUpdate);
video.addEventListener('ended', handleEnded);
timeline.addEventListener('input', handleTimelineChange);
fullScreenBtn.addEventListener('click', handleFullScreenClick);
videoContainer.addEventListener('mousemove', handleMouseMove);
videoContainer.addEventListener('mouseleave', handleMousLeave);
video.addEventListener('click', handleClickVideoContainer);
document.addEventListener('keydown', (event) => {
  if (event.key === ' ') {
    playPauseVideo();
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    changeVideoTime(-2);
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {
    changeVideoTime(2);
  }
});
