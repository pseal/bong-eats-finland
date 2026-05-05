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

  // ── Set default datetime to now + 2 hours ──
  const dt = new Date(Date.now() + 2 * 3600 * 1000);
  dt.setMinutes(0, 0, 0);
  const pad = n => String(n).padStart(2, '0');
  document.getElementById('orderTime').value =
    `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:00`;

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
