const params = new URLSearchParams(window.location.search);
const courtId = Number(params.get("id"));

document.addEventListener("DOMContentLoaded", () => {
  renderDetail(courtId);
  updateCartBadge();
});