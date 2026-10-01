import {offline} from './engine.js';
self.onmessage=({data})=>{try{const report=offline(data.state,data.seconds);data.state.savedAt=Date.now();self.postMessage({state:data.state,report})}catch(e){self.postMessage({error:e.message})}};
