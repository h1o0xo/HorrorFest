/**
 * Main Product Page Scripts
 * Handles Carousel, Countdown Timer, Dynamic Dates, Modals and Navigation
 */

document.addEventListener('DOMContentLoaded', function () {
  // ── 1. Timer Regressivo (Oferta Halloween) ──
  var totalSeconds = 8 * 60 + 27; // 8 minutos e 27 segundos
  function updateTimer() {
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    var mmEl = document.getElementById('mm');
    var ssEl = document.getElementById('ss');
    if (mmEl) mmEl.textContent = String(minutes).padStart(2, '0');
    if (ssEl) ssEl.textContent = String(seconds).padStart(2, '0');
    if (totalSeconds > 0) {
      totalSeconds--;
    } else {
      totalSeconds = 15 * 60; // reinicia ciclo de urgência
    }
  }
  updateTimer();
  setInterval(updateTimer, 1000);

  // ── 2. Data Promocional Dinâmica (Hoje) ──
  var now = new Date();
  var day = String(now.getDate()).padStart(2, '0');
  var month = String(now.getMonth() + 1).padStart(2, '0');
  var promoEl = document.getElementById('promoDate');
  if (promoEl) {
    promoEl.textContent = '🔥 PROMO ' + day + '.' + month;
  }

  // ── 3. Data de Envio Estimada Dinâmica ──
  var meses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  var dateMin = new Date();
  dateMin.setDate(dateMin.getDate() + 2);
  var dateMax = new Date();
  dateMax.setDate(dateMax.getDate() + 5);
  var shipEl = document.getElementById('shipDate');
  if (shipEl) {
    if (dateMin.getMonth() === dateMax.getMonth()) {
      shipEl.textContent = 'Chegará antes do Halloween (' + dateMin.getDate() + ' a ' + dateMax.getDate() + ' de ' + meses[dateMin.getMonth()] + ')';
    } else {
      shipEl.textContent = 'Chegará antes do Halloween (' + dateMin.getDate() + ' de ' + meses[dateMin.getMonth()] + ' a ' + dateMax.getDate() + ' de ' + meses[dateMax.getMonth()] + ')';
    }
  }

  // ── 4. Carrossel de Imagens Interativo ──
  var track = document.getElementById('carTrack');
  var cur = document.getElementById('carCur');
  var prev = document.getElementById('carPrev');
  var next = document.getElementById('carNext');
  var slides = document.querySelectorAll('.car-slide');
  var total = slides.length || 8;
  var totalEl = document.getElementById('carTotal');
  if (totalEl) totalEl.textContent = String(total);
  var currentIndex = 0;

  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= total) index = total - 1;
    currentIndex = index;

    if (track) {
      var slideWidth = track.clientWidth || track.offsetWidth;
      track.scrollTo({ left: slideWidth * index, behavior: 'smooth' });
    }
    if (cur) cur.textContent = String(currentIndex + 1);
    if (prev) prev.classList.toggle('hidden', currentIndex === 0);
    if (next) next.classList.toggle('hidden', currentIndex === total - 1);
  }

  if (track) {
    track.addEventListener('scroll', function () {
      var slideWidth = track.clientWidth || track.offsetWidth;
      if (slideWidth > 0) {
        var i = Math.round(track.scrollLeft / slideWidth);
        if (i !== currentIndex && i >= 0 && i < total) {
          currentIndex = i;
          if (cur) cur.textContent = String(currentIndex + 1);
          if (prev) prev.classList.toggle('hidden', currentIndex === 0);
          if (next) next.classList.toggle('hidden', currentIndex === total - 1);
        }
      }
    });
  }

  if (prev) prev.addEventListener('click', function () { goToSlide(currentIndex - 1); });
  if (next) next.addEventListener('click', function () { goToSlide(currentIndex + 1); });

  // ── 5. Preservar UTMs e parâmetros nos botões de checkout ──
  var checkoutLinks = document.querySelectorAll('.bb-buy, .bb-cart');
  checkoutLinks.forEach(function (link) {
    var search = window.location.search;
    if (search) {
      var href = link.getAttribute('href');
      if (href && !href.includes('?')) {
        link.setAttribute('href', href + search);
      } else if (href) {
        link.setAttribute('href', href + '&' + search.substring(1));
      }
    }
  });

  // ── 6. Modais Interativos (Loja, Chat, Avaliações) ──
  var built = { visit: false, chat: false, rev: false };

  function openModal(id) {
    var bd = document.getElementById(id + '-bd');
    var m = document.getElementById(id);
    if (!bd || !m) return;
    bd.style.display = 'block';
    m.style.display = 'block';
    requestAnimationFrame(function () {
      bd.classList.add('show');
      m.classList.add('show');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeModal(id) {
    var bd = document.getElementById(id + '-bd');
    var m = document.getElementById(id);
    if (!bd || !m) return;
    bd.classList.remove('show');
    m.classList.remove('show');
    setTimeout(function () {
      bd.style.display = 'none';
      m.style.display = 'none';
      document.body.style.overflow = '';
    }, 250);
  }

  function createModalShell(id, title, bodyHtml) {
    var bd = document.createElement('div');
    bd.className = 'cfx-mdl-bd';
    bd.id = id + '-bd';
    bd.style.display = 'none';
    bd.onclick = function () { closeModal(id); };

    var m = document.createElement('div');
    m.className = 'cfx-mdl';
    m.id = id;
    m.style.display = 'none';
    m.innerHTML = '<div class="cfx-mdl-hdr">' +
      '<div class="cfx-mdl-title">' + title + '</div>' +
      '<button class="cfx-mdl-close" type="button" aria-label="Fechar">' +
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '</button></div>' +
      '<div class="cfx-mdl-body">' + bodyHtml + '</div>';

    m.querySelector('.cfx-mdl-close').onclick = function () { closeModal(id); };
    document.body.appendChild(bd);
    document.body.appendChild(m);
  }

  function buildVisit() {
    if (built.visit) return;
    built.visit = true;
    createModalShell('cfxVisit', "Horror Fest Oficial",
      '<div class="cfx-store-row"><div class="cfx-store-logo">👻</div>' +
      '<div style="flex:1;"><div class="cfx-store-name">Horror Fest Oficial</div>' +
      '<div class="cfx-store-meta">Loja oficial · 4.9 ★ · Especialistas em Halloween</div></div></div>' +
      '<div class="cfx-store-stat"><div><strong>128.4K</strong><span>Vendidos</span></div>' +
      '<div><strong>4.9</strong><span>Avaliação</span></div>' +
      '<div><strong>99%</strong><span>Resposta</span></div></div>' +
      '<p style="font-size:13px;color:#555;line-height:1.6;margin-top:12px;">Loja oficial especializada em fantasias, adereços e artigos de Halloween e terror. Estoque no Brasil com pronta entrega e garantia de 30 dias.</p>' +
      '<a href="pagamento.html" style="display:block;text-align:center;width:100%;margin-top:16px;padding:13px;background:#fe2c55;color:#fff;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;">Comprar Fantasia Ghostface</a>'
    );
  }

  function buildChat() {
    if (built.chat) return;
    built.chat = true;
    createModalShell('cfxChat', 'Suporte Halloween',
      '<div class="cfx-chat-msg">' +
      '<span class="cfx-chat-time">Hoje, online agora</span>' +
      '<div class="cfx-chat-bubble cfx-chat-them">Olá! Tudo bem? Sou da Horror Fest Oficial 👋</div>' +
      '<div class="cfx-chat-bubble cfx-chat-them">A fantasia Ghostface é completa (túnica 170cm, máscara e faca). Pronta entrega para chegar antes do Halloween! 🎃</div>' +
      '<span class="cfx-chat-time">Dúvida sobre o tamanho</span>' +
      '<div class="cfx-chat-bubble cfx-chat-them">O tamanho é Adulto Único (170cm de comprimento), serve perfeitamente para qualquer altura de adulto.</div>' +
      '</div>' +
      '<div style="margin-top:16px;text-align:center;">' +
      '<a href="pagamento.html" style="display:inline-block;padding:12px 24px;background:#fe2c55;color:#fff;border-radius:8px;font-weight:700;text-decoration:none;font-size:13px;">Garantir Minha Fantasia</a>' +
      '</div>'
    );
  }

  function buildReviews() {
    if (built.rev) return;
    built.rev = true;
    var extras = [
      { n: 'Patricia M.', d: 'há 1 dia', t: 'Chegou muito rápido! A túnica é comprida, cobre bem e a máscara não sufoca. Top!' },
      { n: 'Roberto S.', d: 'há 2 dias', t: 'Fiz o maior sucesso na festa de terror da firma. Todo mundo tirou foto!' },
      { n: 'Camila O.', d: 'há 3 dias', t: 'Faca com detalhe de sangue muito bacana e totalmente inofensiva. Perfeita.' },
      { n: 'Anderson L.', d: 'há 5 dias', t: 'Excelente custo-benefício, o kit vem completinho como anunciado.' },
      { n: 'Juliana P.', d: 'há 1 semana', t: 'Qualidade ótima, tecido confortável e a máscara assusta mesmo de noite!' }
    ];
    var html = extras.map(function (e) {
      return '<div class="cfx-rev-extra"><span class="nm">' + e.n + '</span><span class="dt">' + e.d + '</span>' +
        '<div style="margin-top:4px;">' + e.t + '</div></div>';
    }).join('');
    createModalShell('cfxRev', 'Mais avaliações dos clientes', html +
      '<p style="text-align:center;font-size:12px;color:#888;margin-top:14px;">3.8 mil avaliações verificadas · 4.9 ★</p>'
    );
  }

  document.addEventListener('click', function (e) {
    var visitBtn = e.target.closest('#btnVisitar');
    if (visitBtn) {
      e.preventDefault();
      buildVisit();
      openModal('cfxVisit');
      return;
    }

    var chatBtn = e.target.closest('#btnChat');
    if (chatBtn) {
      e.preventDefault();
      buildChat();
      openModal('cfxChat');
      return;
    }

    var revBtn = e.target.closest('#btnReviewMore');
    if (revBtn) {
      e.preventDefault();
      buildReviews();
      openModal('cfxRev');
      return;
    }

    var termsBtn = e.target.closest('.pd-terms-btn');
    if (termsBtn) {
      e.preventDefault();
      alert('Termos de Uso e Política de Privacidade:\n\n1. Compra 100% protegida com garantia de 30 dias.\n2. Envio rápido para o Halloween com rastreamento.\n3. Pagamento seguro com PIX ou Cartão em até 12x.');
      return;
    }
  });
});
