/* Live focal typography and signal light over the existing hero background. */
document.addEventListener('DOMContentLoaded',()=>{
  const hero=document.querySelector('.signal-hero');
  const heading=document.getElementById('hero-title');
  const canvas=document.querySelector('.signal-field');
  if(!hero||!heading||!canvas)return;
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const original=heading.textContent.replace(/\s+/g,'').trim();
  heading.setAttribute('aria-label',original);
  const fragment=document.createDocumentFragment();
  for(const lineText of ['連結地面，','延伸可能。']){
    const line=document.createElement('span');line.className='focus-line';line.setAttribute('aria-hidden','true');
    for(const char of lineText){const letter=document.createElement('span');letter.className='focus-letter';letter.textContent=char;line.append(letter)}
    fragment.append(line);
  }
  heading.replaceChildren(fragment);
  const letters=[...heading.querySelectorAll('.focus-letter')];
  let w=1,h=1,scale=1,clock=0,last=0,frame=0,visible=true,pointer=.5,smooth=.5,scrollFrame=0;
  const active=()=>visible&&!document.hidden&&!reduce.matches;
  function resize(){const rect=hero.getBoundingClientRect();w=rect.width;h=rect.height;scale=Math.min(devicePixelRatio||1,1.5)*.65;canvas.width=Math.ceil(w*scale);canvas.height=Math.ceil(h*scale);ctx.setTransform(scale,0,0,scale,0,0);draw()}
  function glow(x,y,r,stops){const gradient=ctx.createRadialGradient(x,y,0,x,y,r);for(const [point,color] of stops)gradient.addColorStop(point,color);ctx.fillStyle=gradient;ctx.fillRect(0,0,w,h)}
  function draw(){ctx.clearRect(0,0,w,h);const moving=!reduce.matches,phase=moving?clock*.00038:0,drift=Math.sin(phase)*w*.11;
    glow(w*(.56+(smooth-.5)*.13)+drift,h*.64,Math.max(w*.54,h*.5),[[0,'#4cc4ff30'],[.35,'#1789ff21'],[1,'#1789ff00']]);
    glow(w*.8-drift*.8,h*.95,Math.max(w*.48,h*.52),[[0,'#c8eeff2b'],[.55,'#2a9dff13'],[1,'#2a9dff00']]);
    ctx.save();ctx.globalCompositeOperation='screen';for(let j=0;j<3;j++){ctx.beginPath();const shift=Math.sin(phase+j*.85)*h*.025;ctx.moveTo(-w*.1,h*(.96+j*.027)+shift);ctx.bezierCurveTo(w*.18,h*.75+shift,w*.55,h*.48+shift,w*1.1,h*(.36+j*.022)+shift);ctx.strokeStyle=['#80d9ff26','#dcf5ff4a','#168cff3d'][j];ctx.lineWidth=j===1?2.2:1.3;ctx.shadowColor='#7bd5ff';ctx.shadowBlur=14;ctx.stroke()}ctx.restore();
    const focus=moving?(Math.sin(clock*.0008-1.2)*.5+.5)*(letters.length-1):letters.length/2;
    letters.forEach((letter,i)=>{const distance=Math.abs(i-focus),limit=w<640?2.8:6;letter.style.filter=moving?`blur(${Math.min(limit,Math.max(0,distance-1.1)*1.4).toFixed(2)}px)`:'none';letter.style.opacity=moving?String(Math.max(w<640?.82:.7,1-distance*.035)):'1'});
  }
  function tick(now){frame=0;if(!active())return;clock+=last?Math.min(now-last,80):0;last=now;smooth+=(pointer-smooth)*.035;draw();frame=requestAnimationFrame(tick)}
  function updateScroll(){scrollFrame=0;if(reduce.matches)return;const rect=hero.getBoundingClientRect(),progress=Math.max(0,Math.min(1,-rect.top/Math.max(1,rect.height)));const layout=hero.querySelector('.hero-layout');layout.style.transform=`translateY(${-progress*75}px) scale(${1-progress*.07})`;layout.style.opacity=String(1-progress*.7)}
  function sync(){cancelAnimationFrame(frame);frame=0;last=0;hero.classList.toggle('motion-paused',reduce.matches);draw();if(active())frame=requestAnimationFrame(tick)}
  reduce.addEventListener('change',()=>{sync();updateScroll()});document.addEventListener('visibilitychange',sync);
  hero.addEventListener('pointermove',event=>{if(matchMedia('(pointer:fine)').matches)pointer=(event.clientX-hero.getBoundingClientRect().left)/w},{passive:true});hero.addEventListener('pointerleave',()=>pointer=.5);
  window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll)},{passive:true});
  new ResizeObserver(resize).observe(hero);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()}).observe(hero);
  resize();updateScroll();sync();

  const targets=[...document.querySelectorAll('.signal-proof,.company-landscape,.intro-grid > div,.section-heading,.solution-card,.process-steps,.process-step,.capability,.career-pillar,.timeline article,.sustainability-grid,.contact-inner')];
  if(!reduce.matches){document.body.classList.add('motion-enabled');targets.forEach((el,index)=>{if(el.matches('.signal-proof,.process-steps'))return;el.classList.add('motion-reveal');if(el.matches('.solution-card,.process-step,.timeline article'))el.style.setProperty('--motion-delay',`${index%5*70}ms`)})}
  const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;entry.target.classList.add('is-visible');observer.unobserve(entry.target)}},{threshold:.06,rootMargin:'0px 0px -8% 0px'});
  targets.forEach(el=>observer.observe(el));
});
