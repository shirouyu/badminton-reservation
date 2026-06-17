// ============================================================
//  UI.JS — Render functions for all pages
// ============================================================

// ── COURT COLORS ──────────────────────────────────────────
const COURT_COLORS = {
  1: { bg: "#E8F5E9", accent: "#2E7D32", net: "#1B5E20" },
  2: { bg: "#E3F2FD", accent: "#1565C0", net: "#0D47A1" },
  3: { bg: "#F3E5F5", accent: "#6A1B9A", net: "#4A148C" },
  4: { bg: "#FFF3E0", accent: "#E65100", net: "#BF360C" },
  5: { bg: "#FCE4EC", accent: "#880E4F", net: "#4A0072" },
  6: { bg: "#E0F7FA", accent: "#006064", net: "#00363A" },
};

function getCourtSVG(courtId) {
  const c = COURT_COLORS[courtId] || COURT_COLORS[1];
  return `
  <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <rect width="320" height="200" fill="${c.bg}" rx="8"/>
    <!-- Court outline -->
    <rect x="30" y="25" width="260" height="150" fill="none" stroke="${c.accent}" stroke-width="2.5" rx="2"/>
    <!-- Center line -->
    <line x1="160" y1="25" x2="160" y2="175" stroke="${c.accent}" stroke-width="1.5" stroke-dasharray="4,3"/>
    <!-- Short service lines -->
    <line x1="30" y1="72" x2="290" y2="72" stroke="${c.accent}" stroke-width="1.5"/>
    <line x1="30" y1="128" x2="290" y2="128" stroke="${c.accent}" stroke-width="1.5"/>
    <!-- Long service lines doubles -->
    <line x1="50" y1="25" x2="50" y2="175" stroke="${c.accent}" stroke-width="1" opacity="0.5"/>
    <line x1="270" y1="25" x2="270" y2="175" stroke="${c.accent}" stroke-width="1" opacity="0.5"/>
    <!-- Net -->
    <line x1="30" y1="100" x2="290" y2="100" stroke="${c.net}" stroke-width="4"/>
    <line x1="30" y1="96" x2="30" y2="104" stroke="${c.net}" stroke-width="3"/>
    <line x1="290" y1="96" x2="290" y2="104" stroke="${c.net}" stroke-width="3"/>
    <!-- Net pattern -->
    ${Array.from({ length: 18 }, (_, i) =>
      `<line x1="${46 + i * 14}" y1="97" x2="${46 + i * 14}" y2="103" stroke="${c.net}" stroke-width="1" opacity="0.6"/>`
    ).join("")}
    <!-- Shuttle -->
    <text x="155" y="60" font-size="22" text-anchor="middle">🏸</text>
    <!-- Court name badge -->
    <rect x="125" y="155" width="70" height="22" fill="${c.accent}" rx="11"/>
    <text x="160" y="170" font-family="Inter,sans-serif" font-size="11" font-weight="700" fill="white" text-anchor="middle">COURT ${courtId}</text>
  </svg>`;
}

// ── HOME ─────────────────────────────────────────────────
function renderHome() {
  const grid = document.getElementById("courtGrid");
  grid.innerHTML = COURTS.map((court) => `
    <div class="court-card" onclick="goToDetail(${court.id})">
      <div class="card-image">
      <img src="${court.image}" alt="${court.name}">
      </div>
      <div class="card-body">
        <div class="card-header-row">
          <h3 class="card-name">${court.name}</h3>
          <span class="tag tag-${court.tagColor}">${court.tag}</span>
        </div>
        <p class="card-location">📍 ${court.location}</p>
        <div class="card-footer">
          <div class="card-price">
            <span class="price-val">${formatRupiah(court.price)}</span>
            <span class="price-unit">/jam</span>
          </div>
          <button class="btn-detail" onclick="event.stopPropagation(); goToDetail(${court.id})">
            Lihat Detail →
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

// ── DETAIL ───────────────────────────────────────────────
function renderDetail(courtId) {
  const court = COURTS.find((c) => c.id === courtId);
  if (!court) return;

  const slotStatuses = {};
  court.schedules.forEach((s) => {

    if (bookedSlots.includes(String(s.id))) {
      slotStatuses[s.id] = "booked";
      return;
    }

    const inCart = cart.find(
      (item) => item.slot.id === s.id
    );

    slotStatuses[s.id] =
      inCart ? "in-cart" : "available";

  });

  const content = document.getElementById("detailContent");
  content.innerHTML = `
    <div class="detail-back">
      <button class="btn-ghost" onclick="goHome()">← Semua Lapangan</button>
    </div>

    <div class="detail-grid">
      <!-- Left: image + info -->
      <div class="detail-left">
        <div class="detail-image">
        <img src="${court.image}" alt="${court.name}">
        </div>
        <div class="detail-meta-card">
          <div class="detail-title-row">
            <h1 class="detail-name">${court.name}</h1>
            <span class="tag tag-${court.tagColor}">${court.tag}</span>
          </div>
          <p class="detail-location">📍 ${court.location}</p>
          <div class="detail-price-row">
            <span class="detail-price-val">${formatRupiah(court.price)}</span>
            <span class="detail-price-unit">per jam</span>
          </div>
        </div>

        <div class="detail-section">
          <h3 class="section-heading">Deskripsi</h3>
          <p class="detail-desc">${court.description}</p>
        </div>

        <div class="detail-section">
          <h3 class="section-heading">Fasilitas</h3>
          <div class="facility-grid">
            ${court.fasilitas.map((f) => `
              <div class="facility-item">
                <span class="fac-icon">✓</span>
                <span>${f}</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Right: schedules -->
      <div class="detail-right">
        <div class="schedule-card">
          <h3 class="section-heading">Jadwal Tersedia</h3>
          <p class="schedule-hint">Klik jadwal untuk menambah ke keranjang</p>
          <div class="schedule-grid" id="scheduleGrid-${court.id}">
            ${court.schedules.map((slot) => {
              const status = slotStatuses[slot.id];
              return `
                <div class="slot-card ${status}" 
                     id="slot-${slot.id}"
                     onclick="handleSlotClick(${court.id}, ${slot.id})">
                  <div class="slot-time">${slot.label}</div>
                  <div class="slot-status-label">
                    ${
                      status === "booked"
                        ? "Sudah Dibooking"
                        : status === "in-cart"
                        ? "✓ Di Keranjang"
                        : "Tersedia"
                    }
                  </div>
                </div>
              `;
            }).join("")}
          </div>

          <div class="cart-preview" id="cartPreview">
            ${renderCartPreviewContent()}
          </div>

          <button class="btn-primary full-width" onclick="goToCart()" ${cart.length === 0 ? "disabled" : ""} id="goCartBtn">
            Lihat Keranjang (${cart.length}) →
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderCartPreviewContent() {
  if (cart.length === 0) return `<p class="empty-cart-hint">Belum ada jadwal dipilih</p>`;
  return `
    <div class="preview-list">
      ${cart.map((item) => `
        <div class="preview-item">
          <span class="preview-name">${item.courtName}</span>
          <span class="preview-time">${item.slot.label}</span>
          <span class="preview-price">${formatRupiah(item.price)}</span>
        </div>
      `).join("")}
      <div class="preview-total">
        <span>Total</span>
        <strong>${formatRupiah(getCartTotal())}</strong>
      </div>
    </div>
  `;
}

function refreshDetailSlots(courtId) {
  const court = COURTS.find((c) => c.id === courtId);
  court.schedules.forEach((slot) => {
    const el = document.getElementById(`slot-${slot.id}`);
    if (!el) return;
    const inCart = cart.find((item) => item.slot.id === slot.id);
    el.className = `slot-card ${inCart ? "in-cart" : "available"}`;
    el.querySelector(".slot-status-label").textContent =
      inCart ? "✓ Di Keranjang" : "Tersedia";
  });

  const preview = document.getElementById("cartPreview");
  if (preview) preview.innerHTML = renderCartPreviewContent();

  const goBtn = document.getElementById("goCartBtn");
  if (goBtn) {
    goBtn.disabled = cart.length === 0;
    goBtn.textContent = `Lihat Keranjang (${cart.length}) →`;
  }
}

// ── CART ─────────────────────────────────────────────────
function renderCart() {
  const wrap = document.getElementById("cartContent");
  if (!wrap) return;

  if (cart.length === 0) {
    wrap.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <h3>Keranjang Kosong</h3>
        <p>Pilih jadwal dari halaman lapangan untuk memulai reservasi.</p>
        <button class="btn-primary" onclick="goHome()">Pilih Lapangan</button>
      </div>
    `;
    return;
  }

  // Group by court
  const grouped = {};
  cart.forEach((item) => {
    if (!grouped[item.courtId]) {
      grouped[item.courtId] = { courtName: item.courtName, courtTag: item.courtTag, items: [] };
    }
    grouped[item.courtId].items.push(item);
  });

  const groupsHTML = Object.entries(grouped).map(([courtId, group]) => `
    <div class="cart-group">
      <div class="cart-group-header">
        <div class="cart-court-icon">${getCourtSVG(Number(courtId))}</div>
        <div class="cart-group-info">
          <span class="cart-court-name">${group.courtName}</span>
          <span class="tag tag-green">${group.courtTag}</span>
        </div>
      </div>
      <div class="cart-items">
        ${group.items.map((item) => `
          <div class="cart-item" id="cartItem-${item.cartId}">
            <div class="cart-item-left">
              <div class="cart-slot-time">🕐 ${item.slot.label}</div>
              <div class="cart-slot-price">${formatRupiah(item.price)}</div>
            </div>
            <button class="btn-remove" onclick="removeFromCart('${item.cartId}')">✕ Hapus</button>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");

  const summaryHTML = `
    <div class="cart-summary">
      <div class="summary-rows">
        <div class="summary-row">
          <span>Jumlah Lapangan</span>
          <span>${cart.length} sesi</span>
        </div>
        <div class="summary-row total-row">
          <span>Total Pembayaran</span>
          <strong>${formatRupiah(getCartTotal())}</strong>
        </div>
      </div>
    </div>
  `;

  wrap.innerHTML = groupsHTML + summaryHTML;
}

// ── PAYMENT ──────────────────────────────────────────────
function renderPayment() {
  const wrap = document.getElementById("paymentContent");
  if (!wrap) return;

  // Group for summary
  const grouped = {};
  cart.forEach((item) => {
    if (!grouped[item.courtId]) {
      grouped[item.courtId] = { courtName: item.courtName, items: [] };
    }
    grouped[item.courtId].items.push(item);
  });

  const orderRows = Object.entries(grouped).map(([, group]) =>
    group.items.map((item) => `
      <div class="payment-order-row">
        <span>${group.courtName} · ${item.slot.label}</span>
        <span>${formatRupiah(item.price)}</span>
      </div>
    `).join("")
  ).join("");

  wrap.innerHTML = `
    <div class="payment-grid">
      <!-- Left: order summary -->
      <div class="payment-left">
        <div class="payment-section">
          <h3 class="section-heading">Ringkasan Pesanan</h3>
          <div class="payment-order-list">
            ${orderRows}
            <div class="payment-order-divider"></div>
            <div class="payment-order-row total">
              <strong>Total (${cart.length} sesi)</strong>
              <strong class="total-highlight">${formatRupiah(getCartTotal())}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: payment method -->
      <div class="payment-right">
        <div class="payment-section">
          <h3 class="section-heading">Metode Pembayaran</h3>
          <div class="payment-methods">

            <label class="method-card" id="method-qris">
              <input type="radio" name="payMethod" value="qris" onchange="selectMethod('qris')"/>
              <div class="method-icon">⬛</div>
              <div class="method-info">
                <div class="method-name">QRIS</div>
                <div class="method-desc">Scan QR · GoPay, OVO, DANA, dll</div>
              </div>
              <span class="method-check">✓</span>
            </label>

            <label class="method-card" id="method-ewallet">
              <input type="radio" name="payMethod" value="ewallet" onchange="selectMethod('ewallet')"/>
              <div class="method-icon">📱</div>
              <div class="method-info">
                <div class="method-name">E-Wallet</div>
                <div class="method-desc">GoPay · OVO · DANA · ShopeePay</div>
              </div>
              <span class="method-check">✓</span>
            </label>

            <label class="method-card" id="method-bank">
              <input type="radio" name="payMethod" value="bank" onchange="selectMethod('bank')"/>
              <div class="method-icon">🏦</div>
              <div class="method-info">
                <div class="method-name">Transfer Bank</div>
                <div class="method-desc">BCA · BRI · BNI · Mandiri · BSI</div>
              </div>
              <span class="method-check">✓</span>
            </label>

          </div>

          <!-- Dynamic method detail -->
          <div class="method-detail-box" id="methodDetail" style="display:none"></div>

          <div class="payment-footer">
            <div class="pay-total-row">
              <span>Bayar Sekarang</span>
              <strong class="pay-total-amount">${formatRupiah(getCartTotal())}</strong>
            </div>
            <div class="payment-action-row">
              <button class="btn-outline" onclick="goToCart()">← Kembali</button>
              <button class="btn-primary" onclick="submitPayment()" id="payBtn">Bayar Sekarang</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function selectMethod(method) {
  // Remove active from all
  document.querySelectorAll(".method-card").forEach((c) => c.classList.remove("active"));
  document.getElementById(`method-${method}`).classList.add("active");

  const box = document.getElementById("methodDetail");
  box.style.display = "block";

  const details = {
    qris: `
      <div class="qr-container">
        <div class="qr-mock">
          <svg viewBox="0 0 100 100" width="120" height="120">
            <rect width="100" height="100" fill="white" rx="4"/>
            <rect x="10" y="10" width="30" height="30" fill="none" stroke="#111" stroke-width="3"/>
            <rect x="15" y="15" width="20" height="20" fill="#111"/>
            <rect x="60" y="10" width="30" height="30" fill="none" stroke="#111" stroke-width="3"/>
            <rect x="65" y="15" width="20" height="20" fill="#111"/>
            <rect x="10" y="60" width="30" height="30" fill="none" stroke="#111" stroke-width="3"/>
            <rect x="15" y="65" width="20" height="20" fill="#111"/>
            ${Array.from({length:5},(_, i)=>Array.from({length:5},(_,j)=>
              Math.random()>0.5?`<rect x="${60+j*8}" y="${60+i*8}" width="7" height="7" fill="#111"/>`:""
            ).join("")).join("")}
            <text x="50" y="54" text-anchor="middle" font-size="6" fill="#111">SmashCourt</text>
          </svg>
        </div>
        <p class="qr-hint">Scan dengan aplikasi e-wallet atau mobile banking kamu</p>
        <p class="qr-expire">⏱ QR berlaku 10 menit</p>
      </div>`,
    ewallet: `
      <div class="ewallet-list">
        <p class="method-sub-label">Pilih e-wallet:</p>
        <div class="ewallet-grid">
          ${["GoPay", "OVO", "DANA", "ShopeePay", "LinkAja"].map((w) => `
            <button class="ewallet-btn" onclick="selectWallet(this, '${w}')">${w}</button>
          `).join("")}
        </div>
        <div id="walletDetail"></div>
      </div>`,
    bank: `
      <div class="bank-list">
        <p class="method-sub-label">Pilih bank:</p>
        <div class="bank-grid">
          ${[
            { name: "BCA", color: "#003087" },
            { name: "BRI", color: "#003580" },
            { name: "BNI", color: "#f90" },
            { name: "Mandiri", color: "#0e4c96" },
            { name: "BSI", color: "#1a7a4a" },
          ].map((b) => `
            <button class="bank-btn" style="--bank-color:${b.color}" onclick="selectBank(this, '${b.name}')">${b.name}</button>
          `).join("")}
        </div>
        <div id="bankDetail"></div>
      </div>`,
  };

  box.innerHTML = details[method] || "";
}

function selectWallet(btn, name) {
  document.querySelectorAll(".ewallet-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("walletDetail").innerHTML = `
    <div class="transfer-info">
      <p>Nomor ${name}: <strong>082345678901</strong></p>
      <p>Atas nama: <strong>SmashCourt Indonesia</strong></p>
      <p>Nominal: <strong>${formatRupiah(getCartTotal())}</strong></p>
    </div>`;
}

function selectBank(btn, name) {
  document.querySelectorAll(".bank-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  const accounts = { BCA: "1234567890", BRI: "0987654321", BNI: "1122334455", Mandiri: "9988776655", BSI: "7766554433" };
  document.getElementById("bankDetail").innerHTML = `
    <div class="transfer-info">
      <p>Bank ${name} · No. Rekening: <strong>${accounts[name]}</strong></p>
      <p>Atas nama: <strong>SmashCourt Indonesia</strong></p>
      <p>Nominal: <strong>${formatRupiah(getCartTotal())}</strong></p>
    </div>`;
}

// ── TOAST ────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}
