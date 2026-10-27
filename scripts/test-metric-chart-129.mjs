/** Independent Chromium regression checks for MetricChartCard issue 129.
 * Run after build: node scripts/test-metric-chart-129.mjs
 * PLAYWRIGHT_MODULE may point to an installed playwright module, EVIDENCE_DIR to receipts.
 * No dependency installation or package mutation is performed.
 */
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import assert from 'node:assert/strict';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, 'package.json'));
const { build } = require('esbuild');
const playwrightPath = process.env.PLAYWRIGHT_MODULE;
if (!playwrightPath) throw Error('Set PLAYWRIGHT_MODULE to an installed playwright module path');
const { chromium } = await import(playwrightPath);
const fixture = await mkdtemp(path.join(tmpdir(), 'inova-overview-qa-'));
const evidence = process.env.EVIDENCE_DIR ?? path.join(fixture, 'evidence');
await mkdir(evidence, {recursive:true});
const bundle = path.join(root,'dist/index.js');
const baseline=process.env.EXPECT_METRIC_129_BASELINE==='1';
let entryModule=bundle;
if(baseline){
 const legacy=execFileSync('git',['show','v0.14.0:src/components/metric-chart-card.tsx'],{cwd:root,encoding:'utf8'}).replace('"../lib/cn"',JSON.stringify(path.join(root,'src/lib/cn'))).replace('"./metric-tile"',JSON.stringify(path.join(root,'src/components/metric-tile')));
 entryModule=path.join(fixture,'legacy-card.tsx');await writeFile(entryModule,legacy);
}
const source = `import React from 'react';import{createRoot}from'react-dom/client';import{MetricChartCard}from ${JSON.stringify(entryModule)};
window.qa={calls:{}};const counts=${JSON.stringify(baseline?[3,5]:[2,3,4,5,6])};
function App(){return <main style={{padding:16,maxWidth:1160,margin:'auto',display:'grid',gap:24}}>{counts.map(count=><MetricChartCard key={count} id={'card'+count} onActiveMetricChange={id=>qa.calls[count]=id} metrics={Array.from({length:count},(_,i)=>({id:'metric'+i,label:'Metric '+i,value:100+i,help:'Help '+count+' '+i}))}>{id=><output>{id}</output>}</MetricChartCard>)}</main>};createRoot(document.getElementById('root')).render(<App/>);`;
await writeFile(path.join(fixture,'entry.jsx'),source);
await build({entryPoints:[path.join(fixture,'entry.jsx')],outfile:path.join(fixture,'app.js'),bundle:true,format:'iife',jsx:'automatic',nodePaths:[path.join(root,'node_modules')]});
await writeFile(path.join(fixture,'input.css'),`@import "${path.join(root,'node_modules/tailwindcss/index.css')}";
@import "${path.join(root,'dist/theme.css')}";
@source "${path.join(root,'src')}";
@source "${fixture}";
`);
execFileSync(process.execPath,[path.join(root,'node_modules/@tailwindcss/cli/dist/index.mjs'),'-i',path.join(fixture,'input.css'),'-o',path.join(fixture,'app.css')],{cwd:root,stdio:'pipe'});
await writeFile(path.join(fixture,'index.html'),'<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="app.css"></head><body><div id="root"></div><script src="app.js"></script></body></html>');
const server=createServer(async(req,res)=>{try{const name=req.url==='/'?'index.html':req.url.slice(1);res.setHeader('Content-Type',name.endsWith('.css')?'text/css':name.endsWith('.js')?'text/javascript':'text/html');res.end(await readFile(path.join(fixture,name)));}catch{res.statusCode=404;res.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({channel:'chrome',headless:true});
const checks=[],errors=[];
if(!baseline){
 const ts=require('typescript');const typeFixture=path.join(fixture,'tuple-types.ts');
 await writeFile(typeFixture,`import type {MetricChartMetrics} from ${JSON.stringify(path.join(root,'dist/index'))};\nconst m={id:'metric',label:'Metric',value:1};\n${[2,3,4,5,6].map(n=>'const valid'+n+':MetricChartMetrics=['+Array(n).fill('m').join(',')+'];').join('\n')}\n// @ts-expect-error One metric is outside the supported cardinalities.\nconst invalidOne:MetricChartMetrics=[m];\n// @ts-expect-error Seven metrics are outside the supported cardinalities.\nconst invalidSeven:MetricChartMetrics=[m,m,m,m,m,m,m];\n`);
 const program=ts.createProgram([typeFixture],{noEmit:true,strict:true,skipLibCheck:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler});
 const diagnostics=ts.getPreEmitDiagnostics(program);check('published declarations accept every count2..6 and reject1/7',diagnostics.length===0,diagnostics.map(d=>ts.flattenDiagnosticMessageText(d.messageText,' ')));
}

function check(name,condition,detail){checks.push({name,pass:!!condition,detail});}
try{
 for(const viewport of (baseline?[{width:1440,height:900}]:[{width:390,height:844},{width:1440,height:900}])){
 const page=await browser.newPage({viewport});
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForSelector(baseline?'#card3':'#card2');await page.waitForTimeout(200);
 const prefix=viewport.width+'px ';
 for(const count of (baseline?[3,5]:[2,3,4,5,6])){
 const card=page.locator('#card'+count),rail=card.locator('[role="group"]').first(),cells=card.locator('[data-context="embedded"]');
 const geometry=await rail.evaluate(n=>{const r=n.getBoundingClientRect(),s=getComputedStyle(n);return{width:r.width,x:r.x,right:r.right,display:s.display,columns:s.gridTemplateColumns,overflow:s.overflowX,scrollWidth:n.scrollWidth,clientWidth:n.clientWidth,cells:[...n.querySelectorAll('[data-context]')].map(c=>{const b=c.getBoundingClientRect();return{x:b.x,right:b.right,y:b.y,width:b.width,height:b.height}})}});
 if(baseline){check('0.14.0 '+count+'-metric defect reproduced',count===3?geometry.columns.split(' ').length===4&&geometry.cells.at(-1).right<geometry.right-50:geometry.cells.at(-1).y>geometry.cells[0].y,geometry);continue;}
 check(prefix+count+' correct number of metrics',geometry.cells.length===count,geometry);
 if(viewport.width>=1024){
 check(prefix+count+' equal width desktop columns exactly count',geometry.columns.split(' ').length===count&&geometry.cells.every(c=>Math.abs(c.width-geometry.width/count)<1),geometry);
 check(prefix+count+' all desktop KPIs stay in one row',new Set(geometry.cells.map(c=>c.y)).size===1,geometry);
 check(prefix+count+' no empty desktop track',Math.abs(geometry.cells[0].x-geometry.x)<1&&Math.abs(geometry.cells.at(-1).right-geometry.right)<1,geometry);
 }else{
 check(prefix+count+' mobile horizontal row and overflow policy retained',geometry.display==='flex'&&geometry.overflow==='auto'&&new Set(geometry.cells.map(c=>c.y)).size===1,geometry);
 check(prefix+count+' mobile minimum160 and expected scroll extent',geometry.cells.every(c=>c.width>=160)&&(count===2?geometry.scrollWidth===geometry.clientWidth:geometry.scrollWidth>geometry.clientWidth),geometry);
 }
 await card.scrollIntoViewIfNeeded();
 const first=card.locator('button[aria-pressed]').first();await first.click();check(prefix+count+' first selection drives chart',await card.locator('output').textContent()==='metric0'&&await first.getAttribute('aria-pressed')==='true');
 const pixel=async(edge)=>{const file=path.join(evidence,'corners-'+count+'-'+edge+'-'+viewport.width+'.png');await card.screenshot({path:file});const values=JSON.parse(execFileSync('python3',['-c','from PIL import Image;import json,sys;im=Image.open(sys.argv[1]).convert("RGB");w,h=im.size;e=sys.argv[2];x=4 if e=="first" else w-5;y=20 if e=="first" else w-21;print(json.dumps({"corner":im.getpixel((x,4)),"inside":im.getpixel((y,5))}))',file,edge],{encoding:'utf8'}));check(prefix+count+' '+edge+' selected corner remains clipped',values.inside.join(',')==='250,248,249'&&values.corner.join(',')!=='250,248,249',values);};
 await pixel('first');
 await first.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');const focus=await first.evaluate(n=>({active:n===document.activeElement,visible:n.matches(':focus-visible'),width:getComputedStyle(n).outlineWidth,style:getComputedStyle(n).outlineStyle,offset:getComputedStyle(n).outlineOffset}));check(prefix+count+' independent keyboard focus2px inset preserved',focus.active&&focus.visible&&focus.width==='2px'&&focus.style==='solid'&&focus.offset==='-2px',focus);
 await card.getByRole('button',{name:'Help '+count+' 0',exact:true}).click();check(prefix+count+' help does not change selected metric',await card.locator('output').textContent()==='metric0');await page.keyboard.press('Escape');
 const last=card.locator('button[aria-pressed]').last();await last.click();await rail.evaluate(n=>n.scrollLeft=n.scrollWidth);check(prefix+count+' last selection drives chart and callback',await card.locator('output').textContent()==='metric'+(count-1)&&await page.evaluate(n=>qa.calls[n]==='metric'+(n-1),count));
 if(viewport.width<1024&&count>2)check(prefix+count+' final metric reachable by horizontal scroll',await rail.evaluate(n=>{const a=n.getBoundingClientRect(),b=n.lastElementChild.getBoundingClientRect();return n.scrollLeft>0&&b.right<=a.right+1&&b.left>=a.left-1}));
 if(viewport.width>=1024||count>2)await pixel('last');
 }
 check(prefix+'no document horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:path.join(evidence,(baseline?'baseline-':'fixed-')+viewport.width+'.png'),fullPage:true});
 await page.close();
 }
 check('no browser runtime errors',errors.length===0,errors);
}catch(error){check('QA scenario completed',false,String(error));}finally{await browser.close();server.close();}
const receipt={timestamp:new Date().toISOString(),mode:baseline?'0.14.0 expected defect reproduction':'fixed 0.14.1 candidate',environment:'Desktop Chrome headless; mobile is viewport emulation, no physical device',fixture,checks,passed:checks.filter(c=>c.pass).length,failed:checks.filter(c=>!c.pass),errors};
await writeFile(path.join(evidence,'qa-metric-chart-129.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({evidence,passed:receipt.passed,failed:receipt.failed},null,2));
assert.equal(receipt.failed.length,0,'MetricChartCard cardinality regression failed');
