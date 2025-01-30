"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class VideoPlayer {
    constructor(parentId, videoSrc, skipTime = 5, controlColor = "#a26f77") {
        this.style = document.createElement("style");
        this.prevVolume = 1;
        this.skipTime = skipTime;
        this.controlColor = controlColor;
        const parent = document.getElementById(parentId);
        if (!parent)
            throw new Error("Parent container not found");
        this.container = document.createElement("div");
        this.container.className = "video-player-container";
        this.video = document.createElement("video");
        this.video.className = "video-element";
        this.video.controls = false;
        const source = document.createElement("source");
        source.src = videoSrc;
        source.type = "video/mp4";
        this.video.appendChild(source);
        // Controls container for all the controls
        this.controls = document.createElement("div");
        this.controls.className = "controls-container";
        this.playBtn = this.createIcon("fa-play", "play");
        this.backwardBtn = this.createIcon("fa-backward", "backwardBtn");
        this.forwardBtn = this.createIcon("fa-forward", "forwardBtn");
        this.muteBtn = this.createIcon("fa-volume-high", "muteBtn");
        this.fullScreenBtn = this.createIcon("fa-expand", "fullscreenBtn");
        // Seekin the bar of the video
        this.timeRange = document.createElement("input");
        this.timeRange.type = "range";
        this.timeRange.className = "seek-bar";
        this.timeRange.value = "0";
        // Volume customization boi ..
        this.volumeSlider = document.createElement("input");
        this.volumeSlider.type = "range";
        this.volumeSlider.className = "volume-slider";
        this.volumeSlider.min = "0";
        this.volumeSlider.max = "1";
        this.volumeSlider.step = "0.1";
        this.volumeSlider.value = "1";
        // 34an el color yb2a full
        this.updateVolume();
        // Speed Selecttionnnn
        this.speedSelect = document.createElement("select");
        this.speedSelect.className = "speed-select";
        ["1", "0.5", "1.5", "2"].forEach((speed) => {
            const option = document.createElement("option");
            option.value = speed;
            option.textContent = `${speed}x`;
            this.speedSelect.appendChild(option);
        });
        this.controls.append(this.playBtn, this.backwardBtn, this.forwardBtn, this.timeRange, this.muteBtn, this.volumeSlider, this.speedSelect, this.fullScreenBtn);
        this.container.append(this.video, this.controls);
        parent.appendChild(this.container);
        this.initEvents();
        // Inject Styles into the head of the html <head>
        this.injectStyles(parentId);
        this.container.className = `video-player-container-${parentId}`;
        this.video.className = `video-element-${parentId}`;
        this.controls.className = `controls-container-${parentId}`;
        this.timeRange.className = `seek-bar-${parentId}`;
        this.volumeSlider.className = `volume-slider-${parentId}`;
        this.speedSelect.className = `speed-select-${parentId}`;
    }
    injectStyles(parentId) {
        this.style.textContent = `
       .fullscreen-mode .controls-container-${parentId} {
        position: absolute;
        bottom: 10px;
        width: 100%;
        background: rgba(0, 0, 0, 0.5);
         padding: 10px;
         border-radius: 5px;
      }

       .fullscreen-mode {
      width: 100vw !important;
        height: 100vh !important;
         display: flex;
         flex-direction: column;
        align-items: center;
         justify-content: center;
       }

       .fullscreen-mode .video-element {
         width: 100%;
        height: 90vh;
       }


      .video-player-container-${parentId} {
        width: 800px;
        background: #222;
        padding: 10px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
  
      .video-element-${parentId} {
        width: 100%;
        border-radius: 5px;
      }
  
      .controls-container-${parentId} {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(0, 0, 0, 0.8);
        padding: 10px;
        border-radius: 5px;
        margin-top: 10px;
      }
  
      .controls-container-${parentId} i {
        color: ${this.controlColor};
        font-size: 20px;
        cursor: pointer;
      }
  


      .seek-bar-${parentId} , .volume-slider-${parentId} {
   
    height: 4px;
    appearance: none;
    background: linear-gradient(to right, ${this.controlColor} 0%, ${this.controlColor} 0%, #555 0%);
    border-radius: 2px;
    outline: none;
    transition: background 0.2s;
    cursor: pointer;
  }

  .seek-bar-${parentId}::-webkit-slider-thumb, .volume-slider-${parentId}::-webkit-slider-thumb {
    appearance: none;
    background-color: ${this.controlColor};
    border-radius: 50%;
    height: 15px;
    width: 15px;
    cursor: pointer;
    position: relative;
    z-index: 2;
  }

  .seek-bar-${parentId}::-moz-range-thumb {
    background-color: ${this.controlColor};
    border-radius: 50%;
    height: 15px;
    width: 15px;
    cursor: pointer;
  }
      .speed-select-${parentId} {
        background: black;
        color: ${this.controlColor};
        padding: 3px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
    `;
        document.head.appendChild(this.style);
    }
    createIcon(iconClass, id) {
        const icon = document.createElement("i");
        icon.className = `fa-solid ${iconClass} play-button`;
        icon.id = id;
        return icon;
    }
    initEvents() {
        this.playBtn.addEventListener("click", () => this.togglePlay());
        this.muteBtn.addEventListener("click", () => this.toggleMute());
        this.timeRange.addEventListener("input", () => this.seekVideo());
        this.video.addEventListener("timeupdate", () => this.updateProgress());
        this.video.addEventListener("durationchange", () => this.changeDuration());
        this.forwardBtn.addEventListener("click", () => this.skip(this.skipTime));
        this.backwardBtn.addEventListener("click", () => this.skip(-this.skipTime));
        this.fullScreenBtn.addEventListener("click", () => this.toggleFullScreen());
        this.volumeSlider.addEventListener("input", () => this.adjustVolume());
        this.speedSelect.addEventListener("change", () => this.changeSpeed());
    }
    togglePlay() {
        if (this.video.paused) {
            this.video.play();
            this.playBtn.classList.replace("fa-play", "fa-pause");
        }
        else {
            this.video.pause();
            this.playBtn.classList.replace("fa-pause", "fa-play");
        }
    }
    //////////volume
    toggleMute() {
        if (this.video.muted || this.video.volume === 0) {
            // Restore the previous volume
            this.video.muted = false;
            this.video.volume = this.prevVolume > 0 ? this.prevVolume : 0.5;
            this.volumeSlider.value = String(this.video.volume);
            this.muteBtn.classList.replace("fa-volume-mute", "fa-volume-high");
        }
        else {
            // dh 34an yrg3nt ll current when i unmute so it saves the prev number that i was currently on
            this.prevVolume = this.video.volume;
            this.video.muted = true;
            this.video.volume = 0;
            this.volumeSlider.value = "0";
            this.muteBtn.classList.replace("fa-volume-high", "fa-volume-mute");
        }
        this.updateVolume();
    }
    adjustVolume() {
        const volume = Number(this.volumeSlider.value);
        // lw ana 7rkt f el progress range
        this.video.muted = volume === 0 ? true : false;
        this.video.volume = volume;
        // 34an lma 23ml mute
        this.muteBtn.classList.toggle("fa-volume-mute", volume === 0);
        this.muteBtn.classList.toggle("fa-volume-high", volume > 0);
        // 34an el unmute
        if (volume > 0)
            this.prevVolume = volume;
        this.updateVolume();
    }
    updateVolume() {
        const volumeLevel = Number(this.volumeSlider.value) * 100; // Convert to percentage
        if (this.video.muted || this.video.volume === 0) {
            this.volumeSlider.style.background = `linear-gradient(to right, #555 0%, #555 100%)`;
        }
        else {
            this.volumeSlider.style.background = `linear-gradient(to right, ${this.controlColor} ${volumeLevel}%, #555 ${volumeLevel}%)`;
        }
    }
    updateProgress() {
        const progress = (this.video.currentTime / this.video.duration) * 100;
        this.timeRange.value = String(this.video.currentTime);
        this.timeRange.style.background = `linear-gradient(to right, ${this.controlColor} ${progress}%, #555 ${progress}%)`;
    }
    changeDuration() {
        this.timeRange.max = String(this.video.duration);
    }
    seekVideo() {
        this.video.currentTime = Number(this.timeRange.value);
        const progress = (this.video.currentTime / this.video.duration) * 100;
        this.timeRange.style.background = `linear-gradient(to right, ${this.controlColor} ${progress}%, #555 ${progress}%)`;
    }
    skip(seconds) {
        this.video.currentTime += seconds;
    }
    changeSpeed() {
        this.video.playbackRate = Number(this.speedSelect.value);
    }
    toggleFullScreen() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!document.fullscreenElement) {
                    yield this.container.requestFullscreen();
                    this.container.classList.add("fullscreen-mode");
                }
                else {
                    yield document.exitFullscreen();
                    this.container.classList.remove("fullscreen-mode");
                }
            }
            catch (err) {
                console.error("Error toggling fullscreen:", err);
            }
        });
    }
}
//weeeeeeeeeeee
document.addEventListener("DOMContentLoaded", () => {
    new VideoPlayer("videoContainer", "./vid.mp4", 10, "#a26f77");
});
document.addEventListener("DOMContentLoaded", () => {
    new VideoPlayer("videoContainer2", "./vid.mp4", 10, "#ff5733");
});
//# sourceMappingURL=index.js.map