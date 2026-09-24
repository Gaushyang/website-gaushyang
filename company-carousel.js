document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.company-carousel');
  if (!root) return;
  // Scene descriptions are visual context, not claims that each place is a company project.
  const scenes = [
    ['images/hero/cape-of-good-hope.webp','原有影像・風車海岸','從海岸延伸的連結','開闊地形與分散據點，提醒我們每一段連線都要經得起環境考驗。','01','#cce8ff','海岸風車與綠地的空拍畫面'],
    ['background-image/cape of good hope.png','海岸・風力地景','讓基礎建設融入地景','風車、海岸與道路交會，呈現戶外場域多變的工程條件。','04','#d5f3d6','海岸風車與綠地的空拍畫面'],
    ['background-image/dadu road.png','大肚・道路網絡','在城市動線中保持連結','夜間道路像光帶交織，讓移動中的通訊需求更具體。','05','#ffd277','大肚地區夜間道路交會空拍'],
    ['background-image/danshui estuary.png','淡水河口・暮色','連結跨越水岸','河流、城市與山線相接，描繪跨場域網絡的尺度。','09','#ffba91','夕陽下的淡水河口與城市'],
    ['background-image/guo xing.png','國姓・山區道路','穿越複雜地形','高架道路跨過山谷，偏遠場域的連結需要因地制宜。','02','#bce5dd','山區河谷與高架道路'],
    ['background-image/linyuan.png','林園・產業區','回應高密度運作場域','工業區在入夜後仍持續運轉，可靠通訊是協作的底層支撐。','06','#ffd098','夜間林園工業區及道路燈光'],
    ['background-image/mrt tucheng.png','土城・軌道與城市','跟上城市移動節奏','軌道、道路和街廓密集交會，呈現城市場域的多重介面。','11','#ffcf92','土城城市街廓與夜間交通動線'],
    ['background-image/new banqiao.png','新板・城市核心','服務不斷成長的城市','高樓與道路交織的夜景，映照多元室內外通訊情境。','12','#c7bdff','新板特區高樓與街道夜景'],
    ['background-image/no65.png','台 65 線・都會路網','串起移動的每一程','快速道路穿越城市河岸，顯示連線需求不會停在單一據點。','13','#f9c47a','夜間快速道路跨越城市與河岸'],
    ['background-image/northeast corner.png','東北角・海岸暮光','讓遠方仍然清晰可及','海灣與山線在暮光中延伸，提醒我們重視不同地貌的連接。','14','#f6c698','東北角海灣與夕陽山景'],
    ['background-image/opera house.png','城市・文化建築','細緻照顧公共空間','文化場館周圍的住宅與街區，呈現室內外訊號環境的差異。','15','#e0c9a8','城市街廓中的文化建築'],
    ['background-image/phase 7.png','七期・商業街區','在垂直城市中穩定連結','高樓林立的商業街區，讓多樓層、多使用情境的需求並存。','16','#a8d8ff','七期高樓與夜間街道'],
    ['background-image/pingzhen system.png','平鎮・交流路網','連接每一次轉向','交錯匝道像網絡節點，將各個方向匯聚成連續路徑。','17','#ffb4a5','平鎮夜間多層交流道'],
    ['background-image/special zone.png','特區・城市邊界','隨著城市向外延伸','住宅、山線與道路並置，呈現新舊城市邊界的連接需求。','18','#ffc694','夕陽時分的住宅區與山線'],
    ['background-image/weiwuying.png','衛武營・公共場域','讓人群自在相聚','大型公共場館與周邊城市的夜景，呈現人群聚集的連線情境。','19','#f5d396','衛武營與周邊城市夜景'],
    ['background-image/background.jpg','星空・通訊塔','讓訊號跨越距離','仰望通訊塔與星空，從地面設施看見更遠的連結想像。','03','#ffc17e','星空下的橘色通訊塔與碟型天線']
  ];
  const stage = root.querySelector('.company-carousel-stage');
  const count = root.querySelector('.company-carousel-count');
  const progress = root.querySelector('.company-carousel-progress span');
  const cards = scenes.map((s, i) => {
    const card = document.createElement('article');
    card.className = 'company-scene';
    card.style.setProperty('--scene-accent', s[5]);
    card.setAttribute('aria-label', `${i+1} / ${scenes.length}，${s[1]}`);
    card.innerHTML = `<img src="${s[0]}" alt="${s[6]}" loading="${i ? 'lazy' : 'eager'}" width="1900" height="680"><div class="company-scene-shade"></div><div class="company-scene-top"><span>GAUSHYANG / FIELD NOTES</span><span>${String(i+1).padStart(2,'0')}</span></div><div class="company-scene-copy"><span class="company-scene-icon" aria-hidden="true"><svg viewBox="0 0 64 64"><use href="icons-sprite.svg#icon-${s[4]}"></use></svg></span><p class="company-scene-location">${s[1]}</p><h3>${s[2]}</h3><p class="company-scene-description">${s[3]}</p></div>`;
    stage.append(card);
    return card;
  });
  let active = 0;
  let timer;
  let inView = false;
  const interval = 5500;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function show(index) {
    active = (index + cards.length) % cards.length;
    cards.forEach((card, i) => {
      card.classList.toggle('is-active', i === active);
      card.setAttribute('aria-hidden', i === active ? 'false' : 'true');
      card.inert = i !== active;
    });
    count.textContent = `${String(active+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
    progress.style.width = `${(active+1)/cards.length*100}%`;
    cards[(active+1)%cards.length].querySelector('img').loading = 'eager';
  }
  function schedule() {
    clearTimeout(timer);
    if (inView && !document.hidden && !reducedMotion.matches) {
      timer = setTimeout(() => { show(active+1); schedule(); }, interval);
    }
  }
  function navigate(index) { show(index); schedule(); }
  root.querySelector('.company-carousel-prev').addEventListener('click', () => navigate(active-1));
  root.querySelector('.company-carousel-next').addEventListener('click', () => navigate(active+1));
  root.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); navigate(active + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let touchX = null;
  root.addEventListener('touchstart', event => { touchX = event.changedTouches[0].clientX; }, { passive:true });
  root.addEventListener('touchend', event => {
    if (touchX === null) return;
    const delta = event.changedTouches[0].clientX-touchX;
    if (Math.abs(delta) > 45) navigate(active + (delta < 0 ? 1 : -1));
    touchX = null;
  }, { passive:true });
  show(0);
  new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    schedule();
  }, { threshold: .15 }).observe(root);
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', schedule);
});
