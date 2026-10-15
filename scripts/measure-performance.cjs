const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true}); const rows=[];
 for(const path of ['/en','/ar','/en/projects/salahly','/ar/projects/salahly']) for(let run=1;run<=3;run++){
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true});
 const page=await context.newPage(); const cdp=await context.newCDPSession(page);
 await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
 await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:40,downloadThroughput:2000000,uploadThroughput:1000000});
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await page.addInitScript(()=>{window.__metrics={lcp:0,cls:0};new PerformanceObserver(l=>l.getEntries().forEach(e=>window.__metrics.lcp=e.startTime)).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__metrics.cls+=e.value})).observe({type:'layout-shift',buffered:true});});
 await page.goto(process.argv[2]+path,{waitUntil:'networkidle'}); await page.waitForTimeout(1500);
 const data=await page.evaluate(()=>({lcpMs:Math.round(window.__metrics.lcp),cls:window.__metrics.cls,ttfbMs:Math.round(performance.getEntriesByType('navigation')[0].responseStart),transferredBytes:performance.getEntriesByType('resource').reduce((n,r)=>n+r.transferSize,0),jsBytes:performance.getEntriesByType('resource').filter(r=>r.name.includes('.js')).reduce((n,r)=>n+r.encodedBodySize,0),imageBytes:performance.getEntriesByType('resource').filter(r=>r.name.includes('/images/')||r.name.includes('/_next/image')).reduce((n,r)=>n+r.encodedBodySize,0)}));
 rows.push({path,run,...data});await context.close();}
 await browser.close();fs.writeFileSync(process.argv[3],JSON.stringify({method:'Local production; Chromium mobile 390x844, 4x CPU slowdown, 40ms latency, 2MB/s download, cache disabled, three runs, no scrolling; CLS observed until 1.5s after network idle. Not Lighthouse/CrUX; INP not measured.',rows},null,2));console.log(rows);
})().catch(e=>{console.error(e);process.exit(1)});
