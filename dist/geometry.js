// Ports are defined on local footprint cells, facing outward; rotation transforms both.
import {TYPES,WIDTH,HEIGHT,DEPOSITS,DIRS} from './entities.js';
const pin=(x,y,side,kind='in',channel='main')=>({x,y,side,kind,channel});
const basicInputs=[pin(0,0,2),pin(0,0,3),pin(0,0,1)];
export const LAYOUTS={
 gold:{w:1,h:1,ports:[]},dust:{w:1,h:1,ports:[pin(0,0,0,'out')]},
 letter:{w:1,h:1,ports:[pin(0,0,2),pin(0,0,0,'out')]},
 word:{w:2,h:1,ports:[pin(0,0,2),pin(0,0,1),pin(1,0,0,'out'),pin(1,0,1,'out','reject')]},
 scanner:{w:2,h:1,ports:[pin(0,0,2),pin(1,0,0,'out'),pin(1,0,1,'out','reject')]},
 buffer:{w:2,h:1,ports:[pin(0,0,2),pin(0,0,3),pin(1,0,0,'out')]},
 recycler:{w:2,h:1,ports:[pin(0,0,2),pin(0,0,3),pin(1,0,0,'out')]},
 phrase:{w:3,h:2,ports:[pin(0,0,2),pin(0,1,2),pin(1,0,3),pin(2,0,0,'out'),pin(2,1,0,'out')]},
 validator:{w:2,h:2,ports:[pin(0,0,2),pin(0,1,2),pin(1,0,0,'out'),pin(1,1,0,'out','reject')]},
 vault:{w:2,h:2,ports:[pin(0,0,2),pin(0,1,2),pin(1,0,3),pin(1,1,0,'out')]},
 merger:{w:2,h:2,ports:[pin(0,0,2),pin(0,1,2),pin(1,0,3),pin(1,0,0,'out')]},
 splitter:{w:2,h:2,ports:[pin(0,0,2),pin(1,0,0,'out'),pin(1,1,1,'out')]},
 filter:{w:1,h:1,ports:[pin(0,0,2),pin(0,0,3),pin(0,0,0,'out'),pin(0,0,1,'out','other')]},
 priority:{w:2,h:1,ports:[pin(0,0,2),pin(1,0,0,'out'),pin(1,0,1,'out')]},
 overflow:{w:2,h:1,ports:[pin(0,0,2),pin(1,0,0,'out'),pin(1,0,1,'out')]},
 chest:{w:1,h:1,ports:[...basicInputs,pin(0,0,0),pin(0,0,0,'out')]}
};
const normal={w:1,h:1,ports:[...basicInputs,pin(0,0,0,'out')]};
export function layout(m){if(!m.legacyCompact)return LAYOUTS[m.type]||normal;const inputs=['gold','dust'].includes(m.type)?[]:['chest','vault'].includes(m.type)?[...basicInputs,pin(0,0,0)]:basicInputs;const outputs=m.type==='gold'?[]:[pin(0,0,0,'out')];if(['word','scanner','validator'].includes(m.type))outputs.push(pin(0,0,1,'out','reject'));if(['splitter','priority','overflow','filter'].includes(m.type))outputs.push(pin(0,0,1,'out',m.type==='filter'?'other':'main'));return{w:1,h:1,ports:[...inputs,...outputs]}}
export function footprint(m){const {w,h}=layout(m);return m.dir%2?{w:h,h:w}:{w,h}}
export function cells(m){const {w,h}=footprint(m),list=[];for(let y=0;y<h;y++)for(let x=0;x<w;x++)list.push({x:m.x+x,y:m.y+y});return list}
export function ports(m){const l=layout(m);return l.ports.map(p=>{let{x,y}=p;if(m.dir===1)[x,y]=[l.h-1-y,x];if(m.dir===2)[x,y]=[l.w-1-x,l.h-1-y];if(m.dir===3)[x,y]=[y,l.w-1-x];return{...p,x:x+m.x,y:y+m.y,side:(p.side+m.dir)%4}})}
export const machineAt=(s,x,y)=>s.machines.find(m=>{const f=footprint(m);return x>=m.x&&y>=m.y&&x<m.x+f.w&&y<m.y+f.h});
export const gridFor=s=>new Map(s.machines.flatMap(m=>cells(m).map(p=>[p.x+','+p.y,m])));
export function geometryIssue(s,m,ignoreId=null){for(const p of cells(m)){if(p.x<0||p.y<0||p.x>=WIDTH||p.y>=HEIGHT)return'Le bâtiment dépasse le terrain.';const occupant=machineAt(s,p.x,p.y);if(occupant&&occupant.id!==ignoreId)return'Une case de l’emprise est occupée.';const d=DEPOSITS.find(d=>d.x===p.x&&d.y===p.y);if(['gold','dust'].includes(m.type)?d?.t!==m.type:!!d)return'Le gisement doit recevoir son extracteur ; libérez toute l’emprise.'}return''}
export function connection(s,port,grid=gridFor(s)){const [dx,dy]=DIRS[port.side],x=port.x+dx,y=port.y+dy,n=grid.get(x+','+y);if(!n)return{machine:null,connected:false};return{machine:n,connected:ports(n).some(p=>p.kind==='in'&&p.x===x&&p.y===y&&p.side===(port.side+2)%4)}}
