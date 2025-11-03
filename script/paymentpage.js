// Mock data + simple localStorage CRUD for demo
const MOCK = {
  order: {
    id: 123,
    items: [
      { name: "Kaos Polos + Sablon", price: 17500 },
      { name: "Cotton Combed", price: 5000 },
      { name: "Desain", price: 5000 },
    ],
    qty: 100,
    shipping_cost: 12500,
    discount: 10000,
    tax: 12500,
    total: 4012500,
    shipping_address: {
      id: 1,
      label: "Kantor • Muhammad Fulan",
      text: "Jl. Moch Tamin No.26, Bojongsoang, Kabupaten Bandung, Jawa Barat, 18721",
    },
    payment_method: "bca",
    coupon: { code: "KU10", amount: 10000 },
  },
  coupons: [
    { code: "KU10", amount: 10000, valid: true },
    { code: "HEMAT20", amount: 20000, valid: true },
  ],
  addresses: [
    {
      id: 1,
      label: "Kantor • Muhammad Fulan",
      text: "Jl. Moch Tamin No.26, Bojongsoang, Kabupaten Bandung, Jawa Barat, 18721",
    },
    { id: 2, label: "Rumah • Ibu", text: "Jl. Contoh No.1, Jakarta Selatan" },
  ],
  payment_methods: [
    { id: "bca", name: "BCA M-Banking" },
    { id: "mandiri", name: "Mandiri M-Banking" },
    { id: "gopay", name: "Gopay" },
  ],
};

// Helper functions
function saveOrder(o) {
  localStorage.setItem("mock_order", JSON.stringify(o));
}

function loadOrder() {
  const stored = localStorage.getItem("mock_order");
  return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(MOCK.order));
}

function formatRp(num) {
  if (typeof num !== "number") return num;
  return "Rp" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function recalcTotal(o) {
  const itemsTotal = o.items.reduce((s, it) => s + it.price, 0) * (o.qty || 1);
  return itemsTotal + (o.shipping_cost || 0) + (o.tax || 0) - (o.discount || 0);
}

function renderOrder() {
  const o = loadOrder();
  // summary fields
  document.getElementById("order-qty").innerText = `${o.qty} pcs`;
  document.getElementById("shipping-cost").innerText = formatRp(
    o.shipping_cost
  );
  document.getElementById("discount-amount").innerText = formatRp(
    o.discount || 0
  );
  document.getElementById("tax-amount").innerText = formatRp(o.tax || 0);
  document.getElementById("subtotal-amount").innerText = formatRp(o.total);

  // address
  document.getElementById("address-label").innerText = o.shipping_address.label;
  document.getElementById("address-text").innerText = o.shipping_address.text;

  // coupon
  if (o.coupon) {
    document.getElementById(
      "coupon-title"
    ).innerText = `${o.coupon.code} berhasil dipakai`;
    document.getElementById("coupon-desc").innerText = `Potongan ${formatRp(
      o.coupon.amount
    )}`;
  } else {
    document.getElementById("coupon-title").innerText = "Pilih kupon";
    document.getElementById("coupon-desc").innerText =
      "Gunakan kupon untuk mendapat potongan";
  }

  // payment radio
  const radios = document.querySelectorAll('input[name="payment_method"]');
  radios.forEach((r) => (r.checked = r.value === o.payment_method));
}

// Dropdown rendering
function renderAddressDropdown() {
  const container = document.getElementById("address-dropdown");
  container.innerHTML = "";

  MOCK.addresses.forEach((addr, i) => {
    const item = document.createElement("div");
    item.className = "dropdown-item";
    item.dataset.id = addr.id;
    item.innerHTML = `
      <div style="flex:1">
        <div style="font-weight:600">${addr.label}</div>
        <div class="meta">${addr.text}</div>
      </div>
    `;

    item.addEventListener("click", () => {
      const o = loadOrder();
      o.shipping_address = addr;
      saveOrder(o);
      toggleDropdown("address-dropdown", false);
      renderOrder();
    });

    container.appendChild(item);
    if (i < MOCK.addresses.length - 1) {
      container.appendChild(document.createElement("div")).className =
        "divider";
    }
  });
}

function renderCouponDropdown() {
  const container = document.getElementById("coupon-dropdown");
  container.innerHTML = "";

  MOCK.coupons.forEach((cp, i) => {
    const item = document.createElement("div");
    item.className = "dropdown-item";
    item.dataset.code = cp.code;
    item.innerHTML = `
      <div style="flex:1">
        <div style="font-weight:600">${cp.code} — ${formatRp(cp.amount)}</div>
        <div class="meta">${cp.valid ? "Valid" : "Tidak valid"}</div>
      </div>
    `;

    item.addEventListener("click", () => {
      const o = loadOrder();
      if (cp.valid) {
        o.coupon = { code: cp.code, amount: cp.amount };
        o.discount = cp.amount;
        o.total = recalcTotal(o);
        saveOrder(o);
        renderOrder();
      } else {
        alert("Kupon tidak valid");
      }
      toggleDropdown("coupon-dropdown", false);
    });

    container.appendChild(item);
    if (i < MOCK.coupons.length - 1) {
      container.appendChild(document.createElement("div")).className =
        "divider";
    }
  });

  // Add remove coupon option
  if (loadOrder().coupon) {
    container.appendChild(document.createElement("div")).className = "divider";
    const remove = document.createElement("div");
    remove.className = "dropdown-item";
    remove.style.justifyContent = "center";
    remove.style.color = "#DC2525";
    remove.textContent = "Hapus Kupon";
    remove.addEventListener("click", () => {
      const o = loadOrder();
      delete o.coupon;
      o.discount = 0;
      o.total = recalcTotal(o);
      saveOrder(o);
      renderOrder();
      toggleDropdown("coupon-dropdown", false);
    });
    container.appendChild(remove);
  }
}

// Dropdown toggle
function toggleDropdown(id, show) {
  const el = document.getElementById(id);
  if (!el) return;
  if (show === undefined) show = el.hasAttribute("hidden");
  if (show) el.removeAttribute("hidden");
  else el.setAttribute("hidden", "");
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Payment method selection
  document.querySelectorAll('input[name="payment_method"]').forEach((r) => {
    r.addEventListener("change", (e) => {
      const o = loadOrder();
      o.payment_method = e.target.value;
      saveOrder(o);
      renderOrder();
    });
  });

  // Address dropdown
  document
    .getElementById("change-address-btn")
    .addEventListener("click", (ev) => {
      ev.preventDefault(); // cegah anchor (#) memicu scroll ke atas
      ev.stopPropagation();
      renderAddressDropdown();
      toggleDropdown("address-dropdown", true);
    });

  // Coupon dropdown
  document.getElementById("coupon-banner").addEventListener("click", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    renderCouponDropdown();
    toggleDropdown("coupon-dropdown", true);
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", () => {
    toggleDropdown("address-dropdown", false);
    toggleDropdown("coupon-dropdown", false);
  });

  // Prevent dropdown close when clicking inside
  document
    .getElementById("address-dropdown")
    .addEventListener("click", (e) => e.stopPropagation());
  document
    .getElementById("coupon-dropdown")
    .addEventListener("click", (e) => e.stopPropagation());

  // Delete order (with redirect)
  document
    .getElementById("delete-order-btn")
    .addEventListener("click", (ev) => {
      ev.preventDefault();
      if (!confirm("Anda yakin ingin menghapus order ini?")) return;
      localStorage.removeItem("mock_order");
      window.location.href = "../index.html"; // Sesuaikan path ke homepage
    });

  // Confirm payment
  document.getElementById("confirm-btn").addEventListener("click", async () => {
    const btn = document.getElementById("confirm-btn");
    btn.disabled = true;
    btn.innerText = "Memproses...";

    const o = loadOrder();
    const txn = {
      id: Date.now(),
      order_id: o.id,
      amount: o.total,
      provider: o.payment_method,
      status: "pending",
    };

    localStorage.setItem("mock_txn_" + txn.id, JSON.stringify(txn));

    setTimeout(() => {
      txn.status = "success";
      localStorage.setItem("mock_txn_" + txn.id, JSON.stringify(txn));
      btn.innerText = "Konfirmasi Pembayaran";
      btn.disabled = false;
      alert("Transaksi berhasil. ID: " + txn.id);
    }, 1200);
  });

  // Cancel button
  document.getElementById("cancel-btn").addEventListener("click", () => {
    if (confirm("Batalkan order ini?")) {
      window.location.href = "home.html";
    }
  });
});

// Initialize
(function init() {
  if (!localStorage.getItem("mock_order")) {
    saveOrder(MOCK.order);
  }
  renderOrder();
  renderAddressDropdown();
  renderCouponDropdown();
})();
