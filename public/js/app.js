// ============================================================
//  APP.JS — Navigation / routing
// ============================================================
let COURTS = [];

let currentPage = "home";
let currentCourtId = null;
let lastDetailCourtId = null;

let bookedSlots = [];
async function loadBookedSlots() {

  const res = await fetch("/api/booking/booked");
  const data = await res.json();

  bookedSlots = data.map(item => String(item.jadwal_id));

  console.log("BOOKED =", bookedSlots);

}

async function loadCourts() {
  const res = await fetch("/api/admin/lapangan");
  const data = await res.json();

  COURTS = data;

  console.log("DB COURTS =", COURTS);
}

// ── NAVIGATION ───────────────────────────────────────────
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function setStep(n) {
  ["step1", "step2", "step3"].forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle("active", i + 1 <= n);
    el.classList.toggle("done", i + 1 < n);
  });
}

function goHome() {
  currentPage = "home";
  showPage("pageHome");
  setStep(1);
  renderHome();
}

async function goToDetail(courtId) {

  await loadBookedSlots();

  currentPage = "detail";
  currentCourtId = courtId;
  lastDetailCourtId = courtId;

  showPage("pageDetail");
  setStep(1);

  renderDetail(courtId);
}

function goToCart() {
  currentPage = "cart";
  showPage("pageCart");
  setStep(2);
  renderCart();
}

function goToPayment() {
  if (cart.length === 0) {
    showToast("Keranjang kosong!");
    return;
  }

  currentPage = "payment";
  showPage("pagePayment");
  setStep(3);

  renderPayment();
}

function goBack() {
  if (currentPage === "cart") {
    if (lastDetailCourtId) {
      goToDetail(lastDetailCourtId);
    } else {
      goHome();
    }
  } else if (currentPage === "payment") {
    goToCart();
  } else {
    goHome();
  }
}

// ── SLOT CLICK ───────────────────────────────────────────
async function handleSlotClick(courtId, slotId) {

  const court = COURTS.find((c) => c.id === courtId);

  console.log("slotId =", slotId);
  console.log("schedules =", court?.schedules);

  if (!court || !court.schedules) return;

  const slot = court.schedules.find(
    (s) => String(s.id) === String(slotId)
  );

  if (!slot) {
    console.log("SLOT TIDAK DITEMUKAN");
    return;
  }

  // CEK APAKAH SUDAH DIBOOKING
  if (bookedSlots.includes(String(slotId))) {
    showToast("Jadwal sudah dibooking!");
    return;
  }

  const inCart = cart.find((item) => String(item.slot.id) === String(slotId));

  if (inCart) {
    removeFromCart(inCart.cartId);
    refreshDetailSlots(courtId);
    return;
  }

  const added = await addToCart(courtId, slot);

  if (added) {
    const el = document.getElementById(`slot-${slotId}`);

    if (el) {
      el.classList.add("adding");

      setTimeout(() => {
        el.classList.remove("adding");
        refreshDetailSlots(courtId);
      }, 400);
    }
  }
}

// ── PAYMENT SUBMIT ───────────────────────────────────────
function submitPayment() {

  console.log("TOMBOL DIKLIK");

  const selected = document.querySelector(
    'input[name="payMethod"]:checked'
  );

  console.log(selected);

  if (!selected) {
    showToast("Pilih metode pembayaran dulu!");
    return;
  }

  fetch("/api/payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      total_harga: getCartTotal(),
      metode_pembayaran: selected.value
    })
  })
  .then(res => {
    console.log("STATUS:", res.status);
    return res.json();
  })
  .then(data => {
    if (data.success) {
      fetch("/api/cart", {
        method: "DELETE"
      }).catch(err => {
        console.log("ERROR deleting cart:", err);
      });

      cart = [];
      updateCartBadge();

      currentPage = "success";
      showPage("pageSuccess");
      setStep(3);
    }
  })
  .catch(err => {
    console.log("ERROR:", err);
    showToast("Terjadi kesalahan saat memproses pembayaran");
  });

}

// ── INIT ─────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {

  await loadCourts();
  await loadBookedSlots();

  renderHome();
  updateCartBadge();

});
