(()=>{
  const root=document.getElementById('jrBattleApp');
  if(!root)return;
  const qs=(s,p=root)=>p.querySelector(s), qsa=(s,p=root)=>[...p.querySelectorAll(s)];

  const legendCatalog=[
    {id:'wako',name:'LARME DU WAKŌ',entity:'LE WAKŌ',invocation:'LARME DU WAKŌ',img:'invocation-larme-du-wako.jpg'},
    {id:'diable',name:'MURMURE DU DIABLE',entity:'LE DIABLE',invocation:'MURMURE DU DIABLE',img:'invocation-murmure-du-diable.jpg'},
    {id:'calypso',name:'BAISER DE CALYPSO',entity:'CALYPSO',invocation:'BAISER DE CALYPSO',img:'invocation-baiser-de-calypso.jpg'},
    {id:'sirenes',name:'SANG DES SIRÈNES',entity:'LES SIRÈNES',invocation:'SANG DES SIRÈNES',img:'invocation-sang-des-sirenes.jpg'},
    {id:'kraken',name:'L’ENCRE DU KRAKEN',entity:'LE KRAKEN',invocation:'L’ENCRE DU KRAKEN',img:'invocation-encre-du-kraken.jpg'}
  ];

  const state={
    name:'HUGO',pirates:4,piratesMax:8,defenses:1,defensesMax:4,boulets:3,bouletsMax:3,
    bonus:[],malus:[],legends:[],journal:[{t:'20:42',txt:'Partie créée — code KRAKEN-72'}]
  };

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

  const opponents=[
    {name:'CHARLES',pirates:5,piratesMax:8,defenses:3,defensesMax:4,boulets:2,bouletsMax:3,bonus:2,malus:['ROUILLE'],legends:[{id:'kraken',used:false}]},
    {name:'MATHIS',pirates:6,piratesMax:8,defenses:2,defensesMax:4,boulets:1,bouletsMax:3,bonus:1,malus:[],legends:[{id:'wako',used:true}]},
    {name:'QUENTIN',pirates:4,piratesMax:8,defenses:0,defensesMax:4,boulets:3,bouletsMax:3,bonus:2,malus:[],legends:[]}
  ];

  function showScreen(name){qsa('.jr-screen').forEach(x=>x.classList.toggle('is-active',x.dataset.screen===name));window.scrollTo({top:0,behavior:'smooth'});}
  qsa('[data-go]').forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.go)));
  qs('#hostName').addEventListener('input',e=>{qs('#hostPreview').textContent=(e.target.value||'HUGO').toUpperCase()});
  qs('#startGameBtn').addEventListener('click',()=>{state.name=(qs('#hostName').value||'HUGO').trim().toUpperCase();addLog(`${state.name} démarre la partie`);showScreen('game');render();});
  qs('#joinGameBtn').addEventListener('click',()=>{const code=qs('#joinCode').value.trim(),name=qs('#joinName').value.trim();if(!code||!name){qs('#joinValidation').textContent='INDIQUEZ UN CODE ET VOTRE NOM.';return;}state.name=name.toUpperCase();addLog(`${state.name} rejoint la partie ${code.toUpperCase()}`);showScreen('game');render();});

  function addLog(txt){const now=new Date();state.journal.unshift({t:String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0'),txt});}
  function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
  function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  function legendById(id){return legendCatalog.find(x=>x.id===id);}
  function cardByName(name){return cards.bonus.find(x=>x[0]===name);}

  function render(){
    qs('#piratesCount').textContent=`${state.pirates} / ${state.piratesMax}`;
    qs('#defensesCount').textContent=`${state.defenses} / ${state.defensesMax}`;
    qs('#bouletsCount').textContent=`${state.boulets} / ${state.bouletsMax}`;
    qs('#bonusCount').textContent=`${state.bonus.length} / 4`;
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

  function actionsPanel(){
    title.textContent='QUE VIENT-IL DE SE PASSER ?';
    content.innerHTML=`<div class="jr-action-grid">
      <button data-act="event"><span>▱</span>CARTE ÉVÉNEMENT</button>
      <button data-act="battle"><span>⚔</span>BATAILLE NAVALE</button>
      <button data-act="port"><span>⚓</span>ENTRER DANS UN PORT</button>
      <button data-act="legend"><span>◇</span>DANGER / LÉGENDE</button>
      <button data-act="trade"><span>⇄</span>ÉCHANGE / TRANSFERT</button>
      <button data-act="other"><span>•••</span>AUTRE</button>
    </div>`;
    qsa('[data-act]',content).forEach(b=>b.addEventListener('click',()=>{
      const act=b.dataset.act;
      if(act==='event')eventPanel('bonus');
      else if(act==='battle')battlePanel();
      else if(act==='port')portPanel();
      else if(act==='legend')legendPanel();
      else if(act==='trade')tradePanel();
      else infoPanel('AUTRE ACTION');
    }));
  }

  function infoPanel(name){
    title.textContent=name;
    content.innerHTML=`<p class="jr-lead" style="margin:24px auto">Cette catégorie reste volontairement libre pour les cas qui ne sont pas encore automatisés.</p><button class="jr-secondary" type="button" data-back-actions>RETOUR AUX ACTIONS</button>`;
    qs('[data-back-actions]',content).addEventListener('click',actionsPanel);
  }

  function eventPanel(tab){
    title.textContent='CARTE ÉVÉNEMENT';let selected=null;
    content.innerHTML=`<div class="jr-tabs"><button class="${tab==='bonus'?'is-active':''}" data-tab="bonus">BONUS</button><button class="${tab==='malus'?'is-active':''}" data-tab="malus">MALUS</button></div><div class="jr-card-strip" id="eventCards"></div><p class="jr-card-name" id="eventCardName">SÉLECTIONNEZ LA CARTE PIOCHÉE</p><div class="jr-apply-row"><button class="jr-primary" id="applyEvent" disabled>APPLIQUER</button><button class="jr-secondary" type="button" id="backActions">RETOUR</button></div>`;
    qsa('[data-tab]',content).forEach(b=>b.addEventListener('click',()=>eventPanel(b.dataset.tab)));
    const strip=qs('#eventCards',content);
    cards[tab].forEach((c,i)=>{const btn=document.createElement('button');btn.type='button';btn.className='jr-card-choice';btn.innerHTML=`<img src="../assets/cards/${c[1]}" alt="${esc(c[0])}" loading="lazy">`;btn.addEventListener('click',()=>{qsa('.jr-card-choice',strip).forEach(x=>x.classList.remove('is-selected'));btn.classList.add('is-selected');selected=i;qs('#eventCardName',content).textContent=c[0];qs('#applyEvent',content).disabled=false;});strip.appendChild(btn);});
    qs('#backActions',content).addEventListener('click',actionsPanel);
    qs('#applyEvent',content).addEventListener('click',()=>{if(selected===null)return;applyCard(tab,cards[tab][selected]);});
  }

  function applyCard(type,c){
    const [name,,mode,res,val]=c;let result='';
    if(type==='bonus'){
      if(mode==='store'){
        if(state.bonus.length>=4){return bonusReplacementPanel(c);}
        state.bonus.push(name);result=`${name} ajouté à vos Bonus secrets.`;addLog(`${state.name} pioche un Bonus — ${state.bonus.length} Bonus en main`);
      }else if(mode==='immediate'){
        const before=state[res],max=state[res+'Max'];state[res]=clamp(before+val,0,max);result=`${res==='pirates'?'Pirates':'Défenses'} : ${before} → ${state[res]}`;addLog(`${state.name} applique un Bonus : ${name}`);
      }else if(mode==='dual'){
        const d=state.defenses,b=state.boulets;state.defenses=clamp(d+1,0,state.defensesMax);state.boulets=clamp(b+1,0,state.bouletsMax);result=`Défenses ${d} → ${state.defenses} · Boulets ${b} → ${state.boulets}`;addLog(`${state.name} applique un Bonus : ${name}`);
      }
    }else{
      if(mode==='immediate'){
        const before=state[res];state[res]=clamp(before+val,0,state[res+'Max']);result=`${res==='pirates'?'Pirates':'Défenses'} : ${before} → ${state[res]}`;addLog(`${state.name} pioche le Malus ${name} — ${result}`);
      }else if(mode==='serpent'){
        const d=state.defenses,p=state.pirates;state.defenses=clamp(d-1,0,state.defensesMax);state.pirates=clamp(p-1,0,state.piratesMax);result=`Défenses ${d} → ${state.defenses} · Pirates ${p} → ${state.pirates}`;addLog(`${state.name} pioche le Malus ${name} — ${result}`);
      }else{
        state.malus.push(name);result=`${name} est désormais un effet actif public.`;addLog(`${state.name} pioche le Malus ${name}`);
      }
    }
    render();actionResult(name,result);
  }

  function bonusReplacementPanel(newCard){
    const [newName,newImg]=newCard;
    title.textContent='MAIN DE BONUS COMPLÈTE';
    content.innerHTML=`<p class="jr-lead">Vous avez déjà 4 Bonus. Vous pouvez défausser le nouveau Bonus ou remplacer l’un de vos Bonus actuels.</p>
      <div class="jr-new-bonus"><small>NOUVEAU BONUS</small><div class="jr-private-card"><img src="../assets/cards/${newImg}" alt="${esc(newName)}"><div><strong>${esc(newName)}</strong><small>RESTE SECRET POUR LES ADVERSAIRES</small></div></div></div>
      <p class="jr-card-name">REMPLACER QUEL BONUS ?</p><div class="jr-replace-list" id="replaceList"></div>
      <button class="jr-secondary" type="button" id="discardNewBonus">DÉFAUSSER LE NOUVEAU BONUS</button>`;
    const list=qs('#replaceList',content);
    state.bonus.forEach((oldName,index)=>{
      const oldCard=cardByName(oldName);const btn=document.createElement('button');btn.type='button';btn.className='jr-replace-choice';btn.innerHTML=`<img src="../assets/cards/${oldCard?oldCard[1]:'bonus-vieux-radeau.jpg'}" alt="${esc(oldName)}"><span><strong>${esc(oldName)}</strong><small>REMPLACER PAR ${esc(newName)}</small></span>`;
      btn.addEventListener('click',()=>{const removed=state.bonus[index];state.bonus[index]=newName;addLog(`${state.name} remplace 1 Bonus — 4 Bonus en main`);render();actionResult('BONUS REMPLACÉ',`${removed} a été défaussé. ${newName} rejoint votre main secrète.`);});list.appendChild(btn);
    });
    qs('#discardNewBonus',content).addEventListener('click',()=>{addLog(`${state.name} défausse le Bonus pioché — 4 Bonus en main`);actionResult('BONUS DÉFAUSSÉ',`${newName} n’a pas été ajouté. Votre main reste à 4 Bonus.`);});
  }

  function actionResult(name,result){
    title.textContent='ACTION APPLIQUÉE';
    content.innerHTML=`<div class="jr-event-result"><strong>${esc(name)}</strong><span>${esc(result)}</span></div><button class="jr-primary" type="button" id="doneEvent">TERMINER</button>`;
    qs('#doneEvent',content).addEventListener('click',closeSheet);
  }

  function portPanel(){
    title.textContent='ENTRER DANS UN PORT';
    const service=state.bonus.includes('SERVICE RENDU');
    const gros=state.bonus.includes('GROS BUTIN');
    let suggestions='';
    if(service||gros){
      suggestions='<div class="jr-context-box"><small>EFFETS DÉTECTÉS</small>';
      if(service)suggestions+='<button type="button" data-port-bonus="SERVICE RENDU">SERVICE RENDU · refaire le plein de Boulets</button>';
      if(gros)suggestions+='<button type="button" data-port-bonus="GROS BUTIN">GROS BUTIN · +2 Boulets et +2 Défenses</button>';
      suggestions+='</div>';
    }
    content.innerHTML=`<p class="jr-lead">Confirmez l’arrivée de votre navire au Port. Le moteur vérifie les effets de votre main qui se déclenchent au Port.</p>${suggestions}<button class="jr-primary" type="button" id="confirmPort">CONFIRMER L’ENTRÉE AU PORT</button><button class="jr-secondary" type="button" id="backActions">RETOUR</button>`;
    qsa('[data-port-bonus]',content).forEach(btn=>btn.addEventListener('click',()=>usePortBonus(btn.dataset.portBonus)));
    qs('#confirmPort',content).addEventListener('click',()=>{addLog(`${state.name} entre dans un Port`);actionResult('PORT','Entrée au Port enregistrée. Les effets applicables restent disponibles jusqu’à leur utilisation.');});
    qs('#backActions',content).addEventListener('click',actionsPanel);
  }

  function usePortBonus(name){
    const idx=state.bonus.indexOf(name);if(idx<0)return;
    let result='';
    if(name==='SERVICE RENDU'){
      const before=state.boulets;state.boulets=state.bouletsMax;result=`Boulets : ${before} → ${state.boulets}`;
    }else if(name==='GROS BUTIN'){
      const b=state.boulets,d=state.defenses;state.boulets=clamp(b+2,0,state.bouletsMax);state.defenses=clamp(d+2,0,state.defensesMax);result=`Boulets ${b} → ${state.boulets} · Défenses ${d} → ${state.defenses}`;
    }
    state.bonus.splice(idx,1);addLog(`${state.name} révèle et utilise ${name} au Port`);render();actionResult(name,result);
  }

  function legendPanel(){
    title.textContent='DANGER / LÉGENDE';
    content.innerHTML=`<p class="jr-lead">Sélectionnez la Légende remportée. Son Invocation est automatiquement liée à la Légende et enregistrée comme disponible.</p><div class="jr-legend-grid" id="legendGrid"></div><button class="jr-secondary" type="button" id="backActions">RETOUR</button>`;
    const grid=qs('#legendGrid',content);
    legendCatalog.forEach(l=>{const owned=state.legends.some(x=>x.id===l.id);const btn=document.createElement('button');btn.type='button';btn.className='jr-legend-choice';btn.disabled=owned;btn.innerHTML=`<img src="../assets/cards/${l.img}" alt="${esc(l.invocation)}"><span><strong>${esc(l.entity)}</strong><small>${owned?'DÉJÀ À BORD':'INVOCATION : '+esc(l.invocation)}</small></span>`;btn.addEventListener('click',()=>gainLegend(l));grid.appendChild(btn);});
    qs('#backActions',content).addEventListener('click',actionsPanel);
  }

  function gainLegend(l){
    if(state.legends.some(x=>x.id===l.id))return;
    state.legends.push({id:l.id,used:false});addLog(`${state.name} remporte la Légende liée à ${l.entity}`);actionResult('LÉGENDE REMPORTÉE',`${l.entity} rejoint votre navire. Invocation disponible : ${l.invocation}.`);
  }

  function tradePanel(){
    title.textContent='ÉCHANGE / TRANSFERT';
    content.innerHTML=`<p class="jr-lead">Prototype local : enregistrez ici un transfert de ressource vers un joueur avec lequel l’échange est autorisé par les règles de votre partie.</p>
      <label class="jr-field">DESTINATAIRE<select id="tradeTarget">${opponents.map((o,i)=>`<option value="${i}">${esc(o.name)}</option>`).join('')}</select></label>
      <label class="jr-field">RESSOURCE<select id="tradeResource"><option value="pirates">PIRATE</option><option value="defenses">DÉFENSE</option><option value="boulets">BOULET</option></select></label>
      <label class="jr-field">QUANTITÉ<select id="tradeAmount"><option>1</option><option>2</option><option>3</option></select></label>
      <button class="jr-primary" type="button" id="confirmTrade">VALIDER LE TRANSFERT</button><button class="jr-secondary" type="button" id="backActions">RETOUR</button><p class="jr-validation" id="tradeValidation"></p>`;
    qs('#confirmTrade',content).addEventListener('click',()=>{
      const target=opponents[Number(qs('#tradeTarget',content).value)],res=qs('#tradeResource',content).value,amount=Number(qs('#tradeAmount',content).value),label=res==='pirates'?'Pirate':res==='defenses'?'Défense':'Boulet';
      if(state[res]<amount){qs('#tradeValidation',content).textContent=`RESSOURCE INSUFFISANTE : ${state[res]} DISPONIBLE(S).`;return;}
      const maxKey=res+'Max';if(target[res]+amount>target[maxKey]){qs('#tradeValidation',content).textContent=`CAPACITÉ DE ${target.name} DÉPASSÉE.`;return;}
      state[res]-=amount;target[res]+=amount;addLog(`${state.name} transfère ${amount} ${label}${amount>1?'s':''} à ${target.name}`);render();actionResult('TRANSFERT ENREGISTRÉ',`${amount} ${label}${amount>1?'s':''} transféré${amount>1?'s':''} à ${target.name}.`);
    });
    qs('#backActions',content).addEventListener('click',actionsPanel);
  }

  function battlePanel(){
    title.textContent='BATAILLE NAVALE';
    content.innerHTML=`<p class="jr-lead">Choisissez le navire adverse. Ce prototype active déjà la résolution de base des tirs ; les pouvoirs, Bonus/Malus et priorités avancées seront branchés progressivement au moteur.</p><div class="jr-list" id="battleTargets">${opponents.map((o,i)=>`<button class="jr-target-row" type="button" data-target="${i}"><span><strong>${esc(o.name)}</strong><small>☠ ${o.pirates}/${o.piratesMax} · ◇ ${o.defenses}/${o.defensesMax} · ● ${o.boulets}/${o.bouletsMax}</small></span><em>COMBATTRE</em></button>`).join('')}</div><button class="jr-secondary" type="button" id="backActions">RETOUR</button>`;
    qsa('[data-target]',content).forEach(btn=>btn.addEventListener('click',()=>battleRound(Number(btn.dataset.target),true)));
    qs('#backActions',content).addEventListener('click',actionsPanel);
  }

  function battleRound(index,myTurn){
    const foe=opponents[index];title.textContent=`BATAILLE — ${state.name} VS ${foe.name}`;
    const shooter=myTurn?state:foe,target=myTurn?foe:state;
    const shooterName=myTurn?state.name:foe.name;
    content.innerHTML=`<div class="jr-duel"><div><small>${esc(state.name)}</small><strong>◇ ${state.defenses}/${state.defensesMax} · ● ${state.boulets}/${state.bouletsMax}</strong></div><span>VS</span><div><small>${esc(foe.name)}</small><strong>◇ ${foe.defenses}/${foe.defensesMax} · ● ${foe.boulets}/${foe.bouletsMax}</strong></div></div><p class="jr-card-name">TIR DE ${esc(shooterName)}</p><p class="jr-note">Indiquez le résultat du dé physique.</p><div class="jr-dice-grid">${[1,2,3,4,5,6].map(n=>`<button type="button" data-die="${n}" ${shooter.boulets<=0?'disabled':''}>${n}</button>`).join('')}</div>${shooter.boulets<=0?'<p class="jr-validation">AUCUN BOULET DISPONIBLE POUR CE TIR.</p>':''}<button class="jr-secondary" type="button" id="endBattle">TERMINER LA BATAILLE</button>`;
    qsa('[data-die]',content).forEach(btn=>btn.addEventListener('click',()=>resolveShot(index,myTurn,Number(btn.dataset.die))));
    qs('#endBattle',content).addEventListener('click',()=>{addLog(`Bataille ${state.name} / ${foe.name} terminée dans le prototype`);closeSheet();});
  }

  function resolveShot(index,myTurn,die){
    const foe=opponents[index],shooter=myTurn?state:foe,target=myTurn?foe:state,shooterName=myTurn?state.name:foe.name,targetName=myTurn?foe.name:state.name;
    if(shooter.boulets<=0)return;
    shooter.boulets=clamp(shooter.boulets-1,0,shooter.bouletsMax);const hit=die>=3;const before=target.defenses;if(hit)target.defenses=clamp(target.defenses-1,0,target.defensesMax);
    addLog(`${shooterName} tire (${die}) — ${hit?'touché':'raté'}${hit?` · Défense ${targetName} ${before} → ${target.defenses}`:''}`);render();
    if(target.defenses<=0){title.textContent='BATAILLE TERMINÉE';content.innerHTML=`<div class="jr-event-result"><strong>${esc(shooterName)} REMPORTE LA BATAILLE</strong><span>${esc(targetName)} n’a plus de Défense.</span></div><button class="jr-primary" type="button" id="doneBattle">TERMINER</button>`;qs('#doneBattle',content).addEventListener('click',closeSheet);return;}
    battleRound(index,!myTurn);
  }

  function opponentsPanel(){
    title.textContent='ADVERSAIRES — ÉTAT PUBLIC';
    content.innerHTML='<div class="jr-list">'+opponents.map((o,i)=>`<button class="jr-target-row" type="button" data-opponent="${i}"><span><strong>${esc(o.name)}</strong><small>☠ ${o.pirates}/${o.piratesMax} · ◇ ${o.defenses}/${o.defensesMax} · ● ${o.boulets}/${o.bouletsMax}</small></span><em>${o.bonus} BONUS · ${o.legends.length} LÉGENDE${o.legends.length>1?'S':''}</em></button>`).join('')+'</div><p class="jr-note">Touchez un adversaire pour consulter ses informations publiques. L’identité des Bonus reste privée.</p>';
    qsa('[data-opponent]',content).forEach(btn=>btn.addEventListener('click',()=>opponentDetail(Number(btn.dataset.opponent))));
  }

  function opponentDetail(index){
    const o=opponents[index];title.textContent=`${o.name} — ÉTAT PUBLIC`;
    const legends=o.legends.length?o.legends.map(x=>{const l=legendById(x.id);return `<div class="jr-list-row"><div><strong>${esc(l.entity)}</strong><small>INVOCATION : ${esc(l.invocation)}</small></div><em>${x.used?'UTILISÉE':'DISPONIBLE'}</em></div>`;}).join(''):'<p class="jr-note">Aucune Légende à bord.</p>';
    const malus=o.malus.length?o.malus.map(x=>`<div class="jr-list-row"><strong>${esc(x)}</strong><em>PUBLIC</em></div>`).join(''):'<p class="jr-note">Aucun Malus actif.</p>';
    content.innerHTML=`<div class="jr-list"><div class="jr-list-row"><strong>PIRATES</strong><em>${o.pirates} / ${o.piratesMax}</em></div><div class="jr-list-row"><strong>DÉFENSES</strong><em>${o.defenses} / ${o.defensesMax}</em></div><div class="jr-list-row"><strong>BOULETS</strong><em>${o.boulets} / ${o.bouletsMax}</em></div><div class="jr-list-row"><strong>BONUS EN MAIN</strong><em>${o.bonus}</em></div></div><h3 class="jr-subhead">LÉGENDES & INVOCATIONS</h3>${legends}<h3 class="jr-subhead">MALUS ACTIFS</h3>${malus}<button class="jr-secondary" type="button" id="backOpponents">RETOUR AUX ADVERSAIRES</button>`;
    qs('#backOpponents',content).addEventListener('click',opponentsPanel);
  }

  function journalPanel(){title.textContent='JOURNAL DE PARTIE';content.innerHTML='<ul class="jr-journal">'+state.journal.map(x=>`<li><time>${esc(x.t)}</time><span>${esc(x.txt)}</span></li>`).join('')+'</ul>';}

  function cardsPanel(){
    title.textContent='MES CARTES';
    const bonus=state.bonus.length?state.bonus.map(name=>{const c=cardByName(name);return `<div class="jr-private-card"><img src="../assets/cards/${c?c[1]:'bonus-vieux-radeau.jpg'}" alt="${esc(name)}"><div><strong>${esc(name)}</strong><small>BONUS SECRET · visible uniquement par vous</small></div></div>`;}).join(''):'<p class="jr-lead" style="margin:24px auto">Aucun Bonus secret en main.</p>';
    const malus=state.malus.length?'<h3 class="jr-subhead">MALUS ACTIFS — PUBLICS</h3>'+state.malus.map(x=>`<div class="jr-list-row"><strong>${esc(x)}</strong><em>ACTIF</em></div>`).join(''):'';
    const legends=state.legends.length?'<h3 class="jr-subhead">LÉGENDES & INVOCATIONS</h3>'+state.legends.map(x=>{const l=legendById(x.id);return `<div class="jr-list-row"><div><strong>${esc(l.entity)}</strong><small>${esc(l.invocation)}</small></div><em>${x.used?'UTILISÉE':'DISPONIBLE'}</em></div>`;}).join(''):'';
    content.innerHTML=bonus+malus+legends;
  }

  function shipPanel(){
    title.textContent='ÉTAT DU NAVIRE';
    const legends=state.legends.length?state.legends.map(x=>{const l=legendById(x.id);return `<div class="jr-list-row"><div><strong>${esc(l.entity)}</strong><small>INVOCATION : ${esc(l.invocation)}</small></div><em>${x.used?'UTILISÉE':'DISPONIBLE'}</em></div>`;}).join(''):'<p class="jr-note">Aucune Légende à bord.</p>';
    content.innerHTML=`<div class="jr-list"><div class="jr-list-row"><strong>PIRATES</strong><em>${state.pirates} / ${state.piratesMax}</em></div><div class="jr-list-row"><strong>DÉFENSES</strong><em>${state.defenses} / ${state.defensesMax}</em></div><div class="jr-list-row"><strong>BOULETS</strong><em>${state.boulets} / ${state.bouletsMax}</em></div><div class="jr-list-row"><strong>BONUS</strong><em>${state.bonus.length} / 4</em></div><div class="jr-list-row"><strong>MALUS ACTIFS</strong><em>${state.malus.length}</em></div></div><h3 class="jr-subhead">LÉGENDES & INVOCATIONS</h3>${legends}<p class="jr-note">Visuel navire à paraître prochainement.</p>`;
  }

  render();
})();
