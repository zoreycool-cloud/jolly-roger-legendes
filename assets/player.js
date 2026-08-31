
document.addEventListener("DOMContentLoaded",()=>{
 const audio=document.querySelector("audio"),play=document.querySelector(".play"),
 seek=document.querySelector(".seek"),cur=document.querySelector(".current"),
 dur=document.querySelector(".duration");
 if(!audio||!play)return;
 const fmt=s=>!Number.isFinite(s)?"00:00":
   String(Math.floor(s/60)).padStart(2,"0")+":"+String(Math.floor(s%60)).padStart(2,"0");
 audio.addEventListener("loadedmetadata",()=>{dur.textContent=fmt(audio.duration);seek.max=audio.duration||0});
 audio.addEventListener("timeupdate",()=>{cur.textContent=fmt(audio.currentTime);seek.value=audio.currentTime});
 audio.addEventListener("ended",()=>play.classList.remove("pause"));
 play.addEventListener("click",()=>{
   if(audio.paused){audio.play();play.classList.add("pause")}
   else{audio.pause();play.classList.remove("pause")}
 });
 seek.addEventListener("input",()=>audio.currentTime=Number(seek.value));
});
