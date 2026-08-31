
document.addEventListener("DOMContentLoaded", () => {
  const audio = document.querySelector("audio");
  const play = document.querySelector(".play");
  const seek = document.querySelector(".seek");
  const current = document.querySelector(".current");
  const duration = document.querySelector(".duration");
  if (!audio || !play) return;

  const fmt = s => {
    if (!Number.isFinite(s)) return "00:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return String(m).padStart(2,"0") + ":" + String(sec).padStart(2,"0");
  };

  audio.addEventListener("loadedmetadata", () => {
    duration.textContent = fmt(audio.duration);
    seek.max = audio.duration || 0;
  });
  audio.addEventListener("timeupdate", () => {
    current.textContent = fmt(audio.currentTime);
    seek.value = audio.currentTime;
  });
  audio.addEventListener("ended", () => play.classList.remove("pause"));
  play.addEventListener("click", () => {
    if (audio.paused) { audio.play(); play.classList.add("pause"); }
    else { audio.pause(); play.classList.remove("pause"); }
  });
  seek.addEventListener("input", () => audio.currentTime = Number(seek.value));
});
