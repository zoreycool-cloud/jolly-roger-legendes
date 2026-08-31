
document.addEventListener("DOMContentLoaded",()=>{
  const audio=document.querySelector("audio");
  const play=document.querySelector(".play");
  const seek=document.querySelector(".seek");
  const cur=document.querySelector(".current");
  const dur=document.querySelector(".duration");
  if(!audio||!play||!seek)return;

  const fmt=(s)=>{
    if(!Number.isFinite(s)) return "00:00";
    return String(Math.floor(s/60)).padStart(2,"0")+":"+String(Math.floor(s%60)).padStart(2,"0");
  };

  const syncButton=()=>{
    play.dataset.state=audio.paused ? "play" : "pause";
    play.setAttribute("aria-label",audio.paused ? "Lire" : "Mettre en pause");
  };

  audio.addEventListener("loadedmetadata",()=>{
    dur.textContent=fmt(audio.duration);
    seek.max=audio.duration||0;
  });
  audio.addEventListener("timeupdate",()=>{
    cur.textContent=fmt(audio.currentTime);
    seek.value=audio.currentTime;
  });
  audio.addEventListener("play",syncButton);
  audio.addEventListener("pause",syncButton);
  audio.addEventListener("ended",syncButton);

  play.addEventListener("click",()=>{
    if(audio.paused) audio.play();
    else audio.pause();
  });

  seek.addEventListener("input",()=>{
    audio.currentTime=Number(seek.value);
  });

  syncButton();
});
