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
import {PillTab,PillTabs,MultiSelect,AreaChart,MetricTile} from ${JSON.stringify(bundle)};
function App(){const [tab,setTab]=React.useState(0);return <main style={{padding:16,maxWidth:1160,margin:'auto',display:'grid',gap:24}}>
 <PillTabs id="tabs" aria-label="Metrics">{['First','Second','Third'].map((label,i)=><PillTab key={label} selected={tab===i} onClick={()=>setTab(i)}>{label}</PillTab>)}</PillTabs>
 <PillTabs id="full" fullWidth><PillTab selected>One</PillTab><PillTab>Two</PillTab><PillTab>Three</PillTab></PillTabs>
 <PillTabs id="nav" navigation aria-label="Pages"><PillTab asChild selected><a href="#first">Page first</a></PillTab><PillTab asChild><a href="#second">Page second</a></PillTab></PillTabs>
 <PillTabs id="scroll">{Array.from({length:10},(_,i)=><PillTab key={i}>Long section {i}</PillTab>)}</PillTabs>
 <form id="form"><MultiSelect label="Icon choices" name="choices" searchable options={[{value:'a',label:'Alpha',icon:<span data-icon="a">A</span>},{value:'b',label:'Beta',icon:<span data-icon="b">B</span>},{value:'c',label:'Gamma'}]}/></form>
 <section id="plain"><MultiSelect label="Plain choices" options={[{value:'a',label:'Alpha'},{value:'b',label:'Beta'}]} defaultValue={['a']}/></section>
 <section id="area"><AreaChart label="Area interaction" comparison showExtrema data={[{label:'A',value:10,previousValue:5},{label:'B',value:null,previousValue:0},{label:'C',value:0,previousValue:null},{label:'D',value:30,previousValue:15}]}/></section>
 {['standalone','embedded'].map(context=><section key={context} id={context} style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',alignItems:'start',gap:16}}><MetricTile label="Revenue" value={123} context={context} help="About revenue" selected onActivate={()=>{}} caption="Previous period" trend={{direction:'up',value:'12%',evaluation:'neutral'}}/><MetricTile label="Revenue" value={123} context={context} caption="Previous period"/><MetricTile label="Very long metric label that wraps several times" value={123} context={context} help="About long metric" caption="Long contextual description that can wrap into two separate lines" trend={{direction:'down',value:'12%',evaluation:'neutral'}}/></section>)}
 </main>}createRoot(document.getElementById('root')).render(<App/>);`;
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
 await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForSelector('#tabs');await page.waitForTimeout(200);
 const prefix=viewport.width+'px ';
 const rail=await page.locator('#tabs').evaluate(n=>{const s=getComputedStyle(n);return{radius:s.borderRadius,padding:s.padding,background:s.backgroundColor}});
 check(prefix+'segmented rail radius12 padding4 muted',rail.radius==='12px'&&rail.padding==='4px'&&rail.background==='rgb(231, 228, 226)',rail);
 const tabStyle=await page.locator('#tabs [role="tab"]').first().evaluate(n=>{const s=getComputedStyle(n);return{radius:s.borderRadius,px:s.paddingLeft,py:s.paddingTop,bg:s.backgroundColor,shadow:s.boxShadow}});
 check(prefix+'segmented selected radius8 padding16x6 white shadow',tabStyle.radius==='8px'&&tabStyle.px==='16px'&&tabStyle.py==='6px'&&tabStyle.bg==='rgb(255, 255, 255)'&&tabStyle.shadow!=='none',tabStyle);
 await page.locator('#tabs [role="tab"]').nth(1).click();check(prefix+'tab selection preserved',await page.locator('#tabs [aria-selected="true"]').textContent()==='Second');
 check(prefix+'navigation current page semantics',await page.locator('#nav').evaluate(n=>n.tagName==='NAV'&&n.querySelector('[aria-current="page"]').tagName==='A'&&!n.querySelector('[role="tab"]')));
 const widths=await page.locator('#full > *').evaluateAll(ns=>ns.map(n=>n.getBoundingClientRect().width));check(prefix+'fullwidth tabs equal',Math.max(...widths)-Math.min(...widths)<1,widths);
 check(prefix+'hug tabs scroll within rail',await page.locator('#scroll').evaluate(n=>n.scrollWidth>n.clientWidth&&getComputedStyle(n).overflowX==='auto'));
 const tab=page.locator('#tabs [role="tab"]').first();await tab.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');check(prefix+'tab keyboard visible focus',await tab.evaluate(n=>n.matches(':focus-visible')&&getComputedStyle(n).outlineWidth==='2px'));
 const trigger=page.locator('#form button[aria-haspopup="listbox"]');await trigger.click();
 check(prefix+'option icons rendered',await page.locator('[role="listbox"] [data-icon]').count()===2);
 await page.getByLabel('Pesquisar opções').fill('Beta');const option=page.getByRole('option',{name:'Beta'});await option.focus();await page.keyboard.press('Enter');
 check(prefix+'single selected trigger icon',await trigger.locator('[data-icon="b"]').count()===1);
 check(prefix+'form hidden value',await page.locator('#form').evaluate(n=>new FormData(n).getAll('choices').join(',')==='b'));
 await page.getByLabel('Pesquisar opções').fill('');await page.getByRole('option',{name:'Todos',exact:true}).focus();await page.keyboard.press('End');check(prefix+'list keyboard End',await page.getByRole('option',{name:'Gamma'}).evaluate(n=>n===document.activeElement));
 await page.keyboard.press('Space');check(prefix+'multiple selections no single icon',await trigger.locator('[data-icon]').count()===0);
 await page.keyboard.press('Escape');await trigger.locator('[aria-label="Limpar seleção"]').click();check(prefix+'clear updates form',await page.locator('#form').evaluate(n=>new FormData(n).getAll('choices').length===0));
 check(prefix+'plain choices backwards compatible',await page.locator('#plain button[aria-haspopup="listbox"]').textContent().then(t=>t.includes('Alpha'))&&await page.locator('#plain [data-icon]').count()===0);
 const area=page.locator('#area');const buckets=area.locator('[role="img"]');await buckets.first().focus();
 check(prefix+'active current point radius4',await area.locator('[data-active-point="current"]').count()===1);
 check(prefix+'active point sizes',await area.locator('[data-active-point="current"]').evaluate(n=>n.getBoundingClientRect().width===8)&&await area.locator('[data-active-point="previous"]').evaluate(n=>n.getBoundingClientRect().width===6));
 check(prefix+'active comparison point radius3',await area.locator('[data-active-point="previous"]').count()===1);
 await page.keyboard.press('ArrowRight');check(prefix+'null current skipped zero previous kept',await area.locator('[data-active-point="current"]').count()===0&&await area.locator('[data-active-point="previous"]').count()===1);
 await page.keyboard.press('ArrowRight');check(prefix+'zero current kept missing previous skipped',await area.locator('[data-active-point="current"]').count()===1&&await area.locator('[data-active-point="previous"]').count()===0);
 await page.keyboard.press('Escape');check(prefix+'guide dismisses with Escape',await area.locator('[data-active-point]').count()===0);
 await buckets.last().hover();check(prefix+'pointer active points',await area.locator('[data-active-point]').count()===2);
 for(const context of ['standalone','embedded']){
 const cells=page.locator('#'+context+' [data-context]');const dims=await cells.evaluateAll(ns=>ns.map(n=>{const s=getComputedStyle(n),r=n.getBoundingClientRect(),badge=n.querySelector('[data-direction]'),br=badge?.getBoundingClientRect();return{height:r.height,width:r.width,bg:s.backgroundColor,borders:[s.borderTopWidth,s.borderRightWidth,s.borderBottomWidth,s.borderLeftWidth],badge:br?{right:r.right-br.right,bottom:r.bottom-br.bottom}:null}}));
 check(prefix+context+'trend does not change height',dims[0].height===dims[1].height,dims);
 check(prefix+context+'trend anchors bottomright',Math.abs(dims[0].badge.right-(context==='standalone'?13:12))<1&&Math.abs(dims[0].badge.bottom-(context==='standalone'?13:12))<1,dims[0]);
 const collisions=await cells.last().evaluate(n=>{const badge=n.querySelector('[data-metric-trend]')?.getBoundingClientRect();if(!badge)return ['missing badge'];const bad=[];for(const el of n.querySelectorAll('button[aria-label],span[id],span.line-clamp-2')){const range=document.createRange();range.selectNodeContents(el);const clip=el.getBoundingClientRect();for(const r of range.getClientRects()){if(r.y>=clip.bottom)continue;if(r.width>0&&r.left<badge.right&&r.right>badge.left&&r.top<badge.bottom&&r.bottom>badge.top)bad.push(el.textContent)}}return bad});
 check(prefix+context+'long content and help avoid trend collision',collisions.length===0,collisions);
 const helpGeometry=await cells.first().evaluate(n=>{const r=n.getBoundingClientRect(),h=n.querySelector('button[aria-label]').getBoundingClientRect(),s=getComputedStyle(n);return{right:r.right-h.right,top:h.top-r.top,border:parseFloat(s.borderTopWidth)}});
 check(prefix+context+'help remains root offset12',Math.abs(helpGeometry.right-12-helpGeometry.border)<1&&Math.abs(helpGeometry.top-12-helpGeometry.border)<1,helpGeometry);


 if(context==='embedded')check(prefix+'issue99 stays fixed',dims[0].bg==='rgb(250, 248, 249)'&&dims[0].borders.every(b=>b==='0px'),dims[0]);
 }
 await page.screenshot({path:path.join(evidence,'corrections-'+viewport.width+'.png'),fullPage:true});
 await page.close();
 }
 check('no browser runtime errors',errors.length===0,errors);
}finally{await browser.close();server.close();}
const receipt={timestamp:new Date().toISOString(),environment:'Desktop Chrome headless; mobile is viewport emulation, no physical device',fixture,checks,passed:checks.filter(c=>c.pass).length,failed:checks.filter(c=>!c.pass),errors};
await writeFile(path.join(evidence,'qa-corrections-browser.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({evidence,passed:receipt.passed,failed:receipt.failed},null,2));
assert.equal(receipt.failed.length,0,'Library corrections browser regressions failed');
