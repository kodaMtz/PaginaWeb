document.addEventListener("DOMContentLoaded", function () {
  // Elementos del DOM
  const clearDatabaseBtn = document.getElementById("clearDatabaseBtn");
  const successMessage = document.getElementById("successMessage");

  // Crear elementos de confirmación dinámicamente
  const confirmDiv = document.createElement("div");
  confirmDiv.className =
    "delete-confirmation d-none align-items-center gap-2 mt-2";
  confirmDiv.innerHTML = `
    <span class="text-danger fw-bold me-2">¿Confirmas eliminar todos los productos?</span>
    <button id="confirmDeleteYes" class="btn btn-sm btn-danger">Sí, eliminar</button>
    <button id="confirmDeleteNo" class="btn btn-sm btn-secondary">Cancelar</button>
  `;
  clearDatabaseBtn.parentNode.insertBefore(
    confirmDiv,
    clearDatabaseBtn.nextSibling
  );

  // Verificar si el botón existe en la página
  if (!clearDatabaseBtn) return;

  // Función para mostrar notificaciones
  function showNotification(message, isError = false) {
    if (!successMessage) return;

    successMessage.querySelector("span").textContent = message;
    successMessage.style.display = "block";
    successMessage.className = isError
      ? "alert alert-danger"
      : "alert alert-success";

    setTimeout(() => {
      successMessage.style.display = "none";
    }, 3000);
  }

  // Evento para el botón ELIMINAR BD
  clearDatabaseBtn.addEventListener("click", function () {
    // Obtener productos del sessionStorage
    const products = JSON.parse(sessionStorage.getItem("products")) || [];

    // Validar si hay registros (MANTENIENDO ESTA PARTE IGUAL)
    if (products.length === 0) {
      showNotification("La base de datos ya está vacía", true);
      return;
    }

    // Mostrar confirmación en el formulario
    clearDatabaseBtn.classList.add("d-none");
    confirmDiv.classList.remove("d-none");
  });

  // Evento para confirmar eliminación
  document
    .getElementById("confirmDeleteYes")
    .addEventListener("click", function () {
      // Eliminar la BD
      sessionStorage.removeItem("products");

      // Ocultar confirmación y mostrar botón nuevamente
      confirmDiv.classList.add("d-none");
      clearDatabaseBtn.classList.remove("d-none");

      // Mostrar notificación
      showNotification("Base de datos eliminada correctamente");

      // Esperar 2 segundos ANTES de recargar (parte original)
      setTimeout(() => {
        if (typeof updateProductsTable === "function") {
          updateProductsTable();
        } else {
          window.location.reload();
        }
      }, 1000);
    });

  // Evento para cancelar eliminación
  document
    .getElementById("confirmDeleteNo")
    .addEventListener("click", function () {
      confirmDiv.classList.add("d-none");
      clearDatabaseBtn.classList.remove("d-none");
    });
});
