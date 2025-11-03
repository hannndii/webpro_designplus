// Helper functions
function formatRp(num) {
  if (typeof num !== "number") return num;
  return "Rp" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getOrderFromStorage() {
  const order = localStorage.getItem('current_order');
  return order ? JSON.parse(order) : null;
}

function saveOrder(order) {
  localStorage.setItem('current_order', JSON.stringify(order));
}

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

function calculateTotals(order) {
  const subtotal = order.price * order.quantity;
  const tax = Math.round(subtotal * 0.12);
  const shipping = 12500;
  const discount = order.coupon?.amount || 0;
  
  return {
    subtotal,
    tax,
    shipping,
    discount,
    total: subtotal + tax + shipping - discount
  };
}

function renderOrder(order, totals) {
  document.getElementById('product-name').textContent = order.productName;
  document.getElementById('material').textContent = order.material;
  document.getElementById('color').textContent = order.color || '-';
  document.getElementById('design').textContent = order.design;
  
  document.getElementById('price-product').textContent = formatRp(order.price);
  document.getElementById('price-material').textContent = formatRp(0);
  document.getElementById('price-color').textContent = formatRp(0);
  document.getElementById('price-design').textContent = formatRp(order.design === 'Custom' ? 5000 : 0);
  
  document.getElementById('order-qty').textContent = `${order.quantity} pcs`;
  document.getElementById('shipping-cost').textContent = formatRp(totals.shipping);
  document.getElementById('discount-amount').textContent = formatRp(totals.discount);
  document.getElementById('tax-amount').textContent = formatRp(totals.tax);
  document.getElementById('subtotal-amount').textContent = formatRp(totals.total);
}

async function renderAddressDropdown() {
  const addresses = await fetchData('data/opsi_alamat.json');
  const container = document.getElementById('address-dropdown');
  if (!container || !addresses) return;

  container.innerHTML = '';
  addresses.forEach((addr, i) => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.innerHTML = `
      <div style="flex:1">
        <div style="font-weight:600">${addr.label}</div>
        <div class="meta">${addr.text}</div>
      </div>
    `;
    
    item.addEventListener('click', () => {
      const order = getOrderFromStorage();
      if (order) {
        order.shipping_address = addr;
        saveOrder(order);
        document.getElementById('address-label').textContent = addr.label;
        document.getElementById('address-text').textContent = addr.text;
      }
      toggleDropdown('address-dropdown', false);
    });
    
    container.appendChild(item);
    if (i < addresses.length - 1) {
      container.appendChild(document.createElement('div')).className = 'divider';
    }
  });
}

async function renderCouponDropdown() {
  const coupons = await fetchData('data/opsi_kupon.json');
  const container = document.getElementById('coupon-dropdown');
  if (!container || !coupons) return;

  container.innerHTML = '';
  coupons.forEach((coupon, i) => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.innerHTML = `
      <div style="flex:1">
        <div style="font-weight:600">${coupon.code} — ${formatRp(coupon.amount)}</div>
        <div class="meta">${coupon.description}</div>
      </div>
    `;
    
    item.addEventListener('click', () => {
      const order = getOrderFromStorage();
      if (order && coupon.valid) {
        order.coupon = coupon;
        saveOrder(order);
        const totals = calculateTotals(order);
        renderOrder(order, totals);
        
        document.getElementById('coupon-title').textContent = `${coupon.code} berhasil dipakai`;
        document.getElementById('coupon-desc').textContent = coupon.description;
      }
      toggleDropdown('coupon-dropdown', false);
    });
    
    container.appendChild(item);
    if (i < coupons.length - 1) {
      container.appendChild(document.createElement('div')).className = 'divider';
    }
  });

  container.appendChild(document.createElement('div')).className = 'divider';
  const remove = document.createElement('div');
  remove.className = 'dropdown-item';
  remove.style.justifyContent = 'center';
  remove.style.color = '#DC2525';
  remove.textContent = 'Hapus Kupon';
  remove.addEventListener('click', () => {
    const order = getOrderFromStorage();
    if (order) {
      delete order.coupon;
      saveOrder(order);
      const totals = calculateTotals(order);
      renderOrder(order, totals);
      
      document.getElementById('coupon-title').textContent = 'Pilih kupon';
      document.getElementById('coupon-desc').textContent = 'Gunakan kupon untuk mendapat potongan';
    }
    toggleDropdown('coupon-dropdown', false);
  });
  container.appendChild(remove);
}

function toggleDropdown(id, show) {
  const el = document.getElementById(id);
  if (!el) return;
  if (show === undefined) show = el.hasAttribute('hidden');
  if (show) el.removeAttribute('hidden');
  else el.setAttribute('hidden', '');
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
  const order = getOrderFromStorage();
  if (!order) {
    window.location.href = 'home.html';
    return;
  }

  const totals = calculateTotals(order);
  renderOrder(order, totals);
  await renderAddressDropdown();
  await renderCouponDropdown();

  // Event Listeners
  document.querySelectorAll('input[name="payment_method"]').forEach(radio => {
    radio.addEventListener('change', e => {
      const order = getOrderFromStorage();
      if (order) {
        order.payment_method = e.target.value;
        saveOrder(order);
      }
    });
  });

  document.getElementById('change-address-btn').addEventListener('click', (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    renderAddressDropdown();
    toggleDropdown('address-dropdown', true);
  });

  document.getElementById('coupon-banner').addEventListener('click', (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    renderCouponDropdown();
    toggleDropdown('coupon-dropdown', true);
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    toggleDropdown('address-dropdown', false);
    toggleDropdown('coupon-dropdown', false);
  });

  // Prevent dropdown close when clicking inside
  ['address-dropdown', 'coupon-dropdown'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', e => e.stopPropagation());
  });

  document.getElementById('delete-order-btn').addEventListener('click', (ev) => {
    ev.preventDefault();
    if (confirm('Anda yakin ingin menghapus order ini?')) {
      localStorage.removeItem('current_order');
      window.location.href = 'home.html';
    }
  });

  document.getElementById('confirm-btn').addEventListener('click', async () => {
    const btn = document.getElementById('confirm-btn');
    btn.disabled = true;
    btn.innerText = 'Memproses...';

    setTimeout(() => {
      btn.innerText = 'Konfirmasi Pembayaran';
      btn.disabled = false;
      alert('Transaksi berhasil!');
      window.location.href = 'home.html';
    }, 1500);
  });

  document.getElementById('cancel-btn').addEventListener('click', () => {
    if (confirm('Batalkan order ini?')) {
      window.location.href = 'home.html';
    }
  });
});