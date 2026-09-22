document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. 導覽列滾動狀態
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // 2. 行動版選單開關
  toggle?.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-label', open ? '關閉導覽選單' : '開啟導覽選單');
    if (open) requestAnimationFrame(() => nav.querySelector('a')?.focus());
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav?.classList.contains('open')) {
      nav.classList.remove('open');
      toggle?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      toggle?.setAttribute('aria-label', '開啟導覽選單');
      document.body.classList.remove('menu-open');
      toggle?.focus();
    }
  });

  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', '開啟導覽選單');
    document.body.classList.remove('menu-open');
  }));

  // 站內錨點維持平滑捲動，歷史返回則由瀏覽器立即還原原位置。
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      const scrollBehavior = reduceMotion ? 'auto' : 'smooth';
      if (hash === '#top') window.scrollTo({ top: 0, left: 0, behavior: scrollBehavior });
      else target.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
      if (window.location.hash !== hash) history.pushState(null, '', hash);
    });
  });

  // 3. 英雄首頁背景輪播（預載完成後每 6 秒切換）
  const hero = document.querySelector('.hero-media');
  const heroImages = [
    'images/hero/cape-of-good-hope.webp',
    'images/hero/dadu-road.webp',
    'images/hero/danshui-estuary.webp',
    'images/hero/guo-xing.webp',
    'images/hero/linyuan.webp',
    'images/hero/mrt-tucheng.webp',
    'images/hero/new-banqiao.webp',
    'images/hero/no65.webp',
    'images/hero/northeast-corner.webp',
    'images/hero/opera-house.webp',
    'images/hero/phase-7.webp',
    'images/hero/pingzhen-system.webp',
    'images/hero/special-zone.webp',
    'images/hero/weiwuying.webp',
    'images/hero/background.webp'
  ];
  let heroIndex = 0;

  const preloadHeroImage = (src) => new Promise((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      if (typeof image.decode === 'function') {
        image.decode().catch(() => {}).finally(resolve);
      } else {
        resolve();
      }
    };
    image.onerror = resolve;
    image.src = src;
  });

  if (hero) {
    hero.style.setProperty('--hero-image', `url("${heroImages[0]}")`);
    if (!reduceMotion && heroImages.length > 1) {
      Promise.all(heroImages.slice(1).map(preloadHeroImage)).then(() => {
        const heroTimer = setInterval(() => {
          heroIndex += 1;
          hero.style.setProperty('--hero-image', `url("${heroImages[heroIndex]}")`);
          hero.animate([{ opacity: 0.6 }, { opacity: 1 }], { duration: 800, easing: 'ease-in-out' });
          if (heroIndex === heroImages.length - 1) clearInterval(heroTimer);
        }, 6000);
      });
    }
  }

  // 4. 品牌轉場遮罩 (Brand Reveal Transition)
  const brandReveal = document.querySelector('.brand-reveal');
  const brandRevealStage = brandReveal?.querySelector('.brand-reveal-stage');
  let brandFrame = 0;
  const updateBrandReveal = () => {
    if (!brandReveal || reduceMotion) return;
    const rect = brandReveal.getBoundingClientRect();
    const distance = Math.max(1, brandReveal.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -rect.top / distance));
    const scaleProgress = Math.min(1, progress / 0.5);
    const eased = 1 - Math.pow(1 - scaleProgress, 3);
    const maskOpacity = Math.min(1, progress / 0.16);
    const stageWidth = brandRevealStage?.clientWidth || window.innerWidth;
    const stageHeight = brandRevealStage?.clientHeight || window.innerHeight;
    const mobileWordScale = Math.min(1, Math.max(0.34, (stageWidth / stageHeight) * 0.82));
    const finalWordScale = stageWidth <= 768 ? mobileWordScale : 1;
    const wordScale = finalWordScale + (28 - finalWordScale) * (1 - eased);
    const glowIn = Math.min(1, Math.max(0, (progress - 0.18) / 0.2));
    const glowOut = 1 - Math.min(1, Math.max(0, (progress - 0.64) / 0.14));
    const wordGlow = maskOpacity * (0.22 + glowIn * glowOut * 0.78);
    const copyOpacity = Math.min(1, Math.max(0, (progress - 0.82) / 0.14));
    const particleFocus = Math.min(1, Math.max(0, (progress - 0.22) / 0.2));
    const particleFade = Math.min(1, Math.max(0, (progress - 0.78) / 0.1));
    const particleOpacity = 0.7 + particleFocus * 0.3 - particleFade * 0.58;
    const shadeOpacity = 0.86 + wordGlow * 0.14;
    brandReveal.style.setProperty('--brand-mask-opacity', maskOpacity.toFixed(3));
    brandReveal.style.setProperty('--brand-word-scale', wordScale.toFixed(3));
    brandReveal.style.setProperty('--brand-word-glow', wordGlow.toFixed(3));
    brandReveal.style.setProperty('--brand-particle-opacity', particleOpacity.toFixed(3));
    brandReveal.style.setProperty('--brand-shade-opacity', shadeOpacity.toFixed(3));
    brandReveal.style.setProperty('--brand-copy-opacity', copyOpacity.toFixed(3));
    brandFrame = 0;
  };
  const requestBrandReveal = () => {
    if (!brandFrame) brandFrame = requestAnimationFrame(updateBrandReveal);
  };
  updateBrandReveal();
  window.addEventListener('scroll', requestBrandReveal, { passive: true });
  window.addEventListener('resize', requestBrandReveal, { passive: true });

  // 5G 粒子訊號場：透視投影、波形流動與輕微指標視差。
  const brandCanvas = brandReveal?.querySelector('.brand-signal-canvas');
  if (brandCanvas instanceof HTMLCanvasElement && brandReveal && !reduceMotion) {
    const context = brandCanvas.getContext('2d');
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let particles = [];
    let canvasWidth = 0;
    let canvasHeight = 0;
    let particleFrame = 0;
    let particleVisible = false;
    let lastParticleRender = 0;
    let particleColumns = 1;
    const limitedDevice = (navigator.hardwareConcurrency || 4) <= 4 || (navigator.deviceMemory || 8) <= 4;
    const frameInterval = 1000 / (limitedDevice ? 24 : 30);

    const createParticles = () => {
      const mobile = canvasWidth < 768;
      const rows = mobile ? 18 : (limitedDevice ? 26 : 34);
      const columns = mobile ? 36 : (limitedDevice ? 52 : 72);
      particleColumns = columns;
      particles = [];
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          particles.push({
            u: column / Math.max(1, columns - 1),
            v: row / Math.max(1, rows - 1),
            phase: Math.random() * Math.PI * 2,
            jitterX: Math.random() - 0.5,
            jitterY: Math.random() - 0.5,
            brightness: 0.82 + Math.random() * 0.18,
            size: 0.55 + Math.random() * 1.25
          });
        }
      }
    };

    const resizeBrandCanvas = () => {
      const rect = brandRevealStage.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, rect.width < 768 ? 1 : 1.25);
      canvasWidth = Math.max(1, rect.width);
      canvasHeight = Math.max(1, rect.height);
      brandCanvas.width = Math.round(canvasWidth * ratio);
      brandCanvas.height = Math.round(canvasHeight * ratio);
      brandCanvas.style.width = `${canvasWidth}px`;
      brandCanvas.style.height = `${canvasHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      createParticles();
    };

    const renderParticles = timestamp => {
      if (!particleVisible || document.hidden) {
        particleFrame = 0;
        return;
      }
      if (lastParticleRender && timestamp - lastParticleRender < frameInterval) {
        particleFrame = requestAnimationFrame(renderParticles);
        return;
      }
      lastParticleRender = timestamp;
      pointer.x += (pointer.targetX - pointer.x) * 0.035;
      pointer.y += (pointer.targetY - pointer.y) * 0.035;
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      const time = timestamp * 0.00032;
      const horizon = canvasHeight * 0.4;

      particles.forEach((point, index) => {
        const depth = 0.12 + point.v * 0.88;
        const perspective = 0.22 + depth * 0.78;
        const columnSpacing = canvasWidth / Math.max(1, particleColumns - 1);
        const horizontalDrift = Math.sin(time * 1.7 + point.v * 7) * canvasWidth * 0.01;
        const x = point.u * canvasWidth + point.jitterX * columnSpacing * 0.9 + horizontalDrift + pointer.x * depth * 8;
        const mainWave = Math.sin(point.u * 11.5 - time * 4.6 + point.v * 4.5) * canvasHeight * (0.022 + depth * 0.055);
        const rollingWave = Math.sin(point.u * 5.2 + time * 2.2 - point.v * 10) * canvasHeight * 0.028;
        const crestStrength = Math.pow(Math.max(0, Math.sin(point.u * 7.4 - time * 3.4 + point.v * 2.7)), 6);
        const crest = crestStrength * canvasHeight * 0.044;
        const surfaceJitter = point.jitterY * canvasHeight * (0.006 + depth * 0.012);
        const y = horizon + point.v * canvasHeight * 0.56 + mainWave + rollingWave - crest + surfaceJitter + pointer.y * depth * 5;
        const alpha = Math.min(0.98, (0.2 + perspective * 0.58 + crestStrength * 0.3) * point.brightness);
        const radius = point.size * (0.42 + perspective * 2.45);
        const red = Math.round(34 * (1 - point.u));
        const green = Math.round(190 + point.u * 45 + crestStrength * 18);
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${red}, ${green}, 255, ${alpha})`;
        const luminousCrest = crestStrength > 0.72 && index % 3 === 0;
        context.shadowColor = point.u > 0.48 ? '#42dcff' : '#51c6ff';
        context.shadowBlur = luminousCrest ? 9 : 0;
        context.fill();
      });
      context.shadowBlur = 0;
      particleFrame = requestAnimationFrame(renderParticles);
    };

    const startParticles = () => {
      if (!particleFrame && particleVisible && !document.hidden) particleFrame = requestAnimationFrame(renderParticles);
    };
    const particleObserver = new IntersectionObserver(entries => {
      particleVisible = entries[0].isIntersecting;
      if (particleVisible) startParticles();
    }, { rootMargin: '120px 0px', threshold: 0 });
    particleObserver.observe(brandReveal);
    brandRevealStage.addEventListener('pointermove', event => {
      const rect = brandRevealStage.getBoundingClientRect();
      pointer.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    }, { passive: true });
    brandRevealStage.addEventListener('pointerleave', () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
    }, { passive: true });
    window.addEventListener('resize', resizeBrandCanvas);
    document.addEventListener('visibilitychange', startParticles);
    resizeBrandCanvas();
  }

  // 5. 滾動進場淡入效果 (Scroll Reveal Observer)
  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    reveals.forEach(el => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px' });
    reveals.forEach(el => observer.observe(el));
  }

  // 6. 電信訊號波形背景動畫 (Canvas Wave Animation)
  const waveCanvas = document.getElementById('contact-wave-canvas');
  const contactSection = document.getElementById('contact');
  if (waveCanvas && contactSection && !reduceMotion) {
    const context = waveCanvas.getContext('2d');
    let waveWidth = 0;
    let waveHeight = 0;
    let waveFrame = 0;
    let waveStart = 0;
    let lastWaveRender = 0;
    let wavesVisible = false;
    const waveFrameInterval = 1000 / 30; // 30fps

    const resizeWaves = () => {
      const rect = contactSection.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1);
      waveWidth = Math.max(1, rect.width);
      waveHeight = Math.max(1, rect.height);
      waveCanvas.width = Math.round(waveWidth * ratio);
      waveCanvas.height = Math.round(waveHeight * ratio);
      waveCanvas.style.width = `${waveWidth}px`;
      waveCanvas.style.height = `${waveHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const drawWave = (time, config) => {
      const centerY = waveHeight * config.y;
      const gradient = context.createLinearGradient(0, 0, waveWidth, 0);
      gradient.addColorStop(0, 'rgba(0,163,224,0)');
      gradient.addColorStop(0.24, config.color);
      gradient.addColorStop(0.72, config.color);
      gradient.addColorStop(1, 'rgba(100,255,218,0)');
      context.beginPath();
      for (let x = -20; x <= waveWidth + 20; x += 7) {
        const progress = Math.min(1, Math.max(0, x / waveWidth));
        const envelope = Math.sin(Math.PI * progress);
        const primary = Math.sin(x * config.frequency + time * config.speed);
        const secondary = Math.sin(x * config.frequency * 0.42 - time * config.speed * 0.63);
        const y = centerY + (primary * 0.72 + secondary * 0.28) * config.amplitude * envelope;
        if (x === -20) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.strokeStyle = gradient;
      context.lineWidth = config.lineWidth;
      context.shadowColor = config.glow;
      context.shadowBlur = config.blur;
      context.stroke();
    };

    const drawWaveNodes = time => {
      const count = waveWidth < 768 ? 7 : 13;
      for (let index = 0; index < count; index += 1) {
        const progress = ((index / count) + ((time * 0.000025) % 1)) % 1;
        const x = progress * waveWidth;
        const y = waveHeight * 0.52 + Math.sin(progress * Math.PI * 4 + time * 0.00055) * waveHeight * 0.13;
        const radius = 2.2 + Math.sin(time * 0.002 + index) * 0.75;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(100,255,218,.95)';
        context.shadowColor = '#64ffda';
        context.shadowBlur = 8;
        context.fill();
      }
      context.shadowBlur = 0;
    };

    const renderWaves = timestamp => {
      if (!wavesVisible || document.hidden) {
        waveFrame = 0;
        return;
      }
      if (lastWaveRender && timestamp - lastWaveRender < waveFrameInterval) {
        waveFrame = requestAnimationFrame(renderWaves);
        return;
      }
      lastWaveRender = timestamp;
      if (!waveStart) waveStart = timestamp;
      const time = timestamp - waveStart;
      context.clearRect(0, 0, waveWidth, waveHeight);
      context.globalCompositeOperation = 'lighter';
      drawWave(time, { y: 0.36, amplitude: waveHeight * 0.13, frequency: 0.010, speed: 0.0012, lineWidth: 1.8, color: 'rgba(0,183,255,.76)', glow: '#00b7ff', blur: 10 });
      drawWave(time, { y: 0.52, amplitude: waveHeight * 0.20, frequency: 0.014, speed: -0.0010, lineWidth: 2.6, color: 'rgba(100,255,218,.84)', glow: '#64ffda', blur: 14 });
      drawWave(time, { y: 0.68, amplitude: waveHeight * 0.11, frequency: 0.019, speed: 0.00075, lineWidth: 1.5, color: 'rgba(91,137,255,.68)', glow: '#5b89ff', blur: 10 });
      drawWaveNodes(time);
      context.globalCompositeOperation = 'source-over';
      waveFrame = wavesVisible ? requestAnimationFrame(renderWaves) : 0;
    };

    const waveObserver = new IntersectionObserver(entries => {
      wavesVisible = entries[0].isIntersecting;
      if (wavesVisible && !document.hidden && !waveFrame) {
        lastWaveRender = 0;
        waveFrame = requestAnimationFrame(renderWaves);
      }
      if (!wavesVisible && waveFrame) {
        cancelAnimationFrame(waveFrame);
        waveFrame = 0;
      }
    }, { threshold: 0.05 });

    const syncWaveVisibility = () => {
      if (document.hidden && waveFrame) {
        cancelAnimationFrame(waveFrame);
        waveFrame = 0;
      } else if (!document.hidden && wavesVisible && !waveFrame) {
        lastWaveRender = 0;
        waveFrame = requestAnimationFrame(renderWaves);
      }
    };

    resizeWaves();
    waveObserver.observe(contactSection);
    window.addEventListener('resize', resizeWaves, { passive: true });
    document.addEventListener('visibilitychange', syncWaveVisibility);
  }

  // 7. 詢價與現場會勘對話框 (Contact Dialog & Multi-modal triggers)
  const contactDialog = document.getElementById('contact-dialog');
  const contactModalTriggers = document.querySelectorAll('.contact-modal-open');
  const contactForm = document.getElementById('contact-request-form');
  const contactFormView = document.getElementById('contact-form-view');
  const contactReviewView = document.getElementById('contact-review-view');
  const contactReviewList = document.getElementById('contact-review-list');
  const contactReviewEdit = document.getElementById('contact-review-edit');
  const contactSubmit = document.getElementById('contact-submit');
  const contactSubmitStatus = document.getElementById('contact-submit-status');
  const contactSuccessView = document.getElementById('contact-success-view');
  const contactServiceError = document.getElementById('contact-service-error');
  const contactChannelError = document.getElementById('contact-channel-error');
  const contactTurnstileError = document.getElementById('contact-turnstile-error');

  if (contactDialog && contactForm) {
    const serviceInputs = [...contactForm.querySelectorAll('input[name="services"]')];

    const resetContactSubmitButton = () => {
      const arrowSpan = document.createElement('span');
      arrowSpan.textContent = '→';
      contactSubmit.replaceChildren('確認並送出 ', arrowSpan);
    };

    const resetContactDialog = () => {
      contactForm.reset();
      contactFormView.hidden = false;
      contactReviewView.hidden = true;
      contactSuccessView.hidden = true;
      contactServiceError.hidden = true;
      contactChannelError.hidden = true;
      contactReviewList.replaceChildren();
      contactSubmitStatus.textContent = '';
      contactSubmit.disabled = false;
      resetContactSubmitButton();
      document.body.classList.remove('contact-dialog-open');
      if (window.turnstile && turnstileWidgetId !== null) window.turnstile.reset(turnstileWidgetId);
    };

    const openContactDialog = () => {
      contactDialog.showModal();
      document.body.classList.add('contact-dialog-open');
      // 如果手機選單是開著的，自動關閉
      nav?.classList.remove('open');
      toggle?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
      toggle?.setAttribute('aria-label', '開啟導覽選單');
      document.body.classList.remove('menu-open');
      requestAnimationFrame(() => serviceInputs[0]?.focus());
    };

    const closeContactDialog = () => contactDialog.close();

    contactModalTriggers.forEach(trigger => {
      trigger.addEventListener('click', openContactDialog);
    });

    contactDialog.querySelectorAll('[data-dialog-close]').forEach(button => {
      button.addEventListener('click', closeContactDialog);
    });

    contactDialog.addEventListener('click', event => {
      if (event.target === contactDialog) closeContactDialog();
    });

    contactDialog.addEventListener('close', resetContactDialog);

    serviceInputs.forEach(input => input.addEventListener('change', () => {
      if (serviceInputs.some(service => service.checked)) contactServiceError.hidden = true;
    }));

    ['contact-email', 'contact-phone'].forEach(id => document.getElementById(id)?.addEventListener('input', () => {
      if (contactForm.email.value.trim() || contactForm.phone.value.trim()) contactChannelError.hidden = true;
    }));

    contactForm.addEventListener('submit', event => {
      event.preventDefault();
      const selectedServices = serviceInputs.filter(input => input.checked).map(input => input.value);
      if (!selectedServices.length) {
        contactServiceError.hidden = false;
        serviceInputs[0]?.focus();
        return;
      }
      if (!contactForm.email.value.trim() && !contactForm.phone.value.trim()) {
        contactChannelError.hidden = false;
        contactForm.email.focus();
        return;
      }
      if (!contactForm.reportValidity()) return;
      if (!contactForm.elements['cf-turnstile-response']?.value) {
        contactTurnstileError.hidden = false;
        document.getElementById('contact-turnstile')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const formData = new FormData(contactForm);
      const details = [
        ['需求項目', selectedServices.join('、')],
        ['姓名／稱謂', formData.get('name')],
        ['公司名稱', formData.get('company') || '未提供'],
        ['電子信箱', formData.get('email')],
        ['聯絡電話', formData.get('phone')],
        ['場域地點', formData.get('location') || '未提供'],
        ['方便聯絡時段', formData.get('contactTime')],
        ['需求說明', formData.get('message')]
      ];
      contactReviewList.replaceChildren();
      details.forEach(([label, value]) => {
        const term = document.createElement('dt');
        const description = document.createElement('dd');
        term.textContent = label;
        description.textContent = String(value);
        contactReviewList.append(term, description);
      });

      contactFormView.hidden = true;
      contactReviewView.hidden = false;
      contactDialog.scrollTop = 0;
      contactSubmit.focus();
    });

    let turnstileWidgetId = null;
    const initializeTurnstile = async () => {
      try {
        const response = await fetch('/api/config', { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(`Config request failed: ${response.status}`);
        const { turnstileSiteKey } = await response.json();
        if (!turnstileSiteKey) throw new Error('Turnstile site key is unavailable');
        const renderWidget = () => {
          turnstileWidgetId = window.turnstile.render('#contact-turnstile', {
            sitekey: turnstileSiteKey,
            callback: () => { contactTurnstileError.hidden = true; },
            'expired-callback': () => { contactTurnstileError.hidden = false; },
            'error-callback': () => { contactTurnstileError.hidden = false; }
          });
        };
        if (window.turnstile) renderWidget();
        else window.addEventListener('load', renderWidget, { once: true });
      } catch (error) {
        console.error(error);
        contactTurnstileError.textContent = '安全驗證暫時無法載入，請稍後再試。';
        contactTurnstileError.hidden = false;
      }
    };
    initializeTurnstile();

    contactSubmit.addEventListener('click', async () => {
      if (window.location.protocol === 'file:') {
        contactSubmitStatus.textContent = '本機預覽模式下不會送出資料；部署至 Cloudflare Pages 後即可測試。';
        return;
      }
      contactSubmitStatus.textContent = '資料送出中，請稍候…';
      contactSubmit.disabled = true;
      contactSubmit.textContent = '送出中…';
      try {
        const submissionData = new FormData(contactForm);
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: submissionData
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || `Contact submission failed: ${response.status}`);
        contactReviewView.hidden = true;
        contactSuccessView.hidden = false;
        contactDialog.scrollTop = 0;
        contactSuccessView.querySelector('button')?.focus();
      } catch (error) {
        console.error(error);
        contactSubmitStatus.textContent = error.message || '目前無法送出，請稍後再試或直接來信 service@gaushyang.com。';
        if (window.turnstile && turnstileWidgetId !== null) window.turnstile.reset(turnstileWidgetId);
      } finally {
        contactSubmit.disabled = false;
        resetContactSubmitButton();
      }
    });

    contactReviewEdit.addEventListener('click', () => {
      contactReviewView.hidden = true;
      contactFormView.hidden = false;
      contactDialog.scrollTop = 0;
      serviceInputs[0]?.focus();
    });
  }

  // 9. 隱私權政策與個資告知彈窗 (Privacy Dialog)
  const privacyDialog = document.getElementById('privacy-dialog');
  const openPrivacyLink = document.getElementById('open-privacy-link');
  const footerPrivacyBtn = document.getElementById('footer-privacy-btn');

  if (privacyDialog) {
    const openPrivacy = (e) => {
      if (e) e.preventDefault();
      privacyDialog.showModal();
      document.body.classList.add('privacy-dialog-open');
    };
    const closePrivacy = () => {
      privacyDialog.close();
      document.body.classList.remove('privacy-dialog-open');
    };

    openPrivacyLink?.addEventListener('click', openPrivacy);
    footerPrivacyBtn?.addEventListener('click', openPrivacy);

    privacyDialog.querySelectorAll('[data-privacy-close]').forEach(btn => {
      btn.addEventListener('click', closePrivacy);
    });

    privacyDialog.addEventListener('click', event => {
      if (event.target === privacyDialog) closePrivacy();
    });
  }

  // 10. 頁尾年份自動更新
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
