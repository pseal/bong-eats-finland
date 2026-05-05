  // ── Mobile Nav ──
  function toggleMenu() {
    const nav = document.getElementById('navLinks');
    const btn = document.getElementById('hamburger');
    if (!nav || !btn) return;
    nav.classList.toggle('open');
    btn.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  }

  // ── Menu Tab Filter ──
  function filterMenu(cat, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.menu-item').forEach(item => {
      if (cat === 'all' || item.dataset.cat === cat) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // ── WhatsApp Order ──
  function sendWhatsApp() {
    const name    = document.getElementById('orderName').value.trim();
    const phone   = document.getElementById('orderPhone').value.trim();
    const type    = document.getElementById('orderType').value;
    const time    = document.getElementById('orderTime').value;
    const address = document.getElementById('orderAddress').value.trim();
    const items   = document.getElementById('orderItems').value.trim();
    const notes   = document.getElementById('orderNotes').value.trim();

    if (!name || !items) {
      alert('Please fill in at least your name and order items before sending.');
      return;
    }

    const waNumber = '358465823763';

    let msg = `🍛 *NEW ORDER — Bong Eats Finland*\n\n`;
    msg += `👤 *Name:* ${name}\n`;
    if (phone) msg += `📞 *Phone:* ${phone}\n`;
    msg += `🚗 *Type:* ${type}\n`;
    if (time) msg += `🕐 *Date/Time:* ${new Date(time).toLocaleString('en-FI', { dateStyle: 'full', timeStyle: 'short' })}\n`;
    if (address) msg += `📍 *Address:* ${address}\n`;
    const distEl = document.getElementById('deliveryDistance');
    const distVal = distEl ? distEl.value : '';
    const chargeMap = { '15': '€5.00', '25': '€7.00', 'far': '€10.00', 'intercity': 'To be agreed' };
    if (distVal) msg += `🚗 *Delivery Charge:* ${chargeMap[distVal] || ''}\n`;
    msg += `\n🛒 *Order:*\n${items}\n`;
    if (notes) msg += `\n📝 *Notes:* ${notes}`;

    const encodedMsg = encodeURIComponent(msg);
    window.open(`https://wa.me/${waNumber}?text=${encodedMsg}`, '_blank');
  }

  // ── Nav shrink on scroll (mobile-aware) ──
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    const logoImg = document.querySelector('.nav-logo img');
    const isMobile = window.innerWidth <= 600;
    if (window.scrollY > 60) {
      nav.style.padding = isMobile ? '0.6rem 1.2rem' : '0.75rem 4rem';
      if (logoImg) logoImg.style.height = isMobile ? '34px' : '38px';
    } else {
      nav.style.padding = isMobile ? '0.8rem 1.2rem' : '1.2rem 4rem';
      if (logoImg) logoImg.style.height = isMobile ? '40px' : '54px';
    }
  });

  // ── Weekend-only datetime setup ──
  const pad = n => String(n).padStart(2, '0');

  function getNextWeekend() {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 6=Sat
    let daysAhead = 0;
    if (day === 6) daysAhead = 0; // today is Saturday
    else if (day === 0) daysAhead = 0; // today is Sunday
    else daysAhead = 6 - day; // next Saturday

    const next = new Date(now);
    next.setDate(now.getDate() + daysAhead);

    // If it's weekend but before 11am, set to 11am same day
    // If it's weekend and after 11am, set to next hour
    if (daysAhead === 0) {
      const hour = now.getHours();
      next.setHours(hour < 11 ? 11 : hour + 1, 0, 0, 0);
    } else {
      next.setHours(11, 0, 0, 0);
    }
    return next;
  }

  function setWeekendDatetime() {
  const dt = getNextWeekend();
  const input = document.getElementById('orderTime');
  input.value = `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:00`;

  input.addEventListener('change', function() {
    const chosen = new Date(this.value);
    const d = chosen.getDay();
    const h = chosen.getHours();
    const note = document.getElementById('weekdayNote');

    if (d !== 0 && d !== 6) {
      // Weekday selected — show soft warning, auto-jump to next weekend
      note.style.display = 'block';
      const fixed = getNextWeekend();
      this.value = `${fixed.getFullYear()}-${pad(fixed.getMonth()+1)}-${pad(fixed.getDate())}T${pad(fixed.getHours())}:00`;
    } else {
      note.style.display = 'none';
      // Weekend but before 11am
      if (h < 11) {
        chosen.setHours(11, 0, 0, 0);
        this.value = `${chosen.getFullYear()}-${pad(chosen.getMonth()+1)}-${pad(chosen.getDate())}T11:00`;
      }
    }
    });
  }

setWeekendDatetime();

  // ── Add to Order ──
  function addToOrder(item, qtyId) {
    const qty = qtyId ? parseInt(document.getElementById(qtyId).value) || 1 : 1;
    const entry = qty + ' × ' + item;
    const box = document.getElementById('orderItems');
    let current = box.value.replace(/\n?─+\nTotal:.*$/s, '').trim();
    box.value = current ? current + '\n' + entry : entry;
    updateTotal();
    document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
    box.style.borderColor = '#E8922A';
    setTimeout(() => box.style.borderColor = 'rgba(232,146,42,0.2)', 1500);
  }

  // ── Update line totals ──
  function updateTotal() {
    const box = document.getElementById('orderItems');
    let current = box.value.replace(/\n?─+\nTotal:.*$/s, '').trim();
    if (!current) { box.value = ''; return; }

    let total = 0;
    const lines = current.split('\n');
    const updatedLines = lines.map(line => {
      const cleanLine = line.replace(/\s*=\s*€[\d.]+$/, '');
      const match = cleanLine.match(/^(\d+)\s*×.*€([\d.]+)/);
      if (match) {
        const qty = parseInt(match[1]);
        const price = parseFloat(match[2]);
        const lineTotal = qty * price;
        total += lineTotal;
        return cleanLine + ' = €' + lineTotal.toFixed(2);
      }
      return line;
    });
    current = updatedLines.join('\n');
    box.value = current;
  }

  // ── Clear Order ──
  function clearOrder() {
    if (confirm('Clear all items from your order?')) {
      document.getElementById('orderItems').value = '';
    }
  }

  // ── Custom / Catering requests ──
  function addCustom(type) {
    const inputId = type === 'custom' ? 'customInput' : 'cateringInput';
    const label = type === 'custom' ? '🍽️ Custom Order' : '🎉 Catering Request';
    const text = document.getElementById(inputId).value.trim();
    if (!text) {
      alert('Please describe your ' + (type === 'custom' ? 'custom dish' : 'catering needs') + ' first.');
      return;
    }
    const box = document.getElementById('orderItems');
    const current = box.value.trim();
    const entry = label + ': ' + text;
    box.value = current ? current + '\n' + entry : entry;
    document.getElementById(inputId).value = '';
    updateTotal();
    document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
    box.style.borderColor = '#E8922A';
    setTimeout(() => box.style.borderColor = 'rgba(232,146,42,0.2)', 1500);
  }

  // ── Delivery charge logic ──
  function updateDeliveryCharge() {
    const type = document.getElementById('orderType').value;
    const distGroup = document.getElementById('distanceGroup');
    if (type === 'Delivery') {
      distGroup.style.display = '';
    } else {
      distGroup.style.display = 'none';
      document.getElementById('chargeDisplay').textContent = '';
    }
  }

  function showDeliveryCharge() {
    const val = document.getElementById('deliveryDistance').value;
    const display = document.getElementById('chargeDisplay');
    const charges = {
      '15': '✅ Delivery charge: €5.00',
      '25': '✅ Delivery charge: €7.00',
      'far': '✅ Delivery charge: €10.00',
      'intercity': '💬 Inter-city delivery — we will confirm the rate with you via WhatsApp.'
    };
    display.textContent = charges[val] || '';
  }

// Show distance selector when delivery type changes
  document.getElementById('orderType').addEventListener('change', updateDeliveryCharge);

// ── Back to Top ──
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  window.addEventListener('scroll', () => {
    const btn = document.getElementById('toTopBtn');
    if (btn) {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }
  });