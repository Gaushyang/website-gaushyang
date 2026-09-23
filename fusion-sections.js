document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const hero = document.querySelector('.signal-hero');
  const names = [
    ['.signal-hero','00 / TOP'], ['#company','01 / COMPANY'], ['#solutions','02 / SOLUTIONS'],
    ['#process','03 / PROCESS'], ['#strength','04 / STRENGTH'], ['#careers','05 / CAREERS'],
    ['#about','06 / JOURNEY'], ['#contact','07 / CONTACT']
  ];
  const sections = names.map(([selector,label]) => ({element:document.querySelector(selector),label})).filter(item=>item.element);
  const rail = document.createElement('div');
  rail.className = 'fusion-scroll'; rail.setAttribute('aria-hidden','true');
  rail.innerHTML = '<span>00 / TOP</span>';
  body.append(rail);
  sections.forEach(({element,label}) => {
    if (element === hero) return;
    const index = document.createElement('span');
    index.className = 'fusion-section-label'; index.setAttribute('aria-hidden','true');
    index.textContent = label; element.append(index);
  });
  const image = document.querySelector('.company-landscape');
  if (image) new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { image.classList.add('fusion-seen'); entries[0].target.dataset.seen='true'; }
  },{threshold:.12}).observe(image);
  const steps = [...document.querySelectorAll('#process .process-step')];
  let scheduled = false;
  function renderScroll() {
    scheduled = false;
    const total = Math.max(1,document.documentElement.scrollHeight-innerHeight);
    body.style.setProperty('--page-progress',Math.max(0,Math.min(1,scrollY/total)).toFixed(3));
    let current=sections[0];
    for (const item of sections) if (item.element.getBoundingClientRect().top <= innerHeight*.45) current=item;
    rail.querySelector('span').textContent=current.label;
    const processRect=document.querySelector('#process').getBoundingClientRect();
    if (processRect.top < innerHeight && processRect.bottom > 0) {
      const p=Math.max(0,Math.min(1,(innerHeight*.7-processRect.top)/Math.max(1,processRect.height*.65)));
      const active=Math.min(steps.length-1,Math.floor(p*steps.length));
      steps.forEach((step,i)=>{step.classList.toggle('fusion-active',i===active);step.style.setProperty('--step-fill',i<=active?'100%':'0%');});
    }
  }
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(renderScroll)}},{passive:true});
  addEventListener('resize',renderScroll,{passive:true});
  renderScroll();

});
