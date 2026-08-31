
document.querySelectorAll('.audio-widget').forEach(widget=>{
 const audio=widget.querySelector('audio'), btn=widget.querySelector('.play'),
 current=widget.querySelector('.current'), duration=widget.querySelector('.duration'),
 seek=widget.querySelector('.seek');
 const fmt=s=>{if(!isFinite(s))return "00:00"; const m=Math.floor(s/60),x=Math.floor(s%60);return `${String(m).padStart(2,"0")}:${String(x).padStart(2,"0")}`};
 audio.addEventListener('loadedmetadata',()=>{duration.textContent=fmt(audio.duration);seek.max=audio.duration||0});
 audio.addEventListener('timeupdate',()=>{current.textContent=fmt(audio.currentTime);seek.value=audio.currentTime||0});
 audio.addEventListener('ended',()=>btn.classList.remove('is-playing'));
 btn.addEventListener('click',async()=>{if(audio.paused){await audio.play();btn.classList.add('is-playing')}else{audio.pause();btn.classList.remove('is-playing')}});
 seek.addEventListener('input',()=>audio.currentTime=Number(seek.value));
});
