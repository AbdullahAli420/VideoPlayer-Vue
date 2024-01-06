<template>
  <div>
    <div class="flex items-center justify-center w-screen h-screen">
      <div class="relative bg-gray-900 h-3/4 w-fit flex" ref="videoBlock">
        <div
          :class="[controls ? 'flex' : 'hidden']"
          class="absolute h-full w-full flex-col text-white"
        >
          <div
            class="flex justify-between p-2 bg-black bg-opacity-20 rounded-full"
          >
            <h2 class="text-xl">This is title...</h2>
            <span
              class="material-symbols-outlined rounded-full text-xl cursor-pointer"
            >
              close
            </span>
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
            <div
              class="w-1/2 flex items-center justify-center"
              @dblclick="backward()"
              @click="playVideo()"
            >
              <span
                class="material-symbols-outlined rounded-full bg-black bg-opacity-50 p-1"
                @click="backward()"
              >
                replay_10
              </span>
            </div>
            <div class="flex items-center justify-center" @click="playVideo()">
              <span
                class="material-symbols-outlined rounded-full bg-black bg-opacity-50 p-1"
              >
                play_arrow
              </span>
            </div>
            <div
              class="w-1/2 flex items-center justify-center"
              @dblclick="forward()"
              @click="playVideo()"
            >
              <span
                class="material-symbols-outlined rounded-full bg-black bg-opacity-50 p-1"
                @click="forward()"
              >
                forward_10
              </span>
            </div>
          </div>
          <div class="top-full p-[10px]">
            <div
              class="flex border-t-4 border-red-900 cursor-pointer"
              @click="(n) => Seeker(n)"
              ref="tProgress"
            >
              <!-- <div class=""></div> -->
              <div
                class="top-[-4px] relative border-t-4 border-blue-500 videoSeeker flex"
                ref="pProgress"
              >
                <span
                  class="bg-blue-500 rounded-full p-2 absolute left-[99%] w-0 bottom-[-5px] right-0 seeker"
                  ref="seeker"
                ></span>
              </div>
            </div>
            <div class="flex justify-between">
              <p class="cursor-pointer">{{ currentDuration }}/{{ duration }}</p>
              <div class="flex">
                <div class="relative">
                  <button @click="playRate()" class="">
                    {{ playbackRate }}x
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <video
          ref="Video"
          src="/video.mp4"
          @contextmenu="
            (e) => {
              e.preventDefault();
            }
          "
          class="self-center rounded-lg h-3/4 w-full"
        />
        <div
          class="border-b-4 rounded-lg absolute w-full top-[100%] bottom-0 border-red-900 flex"
        >
          <!-- <div class=""></div> -->
          <div
            class="relative border-t-1 border-blue-500 videoSeeker flex"
            ref="minPProgress"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
const playbackRates = reactive({
  rates: [0.5, 0.75, 1, 1.5, 2],
  index: 2,
});
const mouseOffset = reactive({
  x: 0,
  y: 0,
});
const backward = () => {
  Video.value.currentTime = Video.value.currentTime - 10;
};
const forward = () => {
  Video.value.currentTime = Video.value.currentTime + 10;
};
const alert = (string) => {
  console.log(string);
};
onMounted(() => {
  if (Video.value.duration) {
    Video.value.oncanplay = (e) => {
      console.log(e);
      // duration.value = Video.value.duration;
      // console.log(duration.value, Video.value);
    };

    duration.value = durationFormatter(Video.value.duration);
    currentDuration.value = durationFormatter(Video.value.currentTime);
    playbackRate.value = playbackRates.rates[playbackRates.index];

    setInterval(() => {
      if (!mouseOnBlock.value) controls.value = false;
    }, 1000);

    setInterval(() => {
      if (Video.value) {
        if (!Video.value.paused) {
          const width =
            (Video.value.currentTime.toFixed() /
              Video.value.duration.toFixed()) *
            100;
          pProgress.value.style.width = `${width.toFixed()}%`;
          currentDuration.value = durationFormatter(Video.value.currentTime);
          minPProgress.value.style.width = `${width.toFixed()}%`;
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
});
const playRate = () => {
  playbackRates.index++;
  if (playbackRates.index > playbackRates.rates.length - 1) {
    playbackRates.index = 0;
  }
  console.log(playbackRates.rates[playbackRates.index]);
  Video.value.playbackRate = playbackRates.rates[playbackRates.index];
  playbackRate.value = playbackRates.rates[playbackRates.index];
};
const playVideo = () => {
  if (Video.value) {
    if (Video.value.paused) {
      // console.log(Video.value.duration);
      Video.value.play();
    } else {
      Video.value.pause();
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
  if (dur >= 3600) {
    let hour = 0;
    for (hour = 0; hour < dur; hour += 3600) hour++;
    if (hour < 10) hour = `0${hour}`;

    dur = dur - hour * 3600;
    let min = 0;
    for (min; min < dur; min += 60) min++;
    if (min < 10) min = `0${min}`;

    let sec = dur - min * 60;
    if (sec < 10) sec = `0${sec}`;

    return `${dur / 60}`;
  } else if (dur >= 60) {
    let min = 0;
    for (min = 0; min < dur; min += 60) min++;
    if (min < 10) min = `0${min}`;

    let sec = dur - min * 60;
    if (sec < 10) sec = `0${sec}`;

    return `${min}:${sec}`;
  } else {
    let sec = Math.round(dur);

    if (sec < 10) sec = `0${sec}`;

    return `00:${sec}`;
  }
};

const Seeker = (events) => {
  if (Video.value) {
    const seek = window.getComputedStyle(seeker.value);
    const pSeek = window.getComputedStyle(pProgress.value);
    const tSeekWidth = parseFloat(
      window.getComputedStyle(tProgress.value).width
    );
    const vBlockWidth = parseFloat(
      window.getComputedStyle(videoBlock.value).width
    );
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
    console.log(minPProgress.value);
    const dur = ((seekWidth * duration.value) / 100).toFixed(2);
    Video.value.currentTime = dur;
    //currentDuration.value = Video.value.currentTime;
  }
};
</script>

<style scoped>
.videoSeeker {
  width: 0%;
}
</style>
