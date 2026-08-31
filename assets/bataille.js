(()=>{
const root=document.getElementById('jrBattleApp'); if(!root)return;
const qs=(s,p=root)=>p.querySelector(s), qsa=(s,p=root)=>[...p.querySelectorAll(s)];
const A='../assets/cards/';
const captains=[
['SUMISHURI SHANZEN','capitaine-sumishuri-shanzen.jpg','Immunisé au Danger du Wakō.'],['MAHAWA OWONA','capitaine-mahawa-owona.jpg','Immunisée au Danger de Calypso.'],['ABU YAZID','capitaine-abu-yazid.jpg','Immunisé au Danger des Sirènes.'],['CHARLES VERJUS','capitaine-charles-verjus.jpg','Immunisé au Danger du Diable.'],['YVIE KRISTIANSEN','capitaine-yvie-kristiansen.jpg','Immunisée au Danger du Kraken.'],['ROBERTO COFRESÍ','capitaine-roberto-cofresi.jpg','Immunisé à un Danger de son choix.']];
const lieutenants=[
['SERENA STEELBREAKER','soldat','lieutenant-serena-steelbreaker.jpg','Une fois par bataille, une touche peut infliger 2 dégâts.'],['BARBE BLEUE','soldat','lieutenant-barbe-bleue.jpg','Au début de chaque bataille, l’adversaire perd 1 Pirate.'],['HUGEULIN PIERRUS','soldat','lieutenant-hugeulin-pierrus.jpg','Une fois par bataille, annule 1 dégât subi.'],['PERTH HAMILTON','soldat','lieutenant-perth-hamilton.jpg','Vos Pirates ne peuvent pas être perdus à cause d’une bataille navale.'],
['MONSIEUR MOT','explorateur','lieutenant-monsieur-mot.jpg','À chaque Événement, choisissez l’une des 2 premières cartes.'],['OLIVIER « LA BUSE »','explorateur','lieutenant-olivier-la-buse.jpg','Avant une bataille, inspecte les Bonus adverses et en neutralise un.'],['LOUISE « JOLIE-REGARD »','explorateur','lieutenant-louise-jolie-regard.jpg','Immunisée à Cruauté, Mutinerie et Wanted.'],['MATHILDA BERTOLINA','explorateur','lieutenant-mathilda-bertolina.jpg','Immunisée à Serpent de mer et Goélands géants.'],
['TARA LOCKWOOD','navigateur','lieutenant-tara-lockwood.jpg','Peut interrompre le déplacement sur n’importe quelle case.'],['TED NEWGATE','navigateur','lieutenant-ted-newgate.jpg','Peut utiliser les routes à sens unique dans les deux sens.'],['SIR ANTHONIVRE','navigateur','lieutenant-sir-anthonivre.jpg','+2 cases à chaque déplacement.'],['BOUCANIER THOMAS','navigateur','lieutenant-boucanier-thomas.jpg','Immunisé à Récifs, Mælstrom et Vent contraire.']];
const legends=[['wako','LE WAKŌ','LARME DU WAKŌ','invocation-larme-du-wako.jpg'],['diable','LE DIABLE','MURMURE DU DIABLE','invocation-murmure-du-diable.jpg'],['calypso','CALYPSO','BAISER DE CALYPSO','invocation-baiser-de-calypso.jpg'],['sirenes','LES SIRÈNES','SANG DES SIRÈNES','invocation-sang-des-sirenes.jpg'],['kraken','LE KRAKEN','L’ENCRE DU KRAKEN','invocation-encre-du-kraken.jpg']];
const bonus=[
['VIEUX RADEAU','bonus-vieux-radeau.jpg','immediate','defenses',1],['VENT FAVORABLE','bonus-vent-favorable.jpg','store'],['NAUFRAGÉ','bonus-naufrage.jpg','immediate','pirates',1],['ÉPAVE DE BATEAU PIRATE','bonus-epave-bateau-pirate.jpg','epave'],['ÉPAVE DE LA MARINE','bonus-epave-marine.jpg','marine'],['SERVICE RENDU','bonus-service-rendu.jpg','store'],['PETIT BUTIN','bonus-petit-butin.jpg','store'],['GROS BUTIN','bonus-gros-butin.jpg','store'],['HUILE DE BALEINE','bonus-huile-baleine.jpg','store'],['REMÈDE DE PIRATE','bonus-remede-pirate.jpg','store'],['BONNE RÉPUTATION','bonus-bonne-reputation.jpg','store'],['CHANTS DE PIRATE','bonus-chants-pirate.jpg','store'],['PHARE ÉCLAIRÉ','bonus-phare-eclaire.jpg','store'],['ÉQUIPAGE SOUDÉ','bonus-equipage-soude.jpg','store'],['ZOOLOGIE','bonus-zoologie.jpg','store'],['LAISSEZ-PASSER','bonus-laissez-passer.jpg','store'],['PATTE DE CHAT','bonus-patte-de-chat.jpg','store'],['MALICE DE LA MOUETTE','bonus-malice-mouette.jpg','store'],['NOUVELLE FIGURE DE PROUE','bonus-nouvelle-figure-proue.jpg','store'],['TALISMAN DE CHANCE','bonus-talisman-chance.jpg','store'],['ÉQUIPAGE MENAÇANT','bonus-equipage-menacant.jpg','store']];
const malus=[
['RÉCIFS','malus-recifs.jpg','immediate','defenses',-1],['VENT CONTRAIRE','malus-vent-contraire.jpg','active'],['SCORBUT','malus-scorbut.jpg','active'],['WANTED','malus-wanted.jpg','active'],['GOÉLANDS GÉANTS','malus-goelands-geants.jpg','active'],['SERPENT DE MER','malus-serpent-de-mer.jpg','serpent'],['MUTINERIE','malus-mutinerie.jpg','immediate','pirates',-2],['MARINE ROYALE','malus-marine-royale.jpg','marine'],['ROUILLE','malus-rouille.jpg','active'],['MÆLSTROM','malus-maelstrom.jpg','maelstrom'],['CRUAUTÉ','malus-cruaute.jpg','immediate','pirates',-2],['MALÉDICTION DU CRÂNE','malus-malediction-crane.jpg','active'],['DELIRIUM TREMENS','malus-delirium-tremens.jpg','active'],['RATS','malus-rats.jpg','active'],['PRIME DE LA MARINE ROYALE','malus-prime-marine-royale.jpg','active']];
const state={name:'HUGO',captain:null,captainDanger:null,lieuts:[],pirates:6,piratesMax:8,defenses:4,defensesMax:4,boulets:3,bouletsMax:3,bonus:[],malus:[],legends:[],figureImprovement:null,deck:[],discard:[],journal:[],turn:1};
const opponents=[{name:'CHARLES',pirates:6,piratesMax:8,defenses:4,defensesMax:4,boulets:3,bouletsMax:3,bonus:0,malus:[],legends:[],captain:'CHARLES VERJUS',lieuts:['BARBE BLEUE','TARA LOCKWOOD']},{name:'MATHIS',pirates:6,piratesMax:8,defenses:4,defensesMax:4,boulets:3,bouletsMax:3,bonus:0,malus:[],legends:[],captain:'MAHAWA OWONA',lieuts:['MONSIEUR MOT','PERTH HAMILTON']}];
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function resetDeck(){state.deck=shuffle([...bonus.map(c=>({type:'bonus',c})),...malus.map(c=>({type:'malus',c}))]);state.discard=[]}
function addLog(txt,privacy='public'){const d=new Date();state.journal.unshift({t:String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'),txt,privacy})}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
function showScreen(n){qsa('.jr-screen').forEach(x=>x.classList.toggle('is-active',x.dataset.screen===n));scrollTo(0,0)}
qsa('[data-go]').forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.go)));
qs('#hostName').addEventListener('input',e=>qs('#hostPreview').textContent=(e.target.value||'HUGO').toUpperCase());
function beginSetup(name){state.name=(name||'HUGO').trim().toUpperCase();state.captain=captains[Math.floor(Math.random()*captains.length)];state.captainDanger=null;state.lieuts=[];resetDeck();addLog(`${state.name} prépare son navire`);renderSetup();showScreen('setup')}
qs('#startGameBtn').addEventListener('click',()=>beginSetup(qs('#hostName').value));
qs('#joinGameBtn').addEventListener('click',()=>{if(!qs('#joinCode').value.trim()||!qs('#joinName').value.trim()){qs('#joinValidation').textContent='INDIQUEZ UN CODE ET VOTRE NOM.';return}beginSetup(qs('#joinName').value)});
function renderSetup(){
 const isRoberto=state.captain[0]==='ROBERTO COFRESÍ';
 qs('#setupCaptain').innerHTML=`<div class="jr-card-identity"><img src="${A+state.captain[1]}"><div><small>CAPITAINE ATTRIBUÉ AU HASARD</small><strong>${esc(state.captain[0])}</strong><p>${esc(state.captain[2])}</p></div></div>${isRoberto?`<div class="jr-choice-block"><small>POUVOIR DE ROBERTO COFRESÍ</small><strong>CHOISISSEZ VOTRE DANGER D’IMMUNITÉ</strong><div class="jr-danger-choice">${legends.map(l=>`<button type="button" data-danger="${l[0]}" class="${state.captainDanger===l[0]?'is-selected':''}">${l[1]}</button>`).join('')}</div><p>${state.captainDanger?`Immunité choisie : <b>${legends.find(l=>l[0]===state.captainDanger)[1]}</b>`:'Ce choix est obligatoire avant de commencer la partie.'}</p></div>`:''}`;
 if(isRoberto)qsa('[data-danger]',qs('#setupCaptain')).forEach(b=>b.onclick=()=>{state.captainDanger=b.dataset.danger;renderSetup()});
 const g=qs('#setupLieutenants');g.innerHTML='';lieutenants.forEach((l,i)=>{const b=document.createElement('button');b.type='button';b.className='jr-mini-card';b.innerHTML=`<img src="${A+l[2]}"><span><strong>${esc(l[0])}</strong><small>${l[1].toUpperCase()}</small><em>${esc(l[3])}</em></span>`;b.onclick=()=>{const ix=state.lieuts.indexOf(i);if(ix>=0)state.lieuts.splice(ix,1);else if(state.lieuts.length<2)state.lieuts.push(i);renderSetup()};if(state.lieuts.includes(i))b.classList.add('is-selected');g.appendChild(b)});
 const robOk=!isRoberto||!!state.captainDanger;qs('#setupValidation').textContent=`${state.lieuts.length} / 2 LIEUTENANTS SÉLECTIONNÉS${isRoberto&&!state.captainDanger?' · CHOIX DU DANGER REQUIS':''}`;qs('#confirmSetup').disabled=state.lieuts.length!==2||!robOk
}
qs('#confirmSetup').addEventListener('click',()=>{recalc();addLog(`${state.name} commence la partie avec ${state.captain[0]}${state.captainDanger?' · immunité '+legends.find(l=>l[0]===state.captainDanger)[1]:''}`);render();showScreen('game')});
function profiles(){const types=state.lieuts.map(i=>lieutenants[i][1]);let imp=null,comb=null;if(types.filter(x=>x==='soldat').length===2)imp='ARTILLERIE LOURDE';if(types.filter(x=>x==='navigateur').length===2)imp='TRIPLE VOILE';if(types.filter(x=>x==='explorateur').length===2)imp='COQUE RENFORCÉE';if(types.includes('soldat')&&types.includes('navigateur'))comb='CORSAIRE';if(types.includes('soldat')&&types.includes('explorateur'))comb='PILLEUR';if(types.includes('navigateur')&&types.includes('explorateur'))comb='AVENTURIER';return{imp,comb}}
function recalc(){const p=profiles();state.defensesMax=(p.imp==='COQUE RENFORCÉE'||state.figureImprovement==='COQUE RENFORCÉE')?6:4;state.bouletsMax=(p.imp==='ARTILLERIE LOURDE'||state.figureImprovement==='ARTILLERIE LOURDE')?5:3;state.defenses=Math.min(state.defenses,state.defensesMax);state.boulets=Math.min(state.boulets,state.bouletsMax)}
function render(){recalc();qs('#piratesCount').textContent=`${state.pirates} / ${state.piratesMax}`;qs('#defensesCount').textContent=`${state.defenses} / ${state.defensesMax}`;qs('#bouletsCount').textContent=`${state.boulets} / ${state.bouletsMax}`;qs('#bonusCount').textContent=`${state.bonus.length} / 4`}
const sheet=qs('#jrSheet'),title=qs('#sheetTitle'),content=qs('#sheetContent');function open(kind){sheet.hidden=false;document.body.style.overflow='hidden';panel(kind)}function close(){sheet.hidden=true;document.body.style.overflow=''}qsa('[data-close-sheet]').forEach(x=>x.onclick=close);qsa('[data-panel]').forEach(b=>b.onclick=()=>open(b.dataset.panel));
function panel(k){if(k==='actions')actions();else if(k==='cards')cardsPanel();else if(k==='ship')shipPanel();else if(k==='journal')journal();else if(k==='opponents')opponentsPanel()}
function actions(){title.textContent='ACTION DE JEU';content.innerHTML=`<div class="jr-action-grid"><button data-a="draw"><span>▱</span>PIOCHER ÉVÉNEMENT</button><button data-a="move"><span>→</span>DÉPLACEMENT</button><button data-a="port"><span>⚓</span>PORT</button><button data-a="battle"><span>⚔</span>BATAILLE NAVALE</button><button data-a="legend"><span>◇</span>DANGER / LÉGENDE</button><button data-a="invoke"><span>✦</span>INVOCATION</button><button data-a="trade"><span>⇄</span>ÉCHANGE</button><button data-a="turn"><span>↻</span>FIN DU TOUR</button></div><div class="jr-deck-status">DECK ÉVÉNEMENT <strong>${state.deck.length}</strong> · DÉFAUSSE <strong>${state.discard.length}</strong></div>`;qsa('[data-a]',content).forEach(b=>b.onclick=()=>({draw:drawEvent,move:movePanel,port:startPort,battle:battlePanel,legend:legendPanel,invoke:invocationPanel,trade:tradePanel,turn:endTurn}[b.dataset.a])())}
function drawEvent(){if(!state.deck.length){state.deck=shuffle(state.discard.splice(0));addLog('La défausse Événement est remélangée')};const hasMot=state.lieuts.some(i=>lieutenants[i][0]==='MONSIEUR MOT');if(hasMot&&state.deck.length>1)return motChoice();resolveDraw(state.deck.shift())}
function motChoice(){title.textContent='MONSIEUR MOT';const two=[state.deck.shift(),state.deck.shift()];content.innerHTML=`<p class="jr-lead">Choisissez l’une des 2 premières cartes du deck. L’autre retourne au sommet.</p><div class="jr-hidden-choice"><button data-pick="0">CARTE 1</button><button data-pick="1">CARTE 2</button></div>`;qsa('[data-pick]',content).forEach(b=>b.onclick=()=>{const i=+b.dataset.pick,other=two[1-i];state.deck.unshift(other);resolveDraw(two[i])})}
function resolveDraw(item){const [name,img,mode,res,val]=item.c;title.textContent=item.type==='bonus'?'BONUS PIOCHÉ':'MALUS PIOCHÉ';content.innerHTML=`<div class="jr-drawn-card"><img src="${A+img}"><strong>${esc(name)}</strong><small>${item.type==='bonus'?'CARTE PRIVÉE':'CARTE PUBLIQUE'}</small></div><button class="jr-primary" id="resolveCard">RÉSOUDRE LA CARTE</button>`;qs('#resolveCard',content).onclick=()=>applyEvent(item)}
function hasLieut(n){return state.lieuts.some(i=>lieutenants[i][0]===n)}
function consumeBonus(n){const i=state.bonus.findIndex(x=>x[0]===n);if(i>=0){const c=state.bonus.splice(i,1)[0];state.discard.push({type:'bonus',c});return true}return false}
function hasBonus(n){return state.bonus.some(x=>x[0]===n)}
function hasMalus(n){return state.malus.some(x=>x[0]===n)}
function removeMalus(n){const i=state.malus.findIndex(x=>x[0]===n);if(i>=0){const c=state.malus.splice(i,1)[0];state.discard.push({type:'malus',c});return true}return false}
function applyEvent(item){const c=item.c,[name,,mode,res,val]=c;if(item.type==='bonus'){
 if(mode==='store'){if(state.bonus.length>=4)return replaceBonus(item);state.bonus.push(c);addLog(`${state.name} pioche un Bonus — ${state.bonus.length} Bonus en main`)}
 else if(mode==='immediate'){const before=state[res];state[res]=clamp(before+val,0,state[res+'Max']);state.discard.push(item);addLog(`${state.name} applique un Bonus : ${name}`)}
 else if(mode==='epave'){state.defenses=clamp(state.defenses+1,0,state.defensesMax);state.boulets=clamp(state.boulets+1,0,state.bouletsMax);state.discard.push(item);addLog(`${state.name} applique ${name}`)}
 else if(mode==='marine'){state.defenses=clamp(state.defenses+2,0,state.defensesMax);state.boulets=clamp(state.boulets+3,0,state.bouletsMax);state.discard.push(item);addLog(`${state.name} applique ${name}`)}
 }else{
  if(consumeBonus('MALICE DE LA MOUETTE')){state.discard.push(item);addLog(`${state.name} annule un Malus avec MALICE DE LA MOUETTE`);return result('MALUS ANNULÉ',`${name} est défaussé sans effet.`)}
  if((name==='RÉCIFS'||name==='MÆLSTROM'||name==='VENT CONTRAIRE')&&hasLieut('BOUCANIER THOMAS')){state.discard.push(item);addLog(`${state.name} est immunisé à ${name}`);return result('IMMUNITÉ',`${name} est annulé par Boucanier Thomas.`)}
  if((name==='CRUAUTÉ'||name==='MUTINERIE'||name==='WANTED')&&hasLieut('LOUISE « JOLIE-REGARD »')){state.discard.push(item);addLog(`${state.name} est immunisé à ${name}`);return result('IMMUNITÉ',`${name} est annulé par Louise « Jolie-Regard ».`)}
  if((name==='SERPENT DE MER'||name==='GOÉLANDS GÉANTS')&&hasLieut('MATHILDA BERTOLINA')){state.discard.push(item);addLog(`${state.name} est immunisé à ${name}`);return result('IMMUNITÉ',`${name} est annulé par Mathilda Bertolina.`)}
  if(mode==='immediate'){state[res]=clamp(state[res]+val,0,state[res+'Max']);state.discard.push(item)} else if(mode==='serpent'){state.defenses=clamp(state.defenses-1,0,state.defensesMax);state.pirates=clamp(state.pirates-1,0,state.piratesMax);state.discard.push(item)} else if(mode==='maelstrom'){state.defenses=clamp(state.defenses-2,0,state.defensesMax);state.pirates=clamp(state.pirates-1,0,state.piratesMax);state.discard.push(item)} else if(mode==='marine'){state.pirates=clamp(state.pirates-2,0,state.piratesMax);state.discard.push(item)} else state.malus.push(c);addLog(`${state.name} pioche le Malus public ${name}`)
 }render();result(name,'État du navire recalculé et enregistré.')}
function replaceBonus(item){title.textContent='MAIN DE BONUS COMPLÈTE';content.innerHTML=`<p class="jr-lead">Gardez le nouveau Bonus en défaussant l’un des 4 actuels, ou défaussez la nouvelle carte.</p><div id="replace"></div><button class="jr-secondary" id="dropNew">DÉFAUSSER ${esc(item.c[0])}</button>`;const d=qs('#replace',content);state.bonus.forEach((c,i)=>{const b=document.createElement('button');b.className='jr-target-row';b.innerHTML=`<span><strong>${esc(c[0])}</strong><small>REMPLACER PAR ${esc(item.c[0])}</small></span>`;b.onclick=()=>{state.discard.push({type:'bonus',c:state.bonus[i]});state.bonus[i]=item.c;addLog(`${state.name} remplace un Bonus — main 4/4`);render();result('BONUS REMPLACÉ','La nouvelle carte rejoint votre main secrète.')};d.appendChild(b)});qs('#dropNew',content).onclick=()=>{state.discard.push(item);result('BONUS DÉFAUSSÉ','Votre main reste à 4 Bonus.')}}
function result(n,t){title.textContent=n;content.innerHTML=`<div class="jr-event-result"><strong>${esc(n)}</strong><span>${esc(t)}</span></div><button class="jr-primary" id="ok">TERMINER</button>`;qs('#ok',content).onclick=close;render()}
function movePanel(){
 title.textContent='DÉPLACEMENT';
 if(hasMalus('DELIRIUM TREMENS')){removeMalus('DELIRIUM TREMENS');addLog(`${state.name} subit DELIRIUM TREMENS : recul de 4 cases`);return result('DÉPLACEMENT IMPOSÉ','Reculez votre pion de 4 cases. Aucun lancer normal pour ce déplacement.')}
 if(hasMalus('RATS')){removeMalus('RATS');addLog(`${state.name} subit RATS : recul de 2 cases`);return result('DÉPLACEMENT IMPOSÉ','Reculez votre pion de 2 cases. Aucun lancer normal pour ce déplacement.')}
 const permanent=(profiles().imp==='TRIPLE VOILE'||state.figureImprovement==='TRIPLE VOILE'?2:0)+(hasLieut('SIR ANTHONIVRE')?2:0);
 const temporary=(hasMalus('VENT CONTRAIRE')?-3:0)+(hasMalus('SCORBUT')?-2:0);
 const chants=hasBonus('CHANTS DE PIRATE');
 const phare=hasBonus('PHARE ÉCLAIRÉ');
 content.innerHTML=`<p class="jr-lead">Le moteur additionne automatiquement les effets de déplacement connus. Vous ne renseignez que le résultat du ou des dés physiques.</p>${phare?'<button class="jr-secondary" id="peekEvent">PHARE ÉCLAIRÉ · VOIR LA PROCHAINE CARTE</button>':''}<div class="jr-context-box"><small>EFFETS PRIS EN COMPTE</small><p>${permanent?`Bonus permanents : +${permanent}.`:'Aucun bonus permanent de distance.'}</p><p>${temporary?`Malus temporaire : ${temporary} case(s).`:'Aucun Malus de distance.'}</p>${hasLieut('TARA LOCKWOOD')?'<p>TARA LOCKWOOD : arrêt possible sur n’importe quelle case.</p>':''}${hasLieut('TED NEWGATE')?'<p>TED NEWGATE : sens uniques utilisables dans les deux directions.</p>':''}${profiles().comb==='AVENTURIER'?'<p>AVENTURIER : choisissez ensuite −1, 0 ou +1.</p>':''}${chants?'<p>CHANTS DE PIRATE : lancez 2 dés et additionnez-les.</p>':''}</div>${chants?`<div class="jr-double-dice"><label>DÉ 1<input id="moveD1" type="number" min="1" max="6" value="1"></label><label>DÉ 2<input id="moveD2" type="number" min="1" max="6" value="1"></label></div><button class="jr-primary" id="calcMove">CALCULER LE DÉPLACEMENT</button>`:`<div class="jr-dice-grid">${[1,2,3,4,5,6].map(n=>`<button data-d="${n}">${n}</button>`).join('')}</div>`}`;
 if(phare)qs('#peekEvent',content).onclick=()=>{const next=state.deck[0];if(!next)return;consumeBonus('PHARE ÉCLAIRÉ');const c=next.c;addLog(`${state.name} utilise PHARE ÉCLAIRÉ`, 'private');title.textContent='PHARE ÉCLAIRÉ';content.innerHTML=`<p class="jr-lead">Cette information reste privée.</p><div class="jr-drawn-card"><img src="${A+c[1]}"><strong>${esc(c[0])}</strong><small>PROCHAINE CARTE DU DECK</small></div><button class="jr-primary" id="backMove">REVENIR AU DÉPLACEMENT</button>`;qs('#backMove',content).onclick=movePanel};
 const resolveBase=base=>prepareMovementResult(base,permanent,temporary,chants);
 if(chants)qs('#calcMove',content).onclick=()=>{const d1=clamp(parseInt(qs('#moveD1',content).value)||1,1,6),d2=clamp(parseInt(qs('#moveD2',content).value)||1,1,6);resolveBase(d1+d2)};else qsa('[data-d]',content).forEach(b=>b.onclick=()=>resolveBase(+b.dataset.d));
}
function prepareMovementResult(base,permanent,temporary,chants){
 const p=profiles();
 if(p.comb==='AVENTURIER'){
  title.textContent='AVENTURIER';content.innerHTML=`<p class="jr-lead">Distance calculée avant Aventurier : <strong>${Math.max(0,base+permanent+temporary)}</strong> cases.</p><p>Modifiez la distance finale de −1, 0 ou +1.</p><div class="jr-hidden-choice"><button data-av="-1">−1</button><button data-av="0">0</button><button data-av="1">+1</button></div>`;qsa('[data-av]',content).forEach(b=>b.onclick=()=>finalizeMovement(base,permanent,temporary,+b.dataset.av,chants));return
 }
 finalizeMovement(base,permanent,temporary,0,chants)
}
function finalizeMovement(base,permanent,temporary,adventure,chants){
 const total=Math.max(0,base+permanent+temporary+adventure);
 if(chants)consumeBonus('CHANTS DE PIRATE');removeMalus('VENT CONTRAIRE');removeMalus('SCORBUT');
 const bits=[`base ${base}`];if(permanent)bits.push(`+${permanent}`);if(temporary)bits.push(`${temporary}`);if(adventure)bits.push(adventure>0?`+${adventure}`:`${adventure}`);
 addLog(`${state.name} effectue un déplacement calculé de ${total} cases`);result('DÉPLACEMENT',`${bits.join(' ')} = ${total} cases. Déplacez le pion physiquement sur le plateau.`)
}
function startPort(){
 state._portRavitaillementDone=false;
 if(hasMalus('WANTED')){state.pirates=clamp(state.pirates-1,0,state.piratesMax);removeMalus('WANTED');addLog(`${state.name} subit WANTED au Port : -1 Pirate`)}
 addLog(`${state.name} entre dans un Port`);render();portPanel()
}
function portPanel(message=''){
 title.textContent='PORT';
 const usable=state.bonus.filter(c=>['SERVICE RENDU','PETIT BUTIN','GROS BUTIN','BONNE RÉPUTATION','NOUVELLE FIGURE DE PROUE'].includes(c[0]));
 content.innerHTML=`${message?`<div class="jr-event-result"><span>${esc(message)}</span></div>`:''}<p class="jr-lead">À chaque escale, choisissez d’abord UNE action de ravitaillement : +1 Défense, +1 Pirate ou +1 Boulet, sans dépasser la capacité du navire.</p><h3 class="jr-subhead">RAVITAILLEMENT</h3><div class="jr-port-supply"><button data-supply="defenses" ${state._portRavitaillementDone||state.defenses>=state.defensesMax?'disabled':''}>+1 DÉFENSE<small>${state.defenses}/${state.defensesMax}</small></button><button data-supply="pirates" ${state._portRavitaillementDone||state.pirates>=state.piratesMax?'disabled':''}>+1 PIRATE<small>${state.pirates}/${state.piratesMax}</small></button><button data-supply="boulets" ${state._portRavitaillementDone||state.boulets>=state.bouletsMax?'disabled':''}>+1 BOULET<small>${state.boulets}/${state.bouletsMax}</small></button></div><p class="jr-note">${state._portRavitaillementDone?'Ravitaillement effectué pour cette escale.':'Choisissez une seule ressource.'}</p><h3 class="jr-subhead">EFFETS « AU PROCHAIN PORT »</h3><div id="portList"></div><button class="jr-secondary" id="portDone">TERMINER L’ESCALE</button>`;
 qsa('[data-supply]',content).forEach(b=>b.onclick=()=>{const r=b.dataset.supply;if(state._portRavitaillementDone||state[r]>=state[r+'Max'])return;state[r]++;state._portRavitaillementDone=true;addLog(`${state.name} se ravitaille au Port : +1 ${r==='defenses'?'Défense':r==='pirates'?'Pirate':'Boulet'}`);render();portPanel('Ravitaillement enregistré.')});
 const l=qs('#portList',content);if(!usable.length)l.innerHTML='<p class="jr-note">Aucun Bonus à résoudre au Port.</p>';usable.forEach(c=>{const b=document.createElement('button');b.className='jr-target-row';b.innerHTML=`<span><strong>${esc(c[0])}</strong><small>RÉSOUDRE CE BONUS</small></span>`;b.onclick=()=>usePort(c);l.appendChild(b)});qs('#portDone',content).onclick=()=>{state._portRavitaillementDone=false;close()}
}
function usePort(c){
 const n=c[0];
 if(n==='PETIT BUTIN'){title.textContent='PETIT BUTIN';content.innerHTML=`<p class="jr-lead">Choisissez l’effet : +1 Boulet OU +1 Défense.</p><div class="jr-hidden-choice"><button data-petit="boulets" ${state.boulets>=state.bouletsMax?'disabled':''}>+1 BOULET</button><button data-petit="defenses" ${state.defenses>=state.defensesMax?'disabled':''}>+1 DÉFENSE</button></div>`;qsa('[data-petit]',content).forEach(b=>b.onclick=()=>{const r=b.dataset.petit;state[r]=clamp(state[r]+1,0,state[r+'Max']);consumeBonus(n);addLog(`${state.name} révèle et utilise ${n}`);render();portPanel(`${n} appliqué.`)});return}
 if(n==='NOUVELLE FIGURE DE PROUE')return chooseFigure(c);
 if(n==='SERVICE RENDU')state.boulets=state.bouletsMax;
 if(n==='GROS BUTIN'){state.boulets=clamp(state.boulets+2,0,state.bouletsMax);state.defenses=clamp(state.defenses+2,0,state.defensesMax)}
 if(n==='BONNE RÉPUTATION')state.pirates=clamp(state.pirates+3,0,state.piratesMax);
 consumeBonus(n);addLog(`${state.name} révèle et utilise ${n}`);render();portPanel(`${n} appliqué. État du navire mis à jour.`)
}
function chooseFigure(c){title.textContent='NOUVELLE FIGURE DE PROUE';content.innerHTML=`<p class="jr-lead">Choisissez l’Amélioration obtenue.</p>${['TRIPLE VOILE','COQUE RENFORCÉE','ARTILLERIE LOURDE'].map(x=>`<button class="jr-target-row" data-imp="${x}"><span><strong>${x}</strong></span></button>`).join('')}`;qsa('[data-imp]',content).forEach(b=>b.onclick=()=>{state.figureImprovement=b.dataset.imp;consumeBonus('NOUVELLE FIGURE DE PROUE');recalc();addLog(`${state.name} obtient ${b.dataset.imp} via Nouvelle Figure de Proue`);render();portPanel(`${b.dataset.imp} est maintenant active.`)})}
function legendPanel(){title.textContent='DANGER / LÉGENDE';content.innerHTML=`<p class="jr-lead">Après résolution physique du Danger, enregistrez la Légende remportée.</p><div class="jr-legend-grid">${legends.map(l=>`<button class="jr-legend-choice" data-leg="${l[0]}" ${state.legends.some(x=>x.id===l[0])?'disabled':''}><img src="${A+l[3]}"><span><strong>${l[1]}</strong><small>${l[2]}</small></span></button>`).join('')}</div>`;qsa('[data-leg]',content).forEach(b=>b.onclick=()=>{const l=legends.find(x=>x[0]===b.dataset.leg);state.legends.push({id:l[0],used:false});addLog(`${state.name} remporte ${l[1]}`);result('LÉGENDE REMPORTÉE',`${l[2]} est disponible.`)})}
function invocationPanel(){title.textContent='INVOCATIONS';const avail=state.legends.filter(x=>!x.used);content.innerHTML=avail.length?`<div class="jr-list">${avail.map(x=>{const l=legends.find(y=>y[0]===x.id);return `<button class="jr-target-row" data-inv="${x.id}"><span><strong>${l[2]}</strong><small>${l[1]} · USAGE UNIQUE</small></span></button>`}).join('')}</div>`:'<p class="jr-lead">Aucune Invocation disponible.</p>';qsa('[data-inv]',content).forEach(b=>b.onclick=()=>invoke(b.dataset.inv))}
function invoke(id){const l=legends.find(x=>x[0]===id),own=state.legends.find(x=>x.id===id);title.textContent=l[2];content.innerHTML=`<p class="jr-lead">Choisissez la cible. L’effet est public et l’Invocation sera définitivement consommée.</p>${opponents.map((o,i)=>`<button class="jr-target-row" data-target="${i}"><span><strong>${o.name}</strong><small>☠ ${o.pirates} · ◇ ${o.defenses} · ● ${o.boulets}</small></span></button>`).join('')}`;qsa('[data-target]',content).forEach(b=>b.onclick=()=>{const o=opponents[+b.dataset.target];if(id==='diable')o.boulets=Math.max(0,o.boulets-3);if(id==='kraken')o.defenses=Math.max(0,o.defenses-3);if(id==='sirenes')o.pirates=Math.max(0,o.pirates-3);own.used=true;addLog(`${state.name} utilise ${l[2]} contre ${o.name}`);result(l[2],id==='calypso'?`${o.name} devra passer son prochain tour.`:id==='wako'?`${o.name} doit être déplacé jusqu’à 8 cases selon votre choix sur le plateau.`:`État de ${o.name} mis à jour.`)})}
function battlePanel(){title.textContent='BATAILLE NAVALE';content.innerHTML=`<p class="jr-lead">Choisissez l’adversaire. Une fois la bataille commencée, l’interface reste ouverte jusqu’à sa résolution complète.</p>${opponents.map((o,i)=>`<button class="jr-target-row" data-bat="${i}"><span><strong>${o.name}</strong><small>◇ ${o.defenses}/${o.defensesMax} · ● ${o.boulets}/${o.bouletsMax}</small></span></button>`).join('')}`;qsa('[data-bat]',content).forEach(b=>b.onclick=()=>startBattle(+b.dataset.bat))}
let battleSession=null;
function startBattle(i){
 const o=opponents[i];
 if(hasLieut('BARBE BLEUE')){o.pirates=Math.max(0,o.pirates-1);addLog(`BARBE BLEUE : ${o.name} perd 1 Pirate au début de la bataille`)}
 battleSession={opponentIndex:i,turn:'player',playerFreeShot:profiles().comb==='CORSAIRE',ended:false,message:'La bataille commence. Vous tirez en premier.'};
 renderBattle();
}
function renderBattle(){
 if(!battleSession)return battlePanel();
 const o=opponents[battleSession.opponentIndex];
 const playerTurn=battleSession.turn==='player';
 const shooter=playerTurn?state:o;
 const target=playerTurn?o:state;
 const shooterName=playerTurn?state.name:o.name;
 const noAmmo=shooter.boulets<=0 && !(playerTurn&&battleSession.playerFreeShot);
 title.textContent=`BATAILLE · ${o.name}`;
 let endReason='';
 if(state.defenses<=0)endReason=`${o.name} remporte la bataille.`;
 else if(o.defenses<=0)endReason=`${state.name} remporte la bataille.`;
 else if(state.boulets<=0&&o.boulets<=0&&!battleSession.playerFreeShot)endReason='Plus aucun tir n’est possible : la bataille se termine sans vainqueur.';
 if(endReason){battleSession.ended=true;battleSession.message=endReason}
 const status=`<div class="jr-duel"><div><small>${state.name}</small><strong>◇ ${state.defenses}/${state.defensesMax} · ● ${state.boulets}/${state.bouletsMax}</strong></div><span>VS</span><div><small>${o.name}</small><strong>◇ ${o.defenses}/${o.defensesMax} · ● ${o.boulets}/${o.bouletsMax}</strong></div></div>`;
 const msg=`<div class="jr-event-result jr-battle-result"><span>${esc(battleSession.message||'')}</span></div>`;
 if(battleSession.ended){
   const hasWinner=state.defenses<=0||o.defenses<=0;
   content.innerHTML=status+msg+(hasWinner?`<button class="jr-primary" id="battlePillage">PASSER AU PILLAGE</button>`:`<button class="jr-primary" id="battleDone">TERMINER LA BATAILLE</button>`);
   if(hasWinner)qs('#battlePillage',content).onclick=()=>openPillage();
   else qs('#battleDone',content).onclick=()=>{battleSession=null;render();close()};
   return;
 }
 if(noAmmo){
   battleSession.message=`${shooterName} n’a plus de Boulet : le tour de tir passe à l’adversaire.`;
   battleSession.turn=playerTurn?'opponent':'player';
   return renderBattle();
 }
 content.innerHTML=status+msg+`<p class="jr-lead">${playerTurn?'VOTRE TIR':`TIR DE ${o.name}`}. Lancez le dé physique puis indiquez le résultat sans quitter cet écran.</p><div class="jr-dice-grid">${[1,2,3,4,5,6].map(n=>`<button data-battle-shot="${n}">${n}</button>`).join('')}</div><p class="jr-note">${playerTurn&&battleSession.playerFreeShot?'CORSAIRE ACTIF : ce premier tir ne consomme pas de Boulet.':'3 à 6 : touche · 1 à 2 : échec.'}</p>`;
 qsa('[data-battle-shot]',content).forEach(b=>b.onclick=()=>resolveBattleShot(+b.dataset.battleShot));
}
function resolveBattleShot(roll){
 const o=opponents[battleSession.opponentIndex];
 const playerTurn=battleSession.turn==='player';
 const shooter=playerTurn?state:o;
 const target=playerTurn?o:state;
 const shooterName=playerTurn?state.name:o.name;
 const targetName=playerTurn?o.name:state.name;
 const free=playerTurn&&battleSession.playerFreeShot;
 if(!free){if(shooter.boulets<=0){battleSession.message=`${shooterName} n’a plus de Boulet.`;battleSession.turn=playerTurn?'opponent':'player';return renderBattle()}shooter.boulets--}else battleSession.playerFreeShot=false;
 const hit=roll>=3;
 if(hit)target.defenses=Math.max(0,target.defenses-1);
 addLog(`${shooterName} tire sur ${targetName} : ${roll} — ${hit?'TOUCHE':'ÉCHEC'}`);
 battleSession.message=`${shooterName} obtient ${roll} : ${hit?`TOUCHE — ${targetName} perd 1 Défense.`:'ÉCHEC — aucun dégât.'}`;
 battleSession.turn=playerTurn?'opponent':'player';
 render();
 renderBattle();
}

function openPillage(){
 const o=opponents[battleSession.opponentIndex];
 const playerWon=o.defenses<=0&&state.defenses>0;
 const winner=playerWon?state:o, loser=playerWon?o:state;
 const winnerName=winner.name, loserName=loser.name;
 const pilleur=playerWon&&profiles().comb==='PILLEUR';
 const maxPicks=2+(pilleur?1:0);
 battleSession.pillage={playerWon,winner,loser,maxPicks,pirates:0,boulets:0};
 renderPillage();
}
function renderPillage(){
 const p=battleSession&&battleSession.pillage;if(!p)return renderBattle();
 const {winner,loser,maxPicks}=p;
 const used=p.pirates+p.boulets,remaining=maxPicks-used;
 const legCount=(loser.legends||[]).length;
 const pirateRoom=Math.max(0,winner.piratesMax-winner.pirates);
 const bouletRoom=Math.max(0,winner.bouletsMax-winner.boulets);
 const canPirate=remaining>0&&p.pirates<loser.pirates&&p.pirates<pirateRoom;
 const canBoulet=remaining>0&&p.boulets<loser.boulets&&p.boulets<bouletRoom;
 title.textContent='PILLAGE';
 content.innerHTML=`<div class="jr-pillage-head"><small>VAINQUEUR</small><strong>${esc(winner.name)}</strong><span>${esc(loser.name)} est à 0 Défense.</span></div>
 <div class="jr-pillage-auto"><small>AUTOMATIQUE</small><strong>${legCount} LÉGENDE${legCount>1?'S':''} + INVOCATION${legCount>1?'S':''}</strong><span>${legCount?'Toutes les Légendes du navire vaincu seront transférées. Les Invocations disponibles les suivent ; celles déjà utilisées restent consommées.':'Le navire vaincu ne transporte aucune Légende.'}</span></div>
 <h3 class="jr-subhead">RESSOURCES À PILLER</h3>
 <p class="jr-lead">Choisissez jusqu’à <strong>${maxPicks}</strong> prise${maxPicks>1?'s':''} parmi Pirates et Boulets, dans la limite des ressources du vaincu et de la capacité du vainqueur.${maxPicks===3?' PILLEUR vous accorde 1 prise supplémentaire.':''}</p>
 <div class="jr-pillage-counter"><span>SÉLECTION</span><strong>${used} / ${maxPicks}</strong></div>
 <div class="jr-pillage-resources">
   <div><small>PIRATES DU VAINCU</small><strong>${loser.pirates}</strong><span>Capacité libre du vainqueur : ${pirateRoom}</span><div class="jr-stepper"><button data-pill="pirates" data-delta="-1" ${p.pirates<=0?'disabled':''}>−</button><b>${p.pirates}</b><button data-pill="pirates" data-delta="1" ${!canPirate?'disabled':''}>+</button></div></div>
   <div><small>BOULETS DU VAINCU</small><strong>${loser.boulets}</strong><span>Capacité libre du vainqueur : ${bouletRoom}</span><div class="jr-stepper"><button data-pill="boulets" data-delta="-1" ${p.boulets<=0?'disabled':''}>−</button><b>${p.boulets}</b><button data-pill="boulets" data-delta="1" ${!canBoulet?'disabled':''}>+</button></div></div>
 </div>
 <button class="jr-primary" id="validatePillage">VALIDER LE PILLAGE</button>`;
 qsa('[data-pill]',content).forEach(b=>b.onclick=()=>{const r=b.dataset.pill,d=+b.dataset.delta;p[r]=Math.max(0,p[r]+d);renderPillage()});
 qs('#validatePillage',content).onclick=validatePillage;
}
function validatePillage(){
 const p=battleSession&&battleSession.pillage;if(!p)return;
 const {winner,loser}=p;
 const stolenLegends=[...(loser.legends||[])];
 if(!winner.legends)winner.legends=[];
 stolenLegends.forEach(l=>{if(!winner.legends.some(x=>x.id===l.id))winner.legends.push({...l})});
 loser.legends=[];
 const takePirates=Math.min(p.pirates,loser.pirates,Math.max(0,winner.piratesMax-winner.pirates));
 const takeBoulets=Math.min(p.boulets,loser.boulets,Math.max(0,winner.bouletsMax-winner.boulets));
 loser.pirates-=takePirates;winner.pirates+=takePirates;
 loser.boulets-=takeBoulets;winner.boulets+=takeBoulets;
 const loot=[];if(stolenLegends.length)loot.push(`${stolenLegends.length} Légende${stolenLegends.length>1?'s':''}`);if(takePirates)loot.push(`${takePirates} Pirate${takePirates>1?'s':''}`);if(takeBoulets)loot.push(`${takeBoulets} Boulet${takeBoulets>1?'s':''}`);if(!loot.length)loot.push('aucune ressource ordinaire');
 addLog(`${winner.name} remporte la bataille et pille ${loser.name} : ${loot.join(', ')}`);
 loser.defenses=Math.min(2,loser.defensesMax);
 addLog(`${loser.name} est remis à flot avec ${loser.defenses} Défenses au Port le plus proche`);
 render();
 title.textContent='PILLAGE TERMINÉ';
 content.innerHTML=`<div class="jr-event-result jr-pillage-done"><strong>PILLAGE VALIDÉ</strong><span>${esc(winner.name)} récupère ${esc(loot.join(', '))}.</span></div><p class="jr-lead">Le navire vaincu est remis à flot avec <strong>${loser.defenses} Défenses</strong>. Déplacez physiquement son pion au Port le plus proche.</p><button class="jr-primary" id="resumeGame">REPRENDRE LA PARTIE</button>`;
 qs('#resumeGame',content).onclick=()=>{battleSession=null;render();close()};
}
function tradePanel(){title.textContent='ÉCHANGE';content.innerHTML=`<p class="jr-lead">Les échanges restent soumis aux conditions de proximité du plateau. Choisissez une ressource à transférer.</p>${opponents.map((o,i)=>`<button class="jr-target-row" data-tr="${i}"><span><strong>${o.name}</strong><small>OUVRIR LE TRANSFERT</small></span></button>`).join('')}`;qsa('[data-tr]',content).forEach(b=>b.onclick=()=>tradeTo(+b.dataset.tr))}
function tradeTo(i){const o=opponents[i];title.textContent=`TRANSFERT · ${o.name}`;content.innerHTML=`${['pirates','defenses','boulets'].map(r=>`<button class="jr-target-row" data-r="${r}"><span><strong>1 ${r==='pirates'?'PIRATE':r==='defenses'?'DÉFENSE':'BOULET'}</strong><small>VOUS : ${state[r]} · ${o.name} : ${o[r]}/${o[r+'Max']}</small></span></button>`).join('')}`;qsa('[data-r]',content).forEach(b=>b.onclick=()=>{const r=b.dataset.r;if(state[r]<1||o[r]>=o[r+'Max'])return;state[r]--;o[r]++;addLog(`${state.name} transfère 1 ${r} à ${o.name}`);render();result('TRANSFERT','État des deux navires mis à jour.')})}
function endTurn(){state.turn++;addLog(`${state.name} termine son tour · tour ${state.turn}`);result('FIN DU TOUR',`Tour ${state.turn}. Les effets temporaires arrivés à échéance devront être résolus par le moteur.`)}
function cardsPanel(){title.textContent='CARTERIE DE MON NAVIRE';const p=profiles();content.innerHTML=`<div class="jr-card-identity"><img src="${A+state.captain[1]}"><div><small>CAPITAINE</small><strong>${esc(state.captain[0])}</strong><p>${esc(state.captain[2])}${state.captainDanger?' · Choix : '+esc(legends.find(l=>l[0]===state.captainDanger)[1]):''}</p></div></div><h3 class="jr-subhead">LIEUTENANTS</h3>${state.lieuts.map(i=>`<div class="jr-private-card"><img src="${A+lieutenants[i][2]}"><div><strong>${esc(lieutenants[i][0])}</strong><small>${esc(lieutenants[i][3])}</small></div></div>`).join('')}<h3 class="jr-subhead">EFFETS CALCULÉS</h3><div class="jr-status-grid"><div><small>AMÉLIORATION</small><strong>${p.imp||state.figureImprovement||'AUCUNE'}</strong></div><div><small>COMBINAISON</small><strong>${p.comb||'AUCUNE'}</strong></div></div><h3 class="jr-subhead">BONUS SECRETS · ${state.bonus.length}/4</h3>${state.bonus.length?state.bonus.map(c=>`<div class="jr-private-card"><img src="${A+c[1]}"><div><strong>${esc(c[0])}</strong><small>PRIVÉ JUSQU’À UTILISATION</small></div></div>`).join(''):'<p class="jr-note">Aucun Bonus.</p>'}<h3 class="jr-subhead">MALUS PUBLICS</h3>${state.malus.length?state.malus.map(c=>`<div class="jr-private-card"><img src="${A+c[1]}"><div><strong>${esc(c[0])}</strong><small>EFFET ACTIF PUBLIC</small></div></div>`).join(''):'<p class="jr-note">Aucun Malus actif.</p>'}`}
function shipPanel(){title.textContent='ÉTAT DU NAVIRE';const p=profiles();content.innerHTML=`<div class="jr-status-grid"><div><small>PIRATES</small><strong>${state.pirates}/${state.piratesMax}</strong></div><div><small>DÉFENSES</small><strong>${state.defenses}/${state.defensesMax}</strong></div><div><small>BOULETS</small><strong>${state.boulets}/${state.bouletsMax}</strong></div><div><small>BONUS</small><strong>${state.bonus.length}/4</strong></div></div><div class="jr-list"><div class="jr-list-row"><span><strong>${state.captain[0]}</strong><small>CAPITAINE${state.captainDanger?' · IMMUNITÉ '+legends.find(l=>l[0]===state.captainDanger)[1]:''}</small></span></div><div class="jr-list-row"><span><strong>${state.lieuts.map(i=>lieutenants[i][0]).join(' · ')}</strong><small>LIEUTENANTS</small></span></div><div class="jr-list-row"><span><strong>${p.imp||state.figureImprovement||'AUCUNE'}</strong><small>AMÉLIORATION ACTIVE</small></span></div><div class="jr-list-row"><span><strong>${p.comb||'AUCUNE'}</strong><small>COMBINAISON ACTIVE</small></span></div><div class="jr-list-row"><span><strong>${state.legends.length}/5</strong><small>LÉGENDES À BORD</small></span></div></div>`}
function opponentsPanel(){title.textContent='ADVERSAIRES · ÉTAT PUBLIC';content.innerHTML=opponents.map((o,i)=>`<button class="jr-target-row" data-op="${i}"><span><strong>${o.name}</strong><small>☠ ${o.pirates}/${o.piratesMax} · ◇ ${o.defenses}/${o.defensesMax} · ● ${o.boulets}/${o.bouletsMax} · BONUS ${o.bonus}</small></span><em>${o.legends.length} LÉGENDE(S)</em></button>`).join('');}
function journal(){title.textContent='JOURNAL DE PARTIE';content.innerHTML=`<ul class="jr-journal">${state.journal.map(x=>`<li><time>${x.t}</time><span>${esc(x.txt)}</span></li>`).join('')}</ul>`}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!sheet.hidden)close()});render();
})();