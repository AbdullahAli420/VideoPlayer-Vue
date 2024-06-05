<template>
  <div>
    <!-- <button @click="(n) => changeFile()">{{ file }}</button> -->
    <div class="flex items-center justify-center bg-gray-700 p-0 m-0">
      <div
        :class="[file ? 'block' : 'hidden']"
        class="h-screen bg-gray-700 flex items-center justify-center flex-col"
      >
        <div>
          <div
            class="flex flex-col items-center justify-center border-2 border-white rounded-sm p-7 bg-gray-600 cursor-pointer"
            @click="(n) => upload.click()"
          >
            <input
              type="file"
              class="hidden"
              ref="upload"
              accept="video/*"
              @input="(file) => setVideo(file)"
            />
            <span class="material-symbols-outlined text-8xl text-white"> upload </span>
            <span class="text-2xl font-bold text-white">Choose Video</span>
          </div>
          <button
            class="underline text-white text-center m-auto w-full p-3"
            @click="
              () => {
                file = false;
                init();
              }
            "
          >
            Show Sample
          </button>
        </div>
      </div>
      <div
        class="relative bg-gray-800 h-screen w-screen flex p-0 m-0"
        ref="videoBlock"
        :class="[file ? 'hidden' : 'block']"
      >
        <div
          :class="[controls ? 'flex' : 'hidden']"
          class="absolute h-full w-full flex-col text-white"
        >
          <div class="flex justify-between p-2 bg-black bg-opacity-20">
            <h2 class="text-xl flex flex-wrap break-words">{{ title }}</h2>
            <button
              class="cursor-pointer z-10"
              @click="
                (n) => {
                  Video.src = './video.mp4';
                  title = 'Sample';
                  file = true;
                }
              "
            >
              <span class="material-symbols-outlined rounded-full text-xl cursor-pointer">
                close
              </span>
            </button>
          </div>
          <div class="relative h-full w-full flex cursor-pointer z-20">
            <div class="absolute right-0">
              <span
                @click="fullScreen()"
                class="material-symbols-outlined rounded-full bg-black bg-opacity-50 p-1"
              >
                {{ fullscreen ? "close_fullscreen" : "fullscreen" }}
              </span>
            </div>
            <div class="w-1/2 flex items-center justify-center" @dblclick="backward()">
              <span
                class="material-symbols-outlined rounded-full bg-black bg-opacity-50 p-1 text-2xl"
                @click="backward()"
              >
                replay_10
              </span>
            </div>
            <div class="flex items-center justify-center" @click="playVideo()">
              <span
                class="material-symbols-outlined rounded-full bg-black bg-opacity-50 p-1 text-6xl"
              >
                {{ pause ? "play_arrow" : "pause" }}
              </span>
            </div>
            <div class="w-1/2 flex items-center justify-center" @dblclick="forward()">
              <span
                class="material-symbols-outlined rounded-full bg-black bg-opacity-50 p-1 text-2xl"
                @click="forward()"
              >
                forward_10
              </span>
            </div>
          </div>
          <div class="top-full p-[10px] bg-black bg-opacity-60 z-50">
            <div
              class="flex border-t-4 border-white cursor-pointer z-30"
              @click="(n) => Seeker(n)"
              ref="tProgress"
            >
              <!-- <div class=""></div> -->
              <div
                class="top-[-4px] relative border-t-4 border-blue-500 videoSeeker flex"
                ref="pProgress"
              >
                <span
                  class="bg-blue-500 rounded-full p-2 absolute left-[97%] md:left-[99%] w-0 bottom-[-5px] right-0 seeker"
                  ref="seeker"
                ></span>
              </div>
            </div>
            <div class="flex justify-between">
              <p class="cursor-pointer">{{ currentDuration }}/{{ duration }}</p>
              <div class="flex">
                <button class="px-2">
                  <span
                    class="material-symbols-outlined cursor-pointer"
                    role="button"
                    @click="() => (muted = !muted)"
                  >
                    {{ muted ? "volume_off" : "volume_up" }}
                  </span>
                </button>
                <div class="relative">
                  <button @click="playRate()" class="">{{ playbackRate }}x</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <video
          ref="Video"
          :src="src"
          @contextmenu="
            (e) => {
              e.preventDefault();
            }
          "
          class="self-center rounded-lg h-full w-full"
          :muted="muted"
        />
        <div
          class="border-b-4 rounded-lg absolute w-full top-[98%] bottom-0 border-red-900 flex"
        >
          <!-- <div class=""></div> -->
          <div
            class="relative top-[20%] border-b-4 border-blue-500 videoSeeker w-full flex"
            ref="minPProgress"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const file = ref(true);
const upload = ref(null);
const title = ref("sample");
const seeker = ref(null);
const pProgress = ref(null);
const tProgress = ref(null);
const videoBlock = ref(null);
const currentDuration = ref(0);
const duration = ref(0);
const Video = ref(null);
const seeking = ref(false);
const mouseX = ref(false);
const playbackRate = ref();
const fullscreen = ref(false);
const controls = ref(false);
const mouseOnBlock = ref(false);
const minPProgress = ref(null);
const src = ref("./video.mp4");
const pause = ref(true);
const muted = ref(false);
const playbackRates = reactive({
  rates: [0.5, 0.75, 1, 1.5, 2],
  index: 2,
});
const mouseOffset = reactive({
  x: 0,
  y: 0,
});

const setVideo = (file) => {
  title.value = file.target.files[0].name;
  title.value = title.value.split("").slice(0, 30).join("");
  const reader = new FileReader();
  reader.onload = (e) => {
    changeFile();
    src.value = e.target.result;
  };
  reader.readAsDataURL(file.target.files[0]);
};

const backward = () => {
  Video.value.currentTime = Video.value.currentTime - 10;
};
const forward = () => {
  Video.value.currentTime = Video.value.currentTime + 10;
};
const alert = (string) => {
  console.log(string);
};

const changeFile = () => {
  file.value = !file.value;
  Video.value.addEventListener("loadeddata", () => {
    init();
  });
};

const setPause = (val) => {
  pause.value = val;
};

const init = () => {
  if (Video.value && Video.value.duration) {
    duration.value = durationFormatter(Video.value.duration);
    currentDuration.value = durationFormatter(Video.value.currentTime);
    playbackRate.value = playbackRates.rates[playbackRates.index];

    setInterval(() => {
      if (!mouseOnBlock.value) {
        controls.value = false;
      } else {
        mouseOnBlock.value = !mouseOnBlock.value;
      }
    }, 2500);

    setInterval(() => {
      if (Video.value) {
        if (!Video.value.paused) {
          const width =
            (Video.value.currentTime.toFixed() / Video.value.duration.toFixed()) * 100;
          pProgress.value.style.width = `${width.toFixed()}%`;
          currentDuration.value = durationFormatter(Video.value.currentTime);
          minPProgress.value.style.width = `${width.toFixed()}%`;
          setPause(false);
        } else {
          setPause(true);
        }
      }
    }, 100);

    window.addEventListener("fullscreenchange", () => {
      fullscreen.value = !fullscreen.value;
    });

    window.addEventListener("mousemove", (event) => {
      mouseX.value = event.clientX;
    });

    seeker.value.addEventListener("mousedown", (event) => {
      mouseOffset.x = event.clientX;
      mouseOffset.y = event.clientY;
      seeking.value = true;
    });

    videoBlock.value.addEventListener("mousemove", (event) => {
      controls.value = true;
      mouseOnBlock.value = true;
      if (seeking.value) {
        Seeker();
      }
    });

    videoBlock.value.addEventListener("mouseout", () => {
      mouseOnBlock.value = false;
    });

    window.addEventListener("mouseup", () => {
      if (seeking.value) {
        seeking.value = false;
        mouseOffset.x = 0;
        mouseOffset.y = 0;
      }
    });

    // Touch events
    window.addEventListener("touchmove", (event) => {
      mouseX.value = event.touches[0].clientX;
    });

    seeker.value.addEventListener("touchstart", (event) => {
      mouseOffset.x = event.touches[0].clientX;
      mouseOffset.y = event.touches[0].clientY;
      seeking.value = true;
    });

    videoBlock.value.addEventListener("touchmove", (event) => {
      if (seeking.value) {
        Seeker();
      }
    });

    window.addEventListener("touchend", () => {
      if (seeking.value) {
        seeking.value = false;
        mouseOffset.x = 0;
        mouseOffset.y = 0;
      }
    });
  }
};

const playRate = () => {
  playbackRates.index++;
  if (playbackRates.index > playbackRates.rates.length - 1) {
    playbackRates.index = 0;
  }
  // console.log(playbackRates.rates[playbackRates.index]);
  Video.value.playbackRate = playbackRates.rates[playbackRates.index];
  playbackRate.value = playbackRates.rates[playbackRates.index];
};
const playVideo = () => {
  if (Video.value) {
    if (Video.value.paused) {
      // console.log(Video.value.duration);
      pause.value = false;
      Video.value.play();
    } else {
      Video.value.pause();
      pause.value = true;
    }
  }
};
const fullScreen = () => {
  if (!fullscreen.value) {
    if (videoBlock.value.requestFullscreen) {
      videoBlock.value.requestFullscreen();
    } else if (videoBlock.value.webkitRequestFullscreen) {
      /* Safari */
      videoBlock.value.webkitRequestFullscreen();
    } else if (videoBlock.value.msRequestFullscreen) {
      /* IE11 */
      videoBlock.value.msRequestFullscreen();
    }
    // fullscreen.value = true;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE11 */
      document.msExitFullscreen();
    }
    // fullscreen.value = false;
  }
};

const durationFormatter = (dur) => {
  let hour = 0;
  while (dur >= 3600) {
    dur -= 3600;
    hour++;
  }
  if (hour < 10) hour = `0${hour}`;

  let min = 0;
  while (dur >= 60) {
    dur -= 60;
    min++;
  }
  if (min < 10) min = `0${min}`;

  let sec = dur.toFixed();
  if (sec < 10) sec = `0${sec}`;

  if (hour === "00") {
    return `${min}:${sec}`;
  }

  return `${hour}:${min}:${sec}`;
};

const Seeker = (events) => {
  if (Video.value) {
    //const seek = window.getComputedStyle(seeker.value);
    //const pSeek = window.getComputedStyle(pProgress.value);
    const tSeekWidth = parseFloat(window.getComputedStyle(tProgress.value).width);
    const vBlockWidth = parseFloat(window.getComputedStyle(videoBlock.value).width);
    const bodyWidth = parseFloat(window.getComputedStyle(document.body).width);
    const vBlockStart = bodyWidth / 2 - vBlockWidth / 2;
    let seekWidth = (
      ((mouseX.value - (vBlockStart + 9)) / (tSeekWidth + 9)) *
      100
    ).toFixed();
    if (seekWidth > 100) {
      seekWidth = `100`;
    }
    pProgress.value.style.width = `${seekWidth}%`;
    minPProgress.value.style.width = `${seekWidth}%`;
    const dur = ((parseInt(seekWidth) * Video.value.duration) / 100).toFixed(2);
    Video.value.currentTime = dur;
    //currentDuration.value = Video.value.currentTime;
  }
};
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
.videoSeeker {
  width: 0%;
}
div,
span {
	padding: 0px;
	margin: 0px;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
</style>
