import {test,strict as assert} from "node:test";
test("username normalization",()=>assert.equal("محمد! Test".toLowerCase().replace(/[^a-z0-9_-]/g,""),"test"));
test("supported templates",()=>assert.deepEqual([1,2,3,4,5,6,7,8].map(Number),Array.from({length:8},(_,i)=>i+1)));
