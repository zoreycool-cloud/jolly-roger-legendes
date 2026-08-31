(()=>{
  const root=document.getElementById('jrBattleApp');
  if(!root)return;
  const qs=(s,p=root)=>p.querySelector(s), qsa=(s,p=root)=>[...p.querySelectorAll(s)];
  const state={name:'HUGO',pirates:4,piratesMax:8,defenses:1,defensesMax:4,boulets:3,bouletsMax:3,bonus:[],malus:[],journal:[{t:'20:42',txt:'Partie créée — code KRAKEN-72'}]};
  const cards={
    bonus:[
      ['NAUFRAGÉ','bonus-naufrage.jpg','immediate','pirates',1],
      ['VIEUX RADEAU','bonus-vieux-radeau.jpg','immediate','defenses',1],
      ['ÉPAVE DE BATEAU PIRATE','bonus-epave-bateau-pirate.jpg','dual','defenses',1],
      ['SERVICE RENDU','bonus-service-rendu.jpg','store'],
      ['GROS BUTIN','bonus-gros-butin.jpg','store'],
      ['TALISMAN DE CHANCE','bonus-talisman-chance.jpg','store'],
      ['ÉQUIPAGE SOUDÉ','bonus-equipage-soude.jpg','store'],
      ['MALICE DE LA MOUETTE','bonus-malice-mouette.jpg','store']
    ],
    malus:[
      ['RÉCIFS','malus-recifs.jpg','immediate','defenses',-1],
      ['SERPENT DE MER','malus-serpent-de-mer.jpg','serpent'],
      ['MUTINERIE','malus-mutinerie.jpg','immediate','pirates',-2],
      ['ROUILLE','malus-rouille.jpg','active'],
      ['VENT CONTRAIRE','malus-vent-contraire.jpg','active'],
      ['SCORBUT','malus-scorbut.jpg','active'],
      ['MALÉDICTION DU CRÂNE','malus-malediction-crane.jpg','active']
    ]
  };
  const opponents=[['CHARLES','5 / 8','3 / 4','2 / 3','2'],['MATHIS','6 / 8','2 / 4','1 / 3','1'],['QUENTIN','4 / 8','0 / 4','3 / 3','2']];
  function showScreen(name){qsa('.jr-screen').forEach(x=>x.classList.toggle('is-active',x.dataset.screen===name));window.scrollTo({top:0,behavior:'smooth'});}
  qsa('[data-go]').forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.go)));
  qs('#hostName').addEventListener('input',e=>{qs('#hostPreview').textContent=(e.target.value||'HUGO').toUpperCase()});
  qs('#startGameBtn').addEventListener('click',()=>{state.name=(qs('#hostName').value||'HUGO').trim().toUpperCase();addLog(`${state.name} démarre la partie`);showScreen('game');render();});
  qs('#joinGameBtn').addEventListener('click',()=>{const code=qs('#joinCode').value.trim(),name=qs('#joinName').value.trim();if(!code||!name){qs('#joinValidation').textContent='INDIQUEZ UN CODE ET VOTRE NOM.';return;} state.name=name.toUpperCase();addLog(`${state.name} rejoint la partie ${code.toUpperCase()}`);showScreen('game');render();});
  function addLog(txt){const now=new Date();state.journal.unshift({t:String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0'),txt});}
  function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
  function render(){
    qs('#piratesCount').textContent=`${state.pirates} / ${state.piratesMax}`;qs('#defensesCount').textContent=`${state.defenses} / ${state.defensesMax}`;qs('#bouletsCount').textContent=`${state.boulets} / ${state.bouletsMax}`;qs('#bonusCount').textContent=`${state.bonus.length} / 4`;
    qs('#piratesVisual').innerHTML='<i></i>'.repeat(state.pirates);qs('#defensesVisual').innerHTML='<i></i>'.repeat(state.defenses);qs('#cannonballsVisual').innerHTML='<i></i>'.repeat(state.boulets);
  }
  const sheet=qs('#jrSheet'),title=qs('#sheetTitle'),content=qs('#sheetContent');
  function openSheet(kind){sheet.hidden=false;document.body.style.overflow='hidden';renderPanel(kind);}
  function closeSheet(){sheet.hidden=true;document.body.style.overflow='';}
  qsa('[data-close-sheet]').forEach(x=>x.addEventListener('click',closeSheet));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!sheet.hidden)closeSheet();});
  qsa('[data-panel]').forEach(b=>b.addEventListener('click',()=>openSheet(b.dataset.panel)));
  function renderPanel(kind){
    if(kind==='actions')return actionsPanel();
    if(kind==='opponents')return opponentsPanel();
    if(kind==='journal')return journalPanel();
    if(kind==='cards')return cardsPanel();
    if(kind==='ship')return shipPanel();
    if(kind==='event')return eventPanel('bonus');
  }
  function actionsPanel(){title.textContent='QUE VIENT-IL DE SE PASSER ?';content.innerHTML=`<div class="jr-action-grid"><button data-act="event"><span>▱</span>CARTE ÉVÉNEMENT</button><button data-act="battle"><span>⚔</span>BATAILLE NAVALE</button><button data-act="port"><span>⚓</span>ENTRER DANS UN PORT</button><button data-act="legend"><span>☠</span>DANGER / LÉGENDE</button><button data-act="trade"><span>⇄</span>ÉCHANGE / TRANSFERT</button><button data-act="other"><span>•••</span>AUTRE</button></div>`;
    qsa('[data-act]',content).forEach(b=>b.addEventListener('click',()=>{if(b.dataset.act==='event')eventPanel('bonus');else infoPanel(b.textContent.trim());}));
  }
  function infoPanel(name){title.textContent=name;content.innerHTML=`<p class="jr-lead" style="margin:24px auto">Cette action est déjà prévue dans l’architecture du moteur interactif. Elle sera activée dans l’étape suivante.</p><button class="jr-secondary" type="button" data-back-actions>RETOUR AUX ACTIONS</button>`;qs('[data-back-actions]',content).addEventListener('click',actionsPanel);}
  function eventPanel(tab){title.textContent='CARTE ÉVÉNEMENT';let selected=null;content.innerHTML=`<div class="jr-tabs"><button class="${tab==='bonus'?'is-active':''}" data-tab="bonus">BONUS</button><button class="${tab==='malus'?'is-active':''}" data-tab="malus">MALUS</button></div><div class="jr-card-strip" id="eventCards"></div><p class="jr-card-name" id="eventCardName">SÉLECTIONNEZ LA CARTE PIOCHÉE</p><div class="jr-apply-row"><button class="jr-primary" id="applyEvent" disabled>APPLIQUER</button><button class="jr-secondary" type="button" id="backActions">RETOUR</button></div>`;
    qsa('[data-tab]',content).forEach(b=>b.addEventListener('click',()=>eventPanel(b.dataset.tab)));
    const strip=qs('#eventCards',content);cards[tab].forEach((c,i)=>{const btn=document.createElement('button');btn.type='button';btn.className='jr-card-choice';btn.innerHTML=`<img src="../assets/cards/${c[1]}" alt="${c[0]}" loading="lazy">`;btn.addEventListener('click',()=>{qsa('.jr-card-choice',strip).forEach(x=>x.classList.remove('is-selected'));btn.classList.add('is-selected');selected=i;qs('#eventCardName',content).textContent=c[0];qs('#applyEvent',content).disabled=false;});strip.appendChild(btn);});
    qs('#backActions',content).addEventListener('click',actionsPanel);
    qs('#applyEvent',content).addEventListener('click',()=>{if(selected===null)return;applyCard(tab,cards[tab][selected]);});
  }
  function applyCard(type,c){const [name,,mode,res,val]=c;let result='';
    if(type==='bonus'){
      if(mode==='store'){if(state.bonus.length>=4){result='MAIN DE BONUS PLEINE — aucun ajout effectué.';}else{state.bonus.push(name);result=`${name} ajouté à vos Bonus secrets.`;addLog(`${state.name} pioche un Bonus — ${state.bonus.length} Bonus en main`);}}
      else if(mode==='immediate'){const before=state[res],max=state[res+'Max'];state[res]=clamp(before+val,0,max);result=`${res==='pirates'?'Pirates':'Défenses'} : ${before} → ${state[res]}`;addLog(`${state.name} applique un Bonus : ${name}`);}
      else if(mode==='dual'){const d=state.defenses,b=state.boulets;state.defenses=clamp(d+1,0,state.defensesMax);state.boulets=clamp(b+1,0,state.bouletsMax);result=`Défenses ${d} → ${state.defenses} · Boulets ${b} → ${state.boulets}`;addLog(`${state.name} applique un Bonus : ${name}`);}
    }else{
      if(mode==='immediate'){const before=state[res];state[res]=clamp(before+val,0,state[res+'Max']);result=`${res==='pirates'?'Pirates':'Défenses'} : ${before} → ${state[res]}`;addLog(`${state.name} pioche le Malus ${name} — ${result}`);}
      else if(mode==='serpent'){const d=state.defenses,p=state.pirates;state.defenses=clamp(d-1,0,state.defensesMax);state.pirates=clamp(p-1,0,state.piratesMax);result=`Défenses ${d} → ${state.defenses} · Pirates ${p} → ${state.pirates}`;addLog(`${state.name} pioche le Malus ${name} — ${result}`);}
      else {state.malus.push(name);result=`${name} est désormais un effet actif public.`;addLog(`${state.name} pioche le Malus ${name}`);}
    }
    render();title.textContent='ACTION APPLIQUÉE';content.innerHTML=`<div class="jr-event-result"><strong>${name}</strong><span>${result}</span></div><button class="jr-primary" type="button" id="doneEvent">TERMINER</button>`;qs('#doneEvent',content).addEventListener('click',closeSheet);
  }
  function opponentsPanel(){title.textContent='ADVERSAIRES — ÉTAT PUBLIC';content.innerHTML='<div class="jr-list">'+opponents.map(o=>`<div class="jr-list-row"><div><strong>${o[0]}</strong><small>☠ ${o[1]} · ◇ ${o[2]} · ● ${o[3]}</small></div><em>${o[4]} BONUS</em></div>`).join('')+'</div><p class="jr-note">Les Malus, Lieutenants, Améliorations, Combinaisons et Légendes seront visibles ici. L’identité des Bonus reste privée.</p>';}
  function journalPanel(){title.textContent='JOURNAL DE PARTIE';content.innerHTML='<ul class="jr-journal">'+state.journal.map(x=>`<li><time>${x.t}</time><span>${x.txt}</span></li>`).join('')+'</ul>';}
  function cardsPanel(){title.textContent='MES CARTES';const bonus=state.bonus.length?state.bonus.map(name=>{const c=cards.bonus.find(x=>x[0]===name);return `<div class="jr-private-card"><img src="../assets/cards/${c[1]}" alt="${name}"><div><strong>${name}</strong><small>BONUS SECRET · visible uniquement par vous</small></div></div>`}).join(''):'<p class="jr-lead" style="margin:24px auto">Aucun Bonus secret en main.</p>';const malus=state.malus.length?'<h3 style="color:var(--sand);font-weight:500">MALUS ACTIFS — PUBLICS</h3>'+state.malus.map(x=>`<div class="jr-list-row"><strong>${x}</strong><em>ACTIF</em></div>`).join(''):'';content.innerHTML=bonus+malus;}
  function shipPanel(){title.textContent='ÉTAT DU NAVIRE';content.innerHTML=`<div class="jr-list"><div class="jr-list-row"><strong>PIRATES</strong><em>${state.pirates} / ${state.piratesMax}</em></div><div class="jr-list-row"><strong>DÉFENSES</strong><em>${state.defenses} / ${state.defensesMax}</em></div><div class="jr-list-row"><strong>BOULETS</strong><em>${state.boulets} / ${state.bouletsMax}</em></div><div class="jr-list-row"><strong>BONUS</strong><em>${state.bonus.length} / 4</em></div><div class="jr-list-row"><strong>MALUS ACTIFS</strong><em>${state.malus.length}</em></div></div><p class="jr-note">Le navire illustré se met à jour en même temps que ces valeurs.</p>`;}
  render();
})();
