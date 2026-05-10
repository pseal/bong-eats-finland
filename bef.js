  // ── Language Toggle ──
  let currentLang = 'en';

  function toggleLang() {
    currentLang = currentLang === 'en' ? 'fi' : 'en';
    const flag = document.getElementById('langFlag');
    const label = document.getElementById('langLabel');
    if (currentLang === 'fi') {
      flag.textContent = '🇬🇧';
      label.textContent = 'English';
    } else {
      flag.textContent = '🇫🇮';
      label.textContent = 'Suomi';
    }
    applyLang();
  }

  function applyLang() {
    const lang = currentLang;

    // All elements with data-en / data-fi text content
    document.querySelectorAll('[data-en][data-fi]').forEach(el => {
      // Skip elements that are inputs/textareas (handled separately)
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'OPTION') return;
      const val = el.getAttribute('data-' + lang);
      if (val) el.textContent = val;
    });

    // Placeholders
    document.querySelectorAll('[data-en-placeholder][data-fi-placeholder]').forEach(el => {
      el.placeholder = el.getAttribute('data-' + lang + '-placeholder') || el.placeholder;
    });

    // Select options
    document.querySelectorAll('option[data-en][data-fi]').forEach(opt => {
      const val = opt.getAttribute('data-' + lang);
      if (val) opt.textContent = val;
    });

    // Calendar display placeholder if not yet selected
    const calDisplay = document.getElementById('calDisplay');
    if (calDisplay && !calDisplay.dataset.selected) {
      calDisplay.textContent = lang === 'fi'
        ? 'Valitse viikonlopun päivä & aika...'
        : 'Select a weekend date & time...';
    }

    // Clear order button
    const clearBtn = document.querySelector('[data-en="✕ Clear Order"]');
    if (clearBtn) clearBtn.textContent = lang === 'fi' ? '✕ Tyhjennä tilaus' : '✕ Clear Order';

    // Page title
    document.title = lang === 'fi'
      ? 'Bong Eats Finland – Aitoa bengalilaista ruokaa'
      : 'Bong Eats Finland – Authentic Bengali Cuisine';
  }

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
      alert(currentLang === 'fi'
        ? 'Täytä ainakin nimesi ja tilaustuotteet ennen lähettämistä.'
        : 'Please fill in at least your name and order items before sending.');
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

  // ── Custom Weekend Calendar ──
  const pad = n => String(n).padStart(2, '0');
  let calCurrentMonth = new Date();
  calCurrentMonth.setDate(1);
  let calSelectedDate = null;

  function toggleCalendar() {
    const cal = document.getElementById('customCal');
    const isOpen = cal.style.display !== 'none';
    cal.style.display = isOpen ? 'none' : 'block';
    if (!isOpen) renderCalendar();
  }

  function changeMonth(dir) {
    calCurrentMonth.setMonth(calCurrentMonth.getMonth() + dir);
    const now = new Date();
    if (calCurrentMonth.getFullYear() < now.getFullYear() ||
      (calCurrentMonth.getFullYear() === now.getFullYear() && calCurrentMonth.getMonth() < now.getMonth())) {
      calCurrentMonth = new Date();
      calCurrentMonth.setDate(1);
    }
    renderCalendar();
  }

  function renderCalendar() {
    const label = document.getElementById('calMonthLabel');
    const grid = document.getElementById('calDays');
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const year = calCurrentMonth.getFullYear();
    const month = calCurrentMonth.getMonth();

    label.textContent = new Date(year, month, 1).toLocaleDateString(
      currentLang === 'fi' ? 'fi-FI' : 'en-FI',
      { month: 'long', year: 'numeric' }
    );

    let firstDay = new Date(year, month, 1).getDay();
    firstDay = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    grid.innerHTML = '';

    for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div></div>`;

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isPast = date < today;
      const isSelected = calSelectedDate && date.toDateString() === calSelectedDate.toDateString();

      if (isWeekend && !isPast) {
        grid.innerHTML += `
          <div onclick="selectDate(${year},${month},${d})"
            style="text-align:center;padding:0.45rem 0.2rem;cursor:pointer;border-radius:2px;font-size:0.85rem;
            background:${isSelected ? 'var(--saffron)' : 'rgba(232,146,42,0.12)'};
            color:${isSelected ? 'var(--midnight)' : 'var(--saffron)'};
            font-weight:${isSelected ? '700' : '500'};transition:background 0.2s;"
            onmouseover="this.style.background='rgba(232,146,42,0.3)'"
            onmouseout="this.style.background='${isSelected ? 'var(--saffron)' : 'rgba(232,146,42,0.12)'}'">
            ${d}
          </div>`;
      } else {
        grid.innerHTML += `
          <div style="text-align:center;padding:0.45rem 0.2rem;font-size:0.85rem;
            color:rgba(250,243,224,0.15);cursor:default;">${d}</div>`;
      }
    }
  }

  function selectDate(year, month, day) {
    calSelectedDate = new Date(year, month, day);
    renderCalendar();
    document.getElementById('calTimeRow').style.display = 'block';
    document.getElementById('calTime').value = '';
    const display = document.getElementById('calDisplay');
    display.style.color = 'rgba(250,243,224,0.5)';
    display.textContent = calSelectedDate.toLocaleDateString(
      currentLang === 'fi' ? 'fi-FI' : 'en-FI',
      { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    ) + (currentLang === 'fi' ? ' — valitse aika ↓' : ' — pick a time ↓');
    delete display.dataset.selected;
  }

  function confirmDateTime() {
    const time = document.getElementById('calTime').value;
    if (!time || !calSelectedDate) return;
    const dateStr = `${calSelectedDate.getFullYear()}-${pad(calSelectedDate.getMonth()+1)}-${pad(calSelectedDate.getDate())}T${time}`;
    document.getElementById('orderTime').value = dateStr;

    const display = document.getElementById('calDisplay');
    const dateLabel = calSelectedDate.toLocaleDateString(
      currentLang === 'fi' ? 'fi-FI' : 'en-FI',
      { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    );
    display.textContent = `${dateLabel} ${currentLang === 'fi' ? 'klo' : 'at'} ${time}`;
    display.style.color = 'var(--cream)';
    display.dataset.selected = 'true';
    document.getElementById('customCal').style.display = 'none';
  }

  document.addEventListener('click', function(e) {
    const cal = document.getElementById('customCal');
    const trigger = document.getElementById('calTrigger');
    if (cal && trigger && !cal.contains(e.target) && !trigger.contains(e.target)) {
      cal.style.display = 'none';
    }
  });

  renderCalendar();

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
    const msg = currentLang === 'fi' ? 'Tyhjennetäänkö kaikki tilaustuotteet?' : 'Clear all items from your order?';
    if (confirm(msg)) document.getElementById('orderItems').value = '';
  }

  // ── Custom / Catering requests ──
  function addCustom(type) {
    const inputId = type === 'custom' ? 'customInput' : 'cateringInput';
    const label = type === 'custom' ? '🍽️ Custom Order' : '🎉 Catering Request';
    const text = document.getElementById(inputId).value.trim();
    if (!text) {
      alert(currentLang === 'fi'
        ? 'Kuvaile ' + (type === 'custom' ? 'räätälöityä ruokaasi' : 'cateringtarpeesi') + ' ensin.'
        : 'Please describe your ' + (type === 'custom' ? 'custom dish' : 'catering needs') + ' first.');
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
    const charges = currentLang === 'fi' ? {
      '15': '✅ Toimituskulut: 5,00€',
      '25': '✅ Toimituskulut: 7,00€',
      'far': '✅ Toimituskulut: 10,00€',
      'intercity': '💬 Kaupunkien välinen toimitus — vahvistamme hinnan WhatsAppin kautta.'
    } : {
      '15': '✅ Delivery charge: €5.00',
      '25': '✅ Delivery charge: €7.00',
      'far': '✅ Delivery charge: €10.00',
      'intercity': '💬 Inter-city delivery — we will confirm the rate with you via WhatsApp.'
    };
    display.textContent = charges[val] || '';
  }

  document.getElementById('orderType').addEventListener('change', updateDeliveryCharge);

  // ── Back to Top ──
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  window.addEventListener('scroll', () => {
    const btn = document.getElementById('toTopBtn');
    if (btn) {
      btn.classList.toggle('visible', window.scrollY > 400);
    }
  });

  // ── Qty Stepper ──
function stepQty(id, dir) {
  const input = document.getElementById(id);
  const current = parseInt(input.value) || 1;
  const next = Math.min(50, Math.max(1, current + dir));
  input.value = next;
}
