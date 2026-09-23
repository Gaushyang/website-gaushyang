document.addEventListener('DOMContentLoaded',()=>{
  const section=document.querySelector('.partner-section');
  const stage=section?.querySelector('.partner-stage');
  const cards=[...(section?.querySelectorAll('.partner-card')||[])];
  const readout=section?.querySelector('.partner-readout');
  if(!section||!stage||!cards.length||!readout)return;
  const count=readout.querySelector('.partner-readout-count');
  const title=readout.querySelector('strong');
  const setActive=index=>{
    const card=cards[index];
    cards.forEach((item,i)=>{item.classList.toggle('is-selected',i===index);item.setAttribute('aria-pressed',String(i===index));});
    stage.style.setProperty('--partner-glow-x',`${10+index*20}%`);
    count.textContent=`${String(index+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
    title.textContent=card.dataset.label;
    readout.classList.remove('is-changing');
    void readout.offsetWidth;
    readout.classList.add('is-changing');
  };
  cards.forEach((card,index)=>card.addEventListener('click',()=>setActive(index)));
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting){section.classList.add('partner-visible');observer.disconnect();}
    },{threshold:.18});
    observer.observe(section);
  }else section.classList.add('partner-visible');
});
