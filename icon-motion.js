document.addEventListener('DOMContentLoaded',()=>{
  const additional=[
    ['天線校準','依站點條件調整天線方向與角度。','<path d="M12 50h40M32 50V33M22 34l10-24 10 24zM12 17c-6 8-6 20 0 28M52 17c6 8 6 20 0 28"/>'],
    ['頻譜分析','檢視頻段與干擾，支援網路品質判讀。','<path d="M8 52V12M8 52h48M14 42h5V29h5v13h5V18h5v24h5V24h5v18h5V13h5v29"/>'],
    ['光纖熔接','完成纖芯連接並確認傳輸品質。','<path d="M7 27h17l8 5 8-5h17M7 37h17l8-5 8 5h17M26 16l6 10 6-10M26 48l6-10 6 10"/>'],
    ['路由規劃','讓線路、點位與施工動線清楚可執行。','<path d="M9 49h17V33h13V16h16M48 9l7 7-7 7"/><circle cx="9" cy="49" r="4"/>'],
    ['設備整合','串接不同系統設備與現場介面。','<path d="M8 17h14v14H8zM42 17h14v14H42zM25 41h14v14H25zM22 24h20M15 31v17h10M49 31v17H39"/>'],
    ['電源備援','為關鍵通訊規劃穩定的電力支援。','<path d="M13 14h38v39H13zM24 8v6M40 8v6M30 23l-6 13h9l-3 10 12-17h-9l3-6"/>'],
    ['電氣安全','落實接地、絕緣與感電預防。','<path d="M32 8v25M20 33h24M24 40h16M28 47h8M18 17l-6 8 6 8M46 17l6 8-6 8"/>'],
    ['高空作業','以防墜與作業檢查守護施工安全。','<path d="M12 55h40M19 55V12h26v43M19 22h26M19 33h26M19 44h26M32 12v43"/><circle cx="32" cy="8" r="3"/>'],
    ['機櫃配線','整理設備端口、線材與識別標籤。','<path d="M10 9h44v46H10zM18 18h28M18 29h28M18 40h28M18 49h10M39 49h7M22 18v31M32 18v31"/>'],
    ['網路監控','持續觀察網路狀態與重要指標。','<path d="M8 13h48v34H8zM24 55h16M32 47v8M14 34h8l5-10 8 17 5-9h10"/>'],
    ['異常排除','定位問題、修正設定並複測。','<path d="M12 12l40 40M52 12L12 52M24 9h16M24 55h16M9 24v16M55 24v16"/><circle cx="32" cy="32" r="8"/>'],
    ['現場會勘','先掌握場域條件，再安排施工方法。','<path d="M32 55s19-17 19-32a19 19 0 1 0-38 0c0 15 19 32 19 32z"/><circle cx="32" cy="24" r="7"/>'],
    ['施工圖面','將點位、路由與設備配置清楚標示。','<path d="M10 10h44v44H10zM19 19h16v13H19zM41 18h7v21h-7zM18 42h18M18 48h30"/>'],
    ['進度控管','讓各階段時程與交付節點可追蹤。','<circle cx="32" cy="32" r="23"/><path d="M32 16v17l12 8M20 8v7M44 8v7"/>'],
    ['品質驗收','依量測結果與紀錄確認工程成果。','<path d="M14 9h28l8 8v38H14zM42 9v10h8M21 34l7 7 15-16M21 48h21"/>'],
    ['終端安裝','完成終端定位、固定與連線測試。','<path d="M14 37a18 18 0 0 0 36 0M32 37v18M20 55h24M14 37l18-25 18 25zM32 7v5"/>'],
    ['偏鄉服務','把工程能力帶到網路較難抵達的地方。','<path d="M7 50l14-21 10 13 9-27 17 35H7zM11 20c6-6 12-6 18 0M15 25c4-4 8-4 12 0"/>'],
    ['離島工程','依地形與交通條件規劃跨海支援。','<path d="M6 42c9-5 18-5 27 0s18 5 25 0M6 51c9-5 18-5 27 0s18 5 25 0M19 33l13-22 13 22H19z"/>'],
    ['衛星鏈路','建立地面終端與衛星間的訊號路徑。','<path d="M10 51h24M22 51V38l-10-9 17-17 10 10-17 17M37 10l8 8M44 5l15 15M40 32c5 0 9 4 9 9M40 38c2 0 3 1 3 3"/>'],
    ['資料中心','整合機房資源與通訊設備介面。','<path d="M9 9h46v46H9zM18 18h28v10H18zM18 35h28v10H18zM23 23h2M23 40h2M33 23h9M33 40h9"/>'],
    ['微型基地台','因應密集場域補足涵蓋與容量。','<path d="M24 54h16M32 54V29M26 29h12l-6-16zM17 20c-5 6-5 16 0 22M47 20c5 6 5 16 0 22M11 14c-8 10-8 25 0 35M53 14c8 10 8 25 0 35"/>'],
    ['專網建置','依場域需求規劃獨立且可管理的連線。','<path d="M12 14h40v36H12zM20 24h24M20 32h24M20 40h12M37 45l6 6 10-12"/>'],
    ['緊急搶修','快速調度人員與設備，恢復關鍵通訊。','<path d="M19 11h26v42H19zM25 18h14M25 46h14M32 26v13M26 32h12M9 22h8M47 22h8"/>'],
    ['通訊備援','規劃替代路徑，提升系統韌性。','<path d="M10 24h30l-8-8M40 24l-8 8M54 40H24l8-8M24 40l8 8M10 24v16M54 24v16"/>'],
    ['環境監測','掌握機房環境與設備運作條件。','<path d="M13 48h38M21 42V18h22v24M29 18V9h6v9M27 33h10M32 27v12M17 48v7M47 48v7"/>'],
    ['人員訓練','以現場安全與技術養成支持工程團隊。','<circle cx="21" cy="24" r="7"/><circle cx="43" cy="24" r="7"/><path d="M8 50c2-10 8-15 13-15s11 5 13 15M30 50c2-10 8-15 13-15s11 5 13 15"/>'],
    ['文件歸檔','保存施工、測試與驗收資料，方便追溯。','<path d="M9 18h20l5 6h21v29H9zM9 18v-7h21M18 36h28M18 43h19"/>'],
    ['服務諮詢','從需求討論開始，確認最適合的工程解法。','<path d="M11 12h42v31H29L17 54V43h-6zM22 23h20M22 31h14"/>']
  ];
  const grid=document.querySelector('.icon-grid');
  additional.forEach(([name,description,icon],i)=>{
    const tile=document.createElement('button');
    tile.className='icon-tile';tile.type='button';tile.dataset.title=name;tile.dataset.detail=description;
    tile.setAttribute('aria-pressed','false');
    tile.innerHTML=`<svg viewBox="0 0 64 64" aria-hidden="true">${icon}</svg><span>${name}</span><small>${String(i+13).padStart(2,'0')}</small>`;
    grid.append(tile);
  });
  const tiles=[...document.querySelectorAll('.icon-tile')];
  const title=document.querySelector('#readout-title');
  const detail=document.querySelector('#readout-detail');
  const index=document.querySelector('#readout-index');
  const location=document.querySelector('#readout-location');
  const toggle=document.querySelector('#motion-toggle');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let current=0,paused=false,timer;
  const sections=[
    ['關於與經驗','company',[9,17,29,32]],
    ['方案與交付','solutions',[1,2,3,4,6,13,15,18,22,28,34,36]],
    ['工程流程','process',[8,16,20,24,25,26,27]],
    ['安全與品質','strength',[7,10,14,19,23,35,39]],
    ['人才培育','careers',[21,38]],
    ['發展與永續','about',[5,11,12,30,31,33,37]],
    ['聯絡會勘','contact',[40]],
  ];
  for(const tile of tiles){
    tile.querySelectorAll('path,circle,rect,polyline,polygon,line').forEach((shape,i)=>{
      const length=shape.getTotalLength?.()||100;
      shape.classList.add('draw');
      shape.style.setProperty('--path-length',`${Math.ceil(length+2)}px`);
      shape.style.setProperty('--draw-delay',`${Math.min(i*35,175)}ms`);
    });
  }
  function select(next){
    current=next;
    tiles.forEach((tile,i)=>{
      const active=i===next;
      tile.classList.toggle('is-active',active);
      tile.setAttribute('aria-pressed',String(active));
      tile.classList.remove('is-drawing');
      if(active&&!reduce.matches){void tile.offsetWidth;tile.classList.add('is-drawing')}
    });
    const tile=tiles[next];
    index.textContent=`${String(next+1).padStart(2,'0')} / ${String(tiles.length).padStart(2,'0')}`;
    title.textContent=tile.dataset.title;
    detail.textContent=tile.dataset.detail;
    const area=sections.find(([, ,ids])=>ids.includes(next+1));
    if(area){location.textContent=`配置位置：${area[0]} ↗`;location.href=`./#${area[1]}`}
  }
  function schedule(){
    clearTimeout(timer);
    if(!paused&&!reduce.matches)timer=setTimeout(()=>{select((current+1)%tiles.length);schedule()},2400);
  }
  tiles.forEach((tile,i)=>tile.addEventListener('click',()=>{
    select(i);
    paused=true;
    toggle.setAttribute('aria-pressed','true');
    toggle.innerHTML='繼續輪播 <span aria-hidden="true">▶</span>';
    schedule();
  }));
  toggle.addEventListener('click',()=>{
    paused=!paused;
    toggle.setAttribute('aria-pressed',String(paused));
    toggle.innerHTML=paused?'繼續輪播 <span aria-hidden="true">▶</span>':'暫停輪播 <span aria-hidden="true">Ⅱ</span>';
    schedule();
  });
  reduce.addEventListener('change',schedule);
  select(0);schedule();
});
