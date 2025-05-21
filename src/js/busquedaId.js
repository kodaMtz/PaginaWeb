document.getElementById("searchButton").addEventListener("click", function () {
  const searchInput = document.getElementById("searchById");
  const searchValue = searchInput.value.trim();
  const rows = document.querySelectorAll("#productsTableBody tr");
  const tableContainer = document.getElementById("productsTableContainer");

  // Validación: solo números
  if (searchValue === "") {
    rows.forEach((row) => (row.style.display = ""));
    removeNoMatchMessage();
    return;
  }

  if (!/^\d+$/.test(searchValue)) {
    showNotification(
      "❌ El ID debe contener solo números. Nada de letras ni símbolos."
    );
    searchInput.focus();
    return;
  }

  // ✅ Verificar si el ID existe en LocalStorage["products"]
  const storedData = localStorage.getItem("products");
  if (storedData) {
    try {
      const products = JSON.parse(storedData);
      const exists = products.some((product) => product.Id === searchValue);
      if (!exists) {
        showNotification(
          "⚠️ El ID no se encuentra en los productos almacenados."
        );
      }
    } catch (e) {
      console.error("Error al parsear sessionStorage['products']:", e);
    }
  } else {
    showNotification("💾 La base de datos esta Vacia");
  }

  let found = false;

  rows.forEach((row) => {
    const idCell = row.querySelector("td:first-child");
    const idValue = idCell ? idCell.textContent.trim() : "";

    if (idValue === searchValue) {
      row.style.display = "";
      found = true;
    } else {
      row.style.display = "none";
    }
  });

  if (!found) {
    showNoMatchMessage(tableContainer);
  } else {
    removeNoMatchMessage();
  }
});

// ✅ Notificación visual en vez de alert()
function showNotification(message) {
  const existing = document.getElementById("toastNotification");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "toastNotification";
  toast.className =
    "toast align-items-center text-bg-danger border-0 show position-fixed bottom-0 end-0 m-3";
  toast.setAttribute("role", "info");
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 5000);
}
