document.addEventListener('DOMContentLoaded', async () => {
  const marks = [];
  const icon = id => {
    const mark = document.createElement('span');
    mark.className = 'site-icon-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.innerHTML = `<svg viewBox="0 0 64 64"><use href="icons-sprite.svg#icon-${String(id).padStart(2, '0')}"></use></svg>`;
    mark.dataset.iconId = id;
    marks.push(mark);
    return mark;
  };
  const inline = [
    ['.intro-highlights .highlight-item:nth-child(1)',17],
    ['.intro-highlights .highlight-item:nth-child(2)',9],
    ['.intro-highlights .highlight-item:nth-child(3)',32],
    ['#project-ran',1],['#solution-optimization',2],['#project-das',4],
    ['#project-satellite',3],['#project-cran',6],
    ['#process .process-step:nth-child(1)',24],['#process .process-step:nth-child(2)',25],
    ['#process .process-step:nth-child(3)',20],['#process .process-step:nth-child(4)',8],
    ['#process .process-step:nth-child(5)',27],
    ['#strength .capability:nth-child(1)',7],['#strength .capability:nth-child(2)',14],
    ['#strength .capability:nth-child(3)',39],['#strength .capability:nth-child(4)',35],
    ['#strength .capability:nth-child(5)',19],
    ['#careers .career-pillar:nth-child(1)',38],['#careers .career-pillar:nth-child(2)',21],
    ['#about .timeline article:nth-child(1)',11],['#about .timeline article:nth-child(2)',5],
    ['#about .timeline article:nth-child(3)',33],['#about .timeline article:nth-child(4)',31],
    ['#sustainability .sustainability-tags li:nth-child(1)',12],
    ['#sustainability .sustainability-tags li:nth-child(2)',37],
    ['#sustainability .sustainability-tags li:nth-child(3)',30],
    ['#contact .contact-actions .button',40],
  ];
  for (const [selector,id] of inline) {
    const target=document.querySelector(selector);
    if (!target) continue;
    const heading=target.matches('.capability,.career-pillar,.timeline article') ? target.querySelector('h3') : null;
    (heading||target).prepend(icon(id));
  }
  const groups = [
    ['#company .intro-highlights','延伸服務',[[29,'偏鄉服務']]],
    ['#solutions .solution-grid','方案相關能力',[[13,'天線校準'],[15,'光纖熔接'],[18,'電源備援'],[22,'網路監控'],[28,'終端安裝'],[34,'專網建置'],[36,'通訊備援']]],
    ['#process .process-steps','流程輔助項目',[[16,'路由規劃'],[26,'進度控管']]],
    ['#strength .capability-list','品質支援',[[10,'工程交付'],[23,'異常排除']]],
  ];
  for (const [selector,label,items] of groups) {
    const target=document.querySelector(selector);
    if (!target) continue;
    const ribbon=document.createElement('div');
    ribbon.className='site-icon-ribbon';
    const heading=document.createElement('span');
    heading.className='site-icon-ribbon-title';
    heading.textContent=label;
    ribbon.append(heading);
    for(const [id,name] of items){
      const item=document.createElement('span');
      item.className='site-icon-chip';
      item.append(icon(id),document.createTextNode(name));
      ribbon.append(item);
    }
    target.after(ribbon);
  }
  try {
    const response=await fetch('icons-sprite.svg');
    if(!response.ok) return;
    const sprite=new DOMParser().parseFromString(await response.text(),'image/svg+xml');
    for(const mark of marks){
      const source=sprite.getElementById(`icon-${String(mark.dataset.iconId).padStart(2,'0')}`);
      if(!source) continue;
      const svg=mark.querySelector('svg');
      svg.innerHTML=source.innerHTML;
      svg.querySelectorAll('path,circle,rect,line,polyline,polygon').forEach((shape,i)=>{
        const length=shape.getTotalLength?.()||100;
        shape.style.setProperty('--line-length',`${Math.ceil(length+2)}px`);
        shape.style.setProperty('--line-delay',`${Math.min(i*28,140)}ms`);
      });
    }
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        entry.target.classList.add('icon-seen');
        observer.unobserve(entry.target);
      });
    },{threshold:.2});
    marks.forEach(mark=>observer.observe(mark));
  } catch { /* Keep the SVG sprite fallback if enhanced animation is unavailable. */ }
});
