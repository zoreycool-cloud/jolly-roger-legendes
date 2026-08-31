
document.addEventListener("DOMContentLoaded", () => {
  const audio = document.querySelector("audio");
  const button = document.querySelector(".play-button");
  const seek = document.querySelector(".seek");
  const current = document.querySelector(".current");
  const duration = document.querySelector(".duration");

  if (!audio || !button || !seek || !current || !duration) return;

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return "00:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  const syncButton = () => {
    button.dataset.playing = audio.paused ? "false" : "true";
    button.setAttribute("aria-label", audio.paused ? "Lire" : "Mettre en pause");
  };

  audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
    seek.max = audio.duration || 0;
  });

  audio.addEventListener("timeupdate", () => {
    current.textContent = formatTime(audio.currentTime);
    seek.value = audio.currentTime || 0;
  });

  audio.addEventListener("play", syncButton);
  audio.addEventListener("pause", syncButton);
  audio.addEventListener("ended", syncButton);

  button.addEventListener("click", async () => {
    if (audio.paused) {
      try { await audio.play(); } catch(e) {}
    } else {
      audio.pause();
    }
  });

  seek.addEventListener("input", () => {
    audio.currentTime = Number(seek.value);
  });

  syncButton();
});
