// ============================================================
//  CART.JS — Cart state management
// ============================================================

let cart = []; // Array of { courtId, courtName, slot, price }

async function addToCart(courtId, slot) {

  const exists = cart.find(
    (item) => item.courtId === courtId && item.slot.id === slot.id
  );

  if (exists) {
    showToast("Jadwal ini sudah ada di keranjang!");
    return false;
  }

  // simpan ke database
  await fetch("/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      courtId: courtId,
      slotId: slot.id
    })
  });

  const court = COURTS.find((c) => c.id === courtId);

  cart.push({
    cartId: `${courtId}-${slot.id}-${Date.now()}`,
    courtId,
    courtName: court.name,
    courtTag: court.tag,
    slot,
    price: court.price,
  });

  updateCartBadge();
  showToast(`✓ ${court.name} ${slot.label} ditambahkan!`);

  return true;
}

function removeFromCart(cartId) {
  cart = cart.filter((item) => item.cartId !== cartId);
  updateCartBadge();
  renderCart();
}

function resetCart() {
  cart = [];
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (badge) {
    badge.textContent = cart.length;
    badge.classList.toggle("has-items", cart.length > 0);
  }
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price, 0);
}

function formatRupiah(amount) {
  return "Rp " + amount.toLocaleString("id-ID");
}
