document.addEventListener('DOMContentLoaded',()=>{
  const section=document.querySelector('.partner-section');
  if(!section)return;
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting){section.classList.add('partner-visible');observer.disconnect();}
    },{threshold:.18});
    observer.observe(section);
  }else section.classList.add('partner-visible');
});
