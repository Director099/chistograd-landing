export class ToggleSoundVideo {
  constructor({video, btn}) {
    this.video = document.querySelector(video);
    this.btn = document.querySelector(btn);

    !!this.video && this._init();
  }

  toggleIcon() {
    this.btn.classList.toggle('active');
  }

  toggleMutedVideo() {
    if(this.video.muted) {
      this.video.muted = false
      this.video.play()
    } else {
      this.video.muted = true
    }
  }

  _events() {
    this.btn.addEventListener('click', () => {
      this.toggleMutedVideo()
      this.toggleIcon()
    })
  }

  _init() {
    this._events()
  }
}

new ToggleSoundVideo({
  video: '[data-video]',
  btn: "[data-toggle-sound-video]"
})
