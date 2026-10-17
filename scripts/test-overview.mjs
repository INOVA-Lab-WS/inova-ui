/** Independent Chromium regression checks for the Overview component release.
 * Run after build: node scripts/test-overview.mjs
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
const source = `import React from 'react';
import {createRoot} from 'react-dom/client';
import {MetricTile,TrendBadge,MetricChartCard,AreaChart,BarChart,HorizontalBarChart,ChartTooltip} from ${JSON.stringify(bundle)};
const data=[{label:'A',value:12},{label:'B',value:0},{label:'C',value:28}];
const area=[{label:'01',value:12,previousValue:8},{label:'02',value:null,previousValue:10},{label:'03',value:28,previousValue:null,date:'2026-10-03',previousDate:'2026-09-03'},{label:'04',value:0,previousValue:12}];
const kinds=['up','down','equal'], evaluations=['neutral','favorable','unfavorable'];
function App(){
 const [selected,setSelected]=React.useState(null),[horizontal,setHorizontal]=React.useState(null),[count,setCount]=React.useState(0);
 const metrics=Array.from({length:6},(_,i)=>({id:'k'+i,label:'KPI '+i,value:100+i,help:'Help '+i,caption:'Period',trend:{direction:'up',evaluation:'neutral',value:'12%'}}));
 return <main style={{padding:16,maxWidth:1160,margin:'auto',display:'grid',gap:24}}>
 <div id="legacy"><MetricTile label="Legacy" value={42}/></div>
 <div id="embedded" style={{display:'flex'}}><MetricTile context="embedded" label="Embedded" value={12} help="Independent help" onActivate={()=>setCount(c=>c+1)}/><output id="selections">{count}</output></div>
 <div id="trends">{kinds.flatMap(direction=>evaluations.map(evaluation=><TrendBadge key={direction+evaluation} direction={direction} evaluation={evaluation} value="12%"/>))}</div>
 <MetricChartCard id="card4" metrics={metrics.slice(0,4)} chartLabel="Four metrics chart">{active=><output>{active}</output>}</MetricChartCard>
 <MetricChartCard id="card6" metrics={metrics} chartLabel="Six metrics chart"><AreaChart label="Card area" data={area}/></MetricChartCard>
 <section id="area"><AreaChart label="Comparison area" data={area} comparison/></section>
 <section id="zeros"><AreaChart label="Zero area" data={area.map(d=>({...d,value:0,previousValue:0}))} comparison/></section>
 <section id="missing"><AreaChart label="Missing area" data={area.map(d=>({...d,value:null,previousValue:null}))}/></section>
 <section id="previousonly"><AreaChart label="Only previous measured" data={area.map(d=>({...d,value:null,previousValue:10}))} comparison/></section>
 <section id="negative"><AreaChart label="Negative area" data={[{label:'A',value:-10},{label:'B',value:0},{label:'C',value:5}]}/></section>
 <section id="single"><AreaChart label="Single area" data={[{label:'One',value:10}]}/></section>
 <section id="loading"><AreaChart label="Loading area" data={area} state="loading"/></section>
 <section id="unavailable"><AreaChart label="Unavailable area" data={area} state="unavailable"/></section>
 <section id="vertical"><BarChart label="Vertical ranking" data={data} selectedLabel={selected} onSelectionChange={setSelected}/><output>{selected??'none'}</output></section>
 <section id="horizontal"><HorizontalBarChart label="Horizontal ranking" data={data} selectedLabel={horizontal} onSelectionChange={setHorizontal}/><output>{horizontal??'none'}</output></section>
 <section id="tooltip" style={{position:'relative',height:100}}><ChartTooltip index={0} count={1} title="Nullable tooltip" rows={[{label:'Absent',value:null},{label:'Zero',value:0}]}/></section>
 </main>;
}createRoot(document.getElementById('root')).render(<App/>);`;
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
function check(name,condition,detail){checks.push({name,pass:!!condition,detail});}
try{
 for(const viewport of [{width:390,height:844},{width:1440,height:900}]){
 const page=await browser.newPage({viewport});
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForSelector('#legacy');await page.waitForTimeout(200);
 const prefix=viewport.width+'px ';
 const geometry=await page.evaluate(()=>Object.fromEntries(['legacy','embedded','card4','card6'].map(id=>{const node=document.getElementById(id);const target=id==='legacy'||id==='embedded'?node.firstElementChild:node;const r=target.getBoundingClientRect();return[id,{width:r.width,height:r.height,scrollWidth:target.scrollWidth,clientWidth:target.clientWidth}]})));
 check(prefix+'legacy min-height 136',geometry.legacy.height>=136,geometry.legacy);
 check(prefix+'embedded min-height 96',geometry.embedded.height>=96,geometry.embedded);
 if(viewport.width<1024)check(prefix+'embedded width 160',geometry.embedded.width===160,geometry.embedded);
 check(prefix+'no document horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),geometry);
 for(const id of ['card4','card6']){
 const g=geometry[id];check(prefix+id+' fits page',g.width<=viewport.width-32&&g.scrollWidth<=g.clientWidth+1,g);
 const metrics=page.locator('#'+id+' [data-context="embedded"]');check(prefix+id+' correct metric count',await metrics.count()===(id==='card4'?4:6));
 if(viewport.width>=1024){const ys=await metrics.evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().y));check(prefix+id+' desktop single row',new Set(ys).size===1,ys);}
 }
 await page.locator('#embedded button[aria-label="Independent help"]').click();check(prefix+'help does not select KPI',await page.locator('#selections').textContent()==='0');
 await page.locator('#embedded button[aria-pressed]').click();check(prefix+'KPI selection works',await page.locator('#selections').textContent()==='1');
 await page.locator('#card4 button[aria-pressed]').nth(2).click();check(prefix+'card selection drives render prop',await page.locator('#card4 output').textContent()==='k2');
 const selectedCell=page.locator('#card4 [data-state="selected"]');
 const selectedStyle=await selectedCell.evaluate(n=>{const s=getComputedStyle(n);return {background:s.backgroundColor,borders:[s.borderTopWidth,s.borderRightWidth,s.borderBottomWidth,s.borderLeftWidth],bottomColor:s.borderBottomColor,height:n.getBoundingClientRect().height};});
 const baseline=process.env.EXPECT_METRIC_99_BASELINE==='1';
 check(prefix+'embedded selected background '+(baseline?'baseline':'issue99'),selectedStyle.background===(baseline?'rgb(231, 228, 226)':'rgb(250, 248, 249)'),selectedStyle);
 check(prefix+'embedded selected borders '+(baseline?'baseline':'issue99'),selectedStyle.borders.join(',')===(baseline?'0px,0px,2px,0px':'0px,0px,0px,0px'),selectedStyle);
 if(baseline)check(prefix+'baseline bottom border green',selectedStyle.bottomColor==='rgb(59, 156, 74)',selectedStyle);
 const idleBorders=await page.locator('#card4 [data-context="embedded"]').first().evaluate(n=>{const s=getComputedStyle(n);return[s.borderTopWidth,s.borderRightWidth,s.borderBottomWidth,s.borderLeftWidth]});
 check(prefix+'unselected embedded border reservation '+(baseline?'baseline':'issue99'),idleBorders.join(',')===(baseline?'0px,0px,2px,0px':'0px,0px,0px,0px'),idleBorders);
 const legacyStyle=await page.locator('#legacy > div').evaluate(n=>{const s=getComputedStyle(n);return {border:s.borderTopWidth,height:n.getBoundingClientRect().height}});
 check(prefix+'standalone border and height preserved',legacyStyle.border==='1px'&&legacyStyle.height>=136,legacyStyle);
 const selectionButton=selectedCell.locator('button[aria-pressed]');await selectionButton.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
 const focusStyle=await selectionButton.evaluate(n=>{const s=getComputedStyle(n);return{focusVisible:n.matches(':focus-visible'),outline:s.outlineWidth,style:s.outlineStyle}});
 check(prefix+'keyboard focus independent from selected fill',focusStyle.focusVisible&&focusStyle.outline==='2px'&&focusStyle.style==='solid',focusStyle);
 await page.locator('#card4').screenshot({path:path.join(evidence,'selected-focus-'+viewport.width+'.png')});

 const trend=await page.locator('#trends [data-direction]').evaluateAll(nodes=>nodes.map(n=>({direction:n.dataset.direction,evaluation:n.dataset.evaluation,color:getComputedStyle(n).color,text:n.textContent})));
 check(prefix+'nine independent trend combinations',trend.length===9&&new Set(trend.map(t=>t.evaluation+':'+t.color)).size===3,trend);
 for(const id of ['vertical','horizontal']){
 const buttons=page.locator('#'+id+' [role="button"]');
 await buttons.first().focus();await page.keyboard.press('ArrowRight');check(prefix+id+' ArrowRight focus',await buttons.nth(1).evaluate(n=>document.activeElement===n));
 await page.keyboard.press('End');check(prefix+id+' End focus',await buttons.last().evaluate(n=>document.activeElement===n));
 await page.keyboard.press('Home');check(prefix+id+' Home focus',await buttons.first().evaluate(n=>document.activeElement===n));
 await page.keyboard.press('Enter');check(prefix+id+' Enter selects',await buttons.first().getAttribute('aria-pressed')==='true');
 const before=await page.evaluate(()=>scrollY);await page.keyboard.press('Space');await page.waitForTimeout(120);const after=await page.evaluate(()=>scrollY);
 check(prefix+id+' Space clears',await buttons.first().getAttribute('aria-pressed')==='false');check(prefix+id+' Space prevents scroll',before===after,{before,after});
 await buttons.last().click();check(prefix+id+' click controlled selection',await page.locator('#'+id+' output').textContent()==='C');
 await buttons.last().click();check(prefix+id+' click clear',await page.locator('#'+id+' output').textContent()==='none');
 }
 check(prefix+'nullable tooltip keeps zero',await page.locator('#tooltip').textContent().then(t=>t.includes('Sem medição')&&t.includes('Zero0')));
 check(prefix+'loading semantic status',await page.locator('#loading [aria-busy]').count()>0);
 check(prefix+'all-null no svg',await page.locator('#missing svg').count()===0,await page.locator('#missing').textContent());
 check(prefix+'zero is a measurement',await page.locator('#zeros svg').count()===1);
 check(prefix+'previous-only comparison remains measurable',await page.locator('#previousonly svg').count()===1);
 check(prefix+'negative values finite',await page.locator('#negative path').evaluateAll(ns=>ns.every(n=>!/NaN|Infinity/.test(n.getAttribute('d')))));
 check(prefix+'single point visible',await page.locator('#single .pointer-events-none.absolute.size-1').count()>0);
 check(prefix+'unavailable fallback',await page.locator('#unavailable svg').count()===0,await page.locator('#unavailable').textContent());
 const paths=await page.locator('#area svg path').evaluateAll(nodes=>nodes.map(n=>({d:n.getAttribute('d'),fill:n.getAttribute('fill'),dash:n.getAttribute('stroke-dasharray')})));
 check(prefix+'finite path geometry',paths.length>0&&paths.every(p=>p.d&&!/NaN|Infinity/.test(p.d)),paths);
 check(prefix+'comparison dashed series',paths.some(p=>p.dash),paths);
 check(prefix+'current null gap splits both fill and stroke',paths.filter(p=>p.fill?.startsWith('url')).length===2&&paths.filter(p=>p.fill==='none'&&!p.dash).length===2,paths);
 check(prefix+'previous gap splits comparison independently',paths.filter(p=>p.dash).length===2,paths);
 const points=page.locator('#area [role="img"]');await points.first().focus();await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');
 check(prefix+'area ArrowRight reaches third bucket',await points.nth(2).evaluate(n=>n===document.activeElement));
 const tooltip=await page.locator('#area [role="status"]').textContent();
 check(prefix+'comparison tooltip has dates and missing previous',tooltip.includes('2026-10-03')&&tooltip.includes('2026-09-03')&&tooltip.includes('Sem medição')&&tooltip.includes('28'),tooltip);
 await page.keyboard.press('Escape');check(prefix+'area Escape dismisses tooltip',await page.locator('#area [role="status"]').count()===0);
 await page.keyboard.press('End');check(prefix+'area End focus last bucket',await points.last().evaluate(n=>n===document.activeElement));
 await page.keyboard.press('Home');check(prefix+'area Home focus first bucket',await points.first().evaluate(n=>n===document.activeElement));
 await page.locator('#area').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(evidence,'overview-'+viewport.width+'.png'),fullPage:true});
 await page.close();
 }
 check('no browser runtime errors',errors.length===0,errors);
}finally{await browser.close();server.close();}
const receipt={timestamp:new Date().toISOString(),environment:'Desktop Chrome headless; mobile is viewport emulation, no physical device',fixture,checks,passed:checks.filter(c=>c.pass).length,failed:checks.filter(c=>!c.pass),errors};
await writeFile(path.join(evidence,'qa-browser.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({evidence,passed:receipt.passed,failed:receipt.failed},null,2));
assert.equal(receipt.failed.length,0,'Overview browser regressions failed');
