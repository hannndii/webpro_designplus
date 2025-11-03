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

  const colorContainer = document.querySelector('.item-swatch');
  if (order.color) {
    colorContainer.style.backgroundColor = getColorCode(order.color);
    document.getElementById('color').textContent = order.color;
  }

  document.getElementById('design').textContent = order.design;

  const productImg = document.querySelector('.item-product-img img');
  if (productImg && order.productImage) {
    productImg.src = order.productImage;
    productImg.alt = order.productName;
  }
  
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

function getColorCode(colorName) {
  const colorMap = {
    'Putih': '#FFFFFF',
    'Hitam': '#000000',
    'Merah': '#FF5733',
    'Hijau': '#4CAF50',
    'Kuning': '#FFC107'
  };
  return colorMap[colorName] || '#FFFFFF';
}

async function initializeAddress(order) {
  let address;
  
  if (order.shipping_address) {
    address = order.shipping_address;
  } else {
    const addresses = await fetchData('data/opsi_alamat.json');
    if (addresses && addresses.length > 0) {
      address = addresses[0];
      order.shipping_address = address;
      saveOrder(order);
    } else {
      address = { label: 'Alamat tidak ditemukan', text: 'Silakan pilih alamat' };
    }
  }
  document.getElementById('address-label').textContent = address.label;
  document.getElementById('address-text').textContent = address.text;
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

// Helper fungsi untuk modal
function showModal(modalId) {
  document.getElementById('modal-overlay').classList.remove('modal-hidden');
  document.getElementById(modalId).classList.remove('modal-hidden');
}

function hideModal(modalId) {
  document.getElementById('modal-overlay').classList.add('modal-hidden');
  document.getElementById(modalId).classList.add('modal-hidden');
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
  const order = getOrderFromStorage();
  if (!order) {
    window.location.href = 'home.html';
    return;
  }
  
  const confirmModal = document.getElementById('confirm-modal');
  const cancelModal = document.getElementById('cancel-modal');
  const overlay = document.getElementById('modal-overlay');
  const confirmModalText = document.getElementById('confirm-modal-text');
  const confirmModalActions = document.getElementById('confirm-modal-actions');


  const totals = calculateTotals(order);
  renderOrder(order, totals);
  await initializeAddress(order);
  await renderAddressDropdown();
  await renderCouponDropdown();

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

  // Tutup dropdown saat klik di luar
  document.addEventListener('click', () => {
    toggleDropdown('address-dropdown', false);
    toggleDropdown('coupon-dropdown', false);
  });

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
  
  // Event Listener untuk Tombol Konfirmasi
  document.getElementById('confirm-btn').addEventListener('click', async (ev) => {
    ev.preventDefault();

    confirmModalText.innerText = 'Memproses Pesanan...';
    confirmModalActions.innerHTML = '';
    showModal('confirm-modal');

    setTimeout(() => {
      confirmModalText.innerText = 'Pembelian berhasil';

      const okButton = document.createElement('button');
      okButton.innerText = 'OK';
      okButton.className = 'btn-primary-modal';

      okButton.addEventListener('click', () => {
        hideModal('confirm-modal');
        
        const allOrders = JSON.parse(localStorage.getItem('all_orders')) || [];
        const currentOrder = getOrderFromStorage();
        
        if (currentOrder) {
          allOrders.push(currentOrder);
          localStorage.setItem('all_orders', JSON.stringify(allOrders));
        }

        localStorage.removeItem('current_order'); 
        window.location.href = 'home.html';
      });
      
      confirmModalActions.appendChild(okButton);
    }, 1500);
  });

  // Event Listener untuk Tombol Batal
  document.getElementById('cancel-btn').addEventListener('click', (ev) => {
    ev.preventDefault();
    showModal('cancel-modal');
  });

  document.getElementById('modal-cancel-yes').addEventListener('click', () => {
    hideModal('cancel-modal');
    localStorage.removeItem('current_order');
    window.location.href = 'home.html'; 
  });

  document.getElementById('modal-cancel-no').addEventListener('click', () => {
    hideModal('cancel-modal');
  });

  overlay.addEventListener('click', () => {
    if (!cancelModal.classList.contains('modal-hidden')) {
      hideModal('cancel-modal');
    }
  });
});