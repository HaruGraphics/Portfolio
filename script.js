// =======================
// ELEMENTS
// =======================
const intro = document.getElementById("intro");
const enterBtn = document.getElementById("enterBtn");

const items = document.querySelectorAll(".item");
const overlay = document.getElementById("overlay");
const closeBtn = document.querySelector(".close");

const bg = document.getElementById("bg");
const wipe = document.getElementById("wipe");

const hoverSound = document.getElementById("hoverSound");
const clickSound = document.getElementById("clickSound");
const closeSound = document.getElementById("closeSound");

const bgMusic = document.getElementById("bgMusic");
const bgmToggle = document.getElementById("bgmToggle");
const bgmVolume = document.getElementById("bgmVolume");

const showreelPreview = document.getElementById("showreelPreview");
const showreelVideo = document.getElementById("showreelVideo");

// =======================
// AUDIO SETUP
// =======================
hoverSound.volume = 0.25;
clickSound.volume = 0.35;
closeSound.volume = 0.35;

const DEFAULT_BGM_VOLUME = 0.12;
bgMusic.volume = DEFAULT_BGM_VOLUME;
bgMusic.loop = true;

let audioUnlocked = false;
let userMutedBGM = false;

// =======================
// WIPE HELPERS
// =======================
function wipeIn(callback) {
  wipe.style.transition = "none";
  wipe.style.left = "-120%";

  requestAnimationFrame(() => {
    wipe.style.transition = "left 0.45s ease-in-out";
    wipe.style.left = "120%";
  });

  setTimeout(() => {
    if (callback) callback();
  }, 450);
}

function wipeOut() {
  wipe.style.transition = "none";
  wipe.style.left = "120%";

  requestAnimationFrame(() => {
    wipe.style.transition = "left 0.45s ease-in-out";
    wipe.style.left = "-120%";
  });
}

// =======================
// INTRO ENTER
// =======================
enterBtn.addEventListener("click", () => {
  hoverSound.play().then(() => {
    hoverSound.pause();
    hoverSound.currentTime = 0;
  });

  clickSound.play().then(() => {
    clickSound.pause();
    clickSound.currentTime = 0;
  });

  audioUnlocked = true;

  if (!userMutedBGM) {
    bgMusic.play().catch(() => {});
  }

  intro.classList.add("hide");
  setTimeout(() => {
    intro.style.display = "none";
  }, 800);
});

// =======================
// MENU INTERACTIONS
// =======================
items.forEach(item => {

  item.addEventListener("mouseenter", () => {
    if (!audioUnlocked) return;
    hoverSound.currentTime = 0;
    hoverSound.play();
  });

  item.addEventListener("click", () => {
    if (!audioUnlocked) return;

    clickSound.currentTime = 0;
    clickSound.play();

    const section = item.dataset.section;

    wipeIn(() => {
      bg.style.backgroundImage = `url("bg/${section}.jpg")`;
      overlay.classList.add("active");

      if (section === "showreel") {
        showreelVideo.pause();
        showreelVideo.currentTime = 0;
      }
    });
  });
});

// =======================
// VIDEO ↔ BGM LOGIC
// =======================
showreelVideo.addEventListener("play", () => {
  bgMusic.muted = true;
});

showreelVideo.addEventListener("pause", () => {
  if (!userMutedBGM) {
    bgMusic.muted = false;
    bgMusic.volume = DEFAULT_BGM_VOLUME;
  }
});

showreelVideo.addEventListener("ended", () => {
  if (!userMutedBGM) {
    bgMusic.muted = false;
    bgMusic.volume = DEFAULT_BGM_VOLUME;
  }
});

// =======================
// CLOSE OVERLAY
// =======================
closeBtn.addEventListener("click", () => {

  closeSound.currentTime = 0;
  closeSound.play().catch(() => {});

  overlay.classList.remove("active");

  wipeOut();

  showreelVideo.pause();
  showreelVideo.currentTime = 0;

  bg.style.backgroundImage = 'url("bg/default.jpg")';

  if (!userMutedBGM) {
    bgMusic.muted = false;
    bgMusic.volume = DEFAULT_BGM_VOLUME;
  }
});

// =======================
// BGM CONTROLS
// =======================
bgmToggle.addEventListener("click", () => {
  userMutedBGM = !userMutedBGM;

  bgMusic.muted = userMutedBGM;
  bgmToggle.classList.toggle("muted", userMutedBGM);

  if (!userMutedBGM) {
    bgMusic.volume = DEFAULT_BGM_VOLUME;
    bgMusic.play().catch(() => {});
  }
});

bgmVolume.addEventListener("input", (e) => {
  const vol = parseFloat(e.target.value);
  bgMusic.volume = vol;

  if (vol === 0) {
    userMutedBGM = true;
    bgMusic.muted = true;
    bgmToggle.classList.add("muted");
  } else {
    userMutedBGM = false;
    bgMusic.muted = false;
    bgmToggle.classList.remove("muted");
  }
});

// =======================
// SHOWREEL PREVIEW (HOVER)
// =======================
const showreelItem = document.querySelector('.item[data-section="showreel"]');

showreelItem.addEventListener("mouseenter", () => {
  showreelPreview.classList.add("active");
  showreelPreview.currentTime = 0;
  showreelPreview.play().catch(() => {});
});

showreelItem.addEventListener("mouseleave", () => {
  showreelPreview.pause();
  showreelPreview.classList.remove("active");
});
