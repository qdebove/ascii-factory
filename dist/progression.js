import {TYPES} from './entities.js';
import {emit} from './events.js';
import {LEXICON} from './language.js';
const researchBase=[
 {id:'objects',branch:'Langage',name:'Le sens du complément',cost:8,tier:5,requires:'syntax',desc:'Modèle article → nom → verbe → article → nom. Le composeur trie les mots réellement reçus.'},
 {id:'adjectives',branch:'Langage',name:'La couleur des mots',cost:10,tier:5,requires:'syntax',desc:'Modèle article → adjectif → nom → verbe. Les détails augmentent le score.'},
 {id:'connectors',branch:'Langage',name:'Relier les idées',cost:14,tier:5,requires:'adjectives',desc:'Relie deux propositions par un connecteur, à partir de sept mots reçus.'},
 {id:'drills',branch:'Production',name:'Extraction cadencée',cost:5,tier:2,desc:'Extracteurs de poussière deux fois plus rapides.'},
 {id:'press',branch:'Production',name:'Compression précise',cost:8,tier:3,requires:'drills',desc:'2 poussières par lettre au lieu de 3.'},
 {id:'assembly',branch:'Production',name:'Assemblage parallèle',cost:12,tier:4,requires:'press',desc:'Assembleurs de mots et de phrases deux fois plus rapides.'},
 {id:'storage',branch:'Logistique',name:'Réserves étendues',cost:5,tier:3,desc:'Double la capacité des coffres, archives et tampons.'},
 {id:'routing',branch:'Logistique',name:'Lignes intelligentes',cost:8,tier:3,desc:'Débloque répartiteurs, fusionneurs, priorité, trop-plein et convoyeurs rapides.'},
 {id:'target',branch:'Langage',name:'Alphabet dirigé',cost:6,tier:3,desc:'La presse tire ses lettres parmi celles d’une recette choisie.'},
 {id:'syntax',branch:'Langage',name:'Structure vivante',cost:10,tier:5,desc:'Contrôle simple article → nom → verbe. Récompense les phrases structurées. Composeur jusqu’à 32 mots.'},
 {id:'long',branch:'Langage',name:'Phrases complexes',cost:20,tier:5,requires:'syntax',desc:'Composeur jusqu’à 128 mots. Réutilisez les phrases archivées dans vos chaînes.'},
 {id:'mega',branch:'Langage',name:'Moteur de langage',cost:40,tier:6,requires:'long',desc:'Composeur jusqu’à 2 048 mots. Limite de sécurité : 20 000 caractères par produit.'}
];
const researchTuning={drills:[6,1200,300],press:[16,3500,900],assembly:[35,12000,1800],storage:[12,2200,600],routing:[24,4500,900],target:[16,4000,900],syntax:[35,15000,1800],objects:[45,22000,2400],adjectives:[50,25000,2700],connectors:[70,45000,3600],long:[100,80000,5400],mega:[220,300000,10800]};
export const RESEARCH=[
 {id:'automation',branch:'Production',name:'Ateliers mécanisés',cost:6,gold:1000,duration:300,tier:2,minLetters:250,desc:'Autorise les améliorations individuelles MK.2. Chaque machine doit encore payer sa propre modernisation.'},
 {id:'precision',branch:'Production',name:'Usinage de précision',cost:20,gold:8000,duration:1200,tier:3,requires:'automation',minWords:500,desc:'Autorise MK.3, avec un coût individuel cinq fois supérieur à MK.2.'},
 {id:'industrial',branch:'Production',name:'Industrie intégrée',cost:55,gold:50000,duration:3600,tier:5,requires:'precision',minWords:5000,desc:'Autorise MK.4. Les gains de vitesse restent limités à ×1,4 par niveau.'},
 {id:'mastery',branch:'Production',name:'Ingénierie de pointe',cost:140,gold:250000,duration:7200,tier:6,requires:'industrial',minWords:25000,desc:'Autorise MK.5, dernier niveau de modernisation individuelle.'},
 {id:'lexicology',branch:'Langage',name:'Exploration lexicale',cost:8,gold:1500,duration:600,tier:3,minWords:250,desc:'Permet d’étudier un mot inconnu depuis le dictionnaire. Une étude débloque sa recette, sans fabriquer le mot.'},
 {id:'dictionary',branch:'Langage',name:'Recettes mémorisées',cost:18,gold:6000,duration:1200,tier:3,requires:'lexicology',minWords:1000,minDiscovered:1,desc:'Débloque le mode Dictionnaire de l’assembleur, limité aux mots déjà découverts.'},
 ...researchBase.map(r=>{const [cost,gold,duration]=researchTuning[r.id];return{...r,cost,gold,duration,...(r.id==='target'?{requires:'dictionary'}:{})}})
];
export const dictionaryAvailable=s=>s.research.includes('dictionary');
export const knownWords=s=>[...new Set(s.discovered)].filter(w=>LEXICON.has(w));
export function researchIssue(s,r){if(!r)return'Recherche inconnue.';if(s.research.includes(r.id))return'Déjà acquise.';if(s.activeResearch)return'Une étude est déjà en cours.';if(s.tier<r.tier)return`Palier ${r.tier} requis.`;if(r.requires&&!s.research.includes(r.requires))return'Recherche requise : '+RESEARCH.find(n=>n.id===r.requires)?.name;if((r.minWords||0)>s.counts.words)return`${r.minWords} mots produits requis (${s.counts.words}).`;if((r.minLetters||0)>s.counts.letters)return`${r.minLetters} lettres produites requises (${s.counts.letters}).`;if((r.minDiscovered||0)>knownWords(s).length)return'Découvrez ou étudiez au moins un mot.';if(r.id==='routing'&&!s.encounters?.blockedOutput)return'Repérez une sortie bloquée.';if(s.rp<r.cost)return`${r.cost} points de recherche requis.`;if(s.gold<r.gold)return`${r.gold} pièces requises.`;return''}
export function advanceResearch(s){const a=s.activeResearch;if(!a||s.time<a.endsAt)return;if(a.kind==='study'){if(!s.discovered.includes(a.word))s.discovered.push(a.word);emit(s,'WORD_DISCOVERED',{title:'Mot étudié : '+a.word,text:'Recette mémorisée. Aucun produit ajouté au stock.'})}else{if(!s.research.includes(a.id))s.research.push(a.id);emit(s,'RESEARCH_UNLOCKED',{title:RESEARCH.find(r=>r.id===a.id)?.name||a.id,text:'Recherche terminée.'})}s.activeResearch=null}
export function studyCost(s){return{cost:4+Math.floor(knownWords(s).length/5),gold:1000+knownWords(s).length*150,duration:300+Math.floor(knownWords(s).length/10)*120}}
export function studyIssue(s,word){if(!s.research.includes('lexicology'))return'Recherchez Exploration lexicale.';if(!LEXICON.has(word)||s.discovered.includes(word))return'Mot déjà connu ou inconnu du lexique.';if(s.activeResearch)return'Une étude est déjà en cours.';const c=studyCost(s);if(s.rp<c.cost||s.gold<c.gold)return`Étude : ${c.cost} recherche et ${c.gold} pièces nécessaires.`;return''}
export function startStudy(s,word){const error=studyIssue(s,word);if(error)return error;const c=studyCost(s);s.rp-=c.cost;s.gold-=c.gold;s.activeResearch={kind:'study',word,startedAt:s.time,endsAt:s.time+c.duration};return null}
export const GOALS=[
 {name:'Première étincelle',metric:'dust',target:1,gold:100,rp:2,help:'Posez un extracteur sur ░, puis reliez sa sortie à une presse.',unlock:'Presse à lettres'},
 {name:'L’alphabet s’éveille',metric:'letters',target:1,gold:160,rp:4,help:'3 poussières deviennent une lettre. Les coffres peuvent vendre automatiquement.',unlock:'Assembleur, mélangeur et accents'},
 {name:'Des lettres aux mots',metric:'words',target:250,gold:300,rp:8,help:'Insérez un assembleur après une presse. Le mode brut forme vos premiers mots.',unlock:'Exploration lexicale et logistique'},
 {name:'Le goût du sens',metric:'validWords',target:100,gold:500,rp:10,help:'Explorez les mots bruts ou étudiez des mots au laboratoire, puis recherchez Recettes mémorisées et Alphabet dirigé.',unlock:'Toute la chaîne de phrases'},
 {name:'Une usine qui écrit',metric:'sentences',target:10,gold:800,rp:12,help:'Composeur → espaceur → majuscule → ponctuation → validateur → archives.',unlock:'Logistique avancée et syntaxe'},
 {name:'La petite imprimerie',metric:'sentences',target:100,gold:1200,rp:20,help:'Automatisez la vente des archives pour ne plus arrêter la chaîne.',unlock:'Moteur de langage'},
 {name:'Une phrase de 500 caractères',metric:'record',target:500,gold:1500,rp:20,help:'Allongez la cible du composeur ou combinez des phrases déjà produites.',unlock:'Prochain record : 1 000 caractères'},
 {name:'Une phrase de 1 000 caractères',metric:'record',target:1000,gold:2500,rp:25,help:'Les archives en mode Transmettre permettent d’alimenter un deuxième composeur.',unlock:'Prochain record : 5 000 caractères'},
 {name:'Une phrase de 5 000 caractères',metric:'record',target:5000,gold:5000,rp:40,help:'Augmentez le nombre de mots et diversifiez vos lignes de production.',unlock:'Prochain record : 10 000 caractères'},
 {name:'Dix mille signes',metric:'record',target:10000,gold:10000,rp:50,help:'Optimisez les apports et les stocks pour atteindre 20 000 caractères.',unlock:'Dernier défi : 20 000 caractères'},
 {name:'La grande œuvre',metric:'record',target:20000,gold:20000,rp:80,help:'Le record local est à sa limite. Améliorez sa diversité et son temps de fabrication.',unlock:'Collection et optimisation libres'}
];
export const ACHIEVEMENTS=[
 {id:'industrialAlphabet',name:'Un million de signes',metric:'letters',target:1000000,rp:80},
 {id:'lexicalCollection',name:'Bibliothèque vivante',metric:'discovered',target:60,rp:60},
 {id:'artisanWords',name:'Le sens en série',metric:'validWords',target:10000,rp:75},
 {id:'printingHouse',name:'Grande imprimerie',metric:'sentences',target:1000,rp:100},
 {id:'epic',name:'Épopée',metric:'recordWords',target:1000,rp:120},
 {id:'masterpiece',name:'La grande œuvre',metric:'record',target:20000,rp:200}
];
export function unlocked(s,type){if(s.unlocks.includes(type))return true;const seen=s.encounters||{};if(type==='filter')return s.tier>=3&&!!seen.missingLetter;if(type==='buffer')return s.tier>=3&&!!seen.starved;if(type==='recycler')return s.tier>=3&&!!seen.surplus;if(['splitter','merger','priority','overflow','fastbelt'].includes(type))return s.research.includes('routing')&&!!seen.blockedOutput;return TYPES[type].tier<=s.tier}
export function unlockReason(s,type){const seen=s.encounters||{};if(type==='filter'&&!seen.missingLetter)return'Identifiez une lettre manquante dans une recette.';if(type==='buffer'&&!seen.starved)return'Une machine doit attendre des ressources.';if(type==='recycler'&&!seen.surplus)return'Accumulez des lettres inutilisées dans un assembleur.';if(TYPES[type].tier===5&&!seen.blockedOutput)return'Repérez une sortie bloquée.';if(TYPES[type].tier===5&&!s.research.includes('routing'))return'Recherchez Lignes intelligentes.';return'Atteignez le palier '+TYPES[type].tier+'.'}
export function metric(s,key){return key==='record'?s.record?.chars||0:key==='recordWords'?s.record?.words||0:key==='discovered'?s.discovered.length:s.counts[key]||0}

export function progression(s){advanceResearch(s);const earned=Math.floor(s.counts.words/100)+Math.floor(s.counts.validWords/50)+Math.floor(s.counts.sentences/10);s.researchCredits??=0;if(earned>s.researchCredits){s.rp+=earned-s.researchCredits;s.researchCredits=earned;}while(s.goal<GOALS.length&&metric(s,GOALS[s.goal].metric)>=GOALS[s.goal].target){const g=GOALS[s.goal];s.gold+=g.gold;s.rp+=g.rp;s.goal++;s.tier=Math.max(s.tier,Math.min(7,s.goal));emit(s,'OBJECTIVE_COMPLETED',{title:g.name,text:`+${g.gold} or · +${g.rp} recherche`})}for(const a of ACHIEVEMENTS)if(!s.achievements.includes(a.id)&&metric(s,a.metric)>=a.target){s.achievements.push(a.id);s.rp+=a.rp;emit(s,'ACHIEVEMENT',{title:a.name,text:`+${a.rp} recherche`})}}
export function buyResearch(s,id){const r=RESEARCH.find(r=>r.id===id),error=researchIssue(s,r);if(error)return error;s.rp-=r.cost;s.gold-=r.gold;s.activeResearch={kind:'research',id,startedAt:s.time,endsAt:s.time+r.duration};emit(s,'RESEARCH_STARTED',{title:r.name,text:'Recherche en cours : '+Math.ceil(r.duration/60)+' min simulées.'});return null}
