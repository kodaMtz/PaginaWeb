// Al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  const showProductsBtn = document.getElementById("showProductsBtn");
  const productsCardContainer = document.getElementById(
    "registeredProductsCard"
  );
  const savedState = sessionStorage.getItem("productsVisible");

  // Estado inicial: OCULTO por defecto (false)
  const isVisible = savedState ? savedState === "true" : false;

  // Aplicar estado inicial al contenedor principal (oculto)
  productsCardContainer.style.display = isVisible ? "block" : "none";

  // Actualizar botón (texto inverso al estado)
  updateButtonText(showProductsBtn, !isVisible);

  // Configurar evento click
  showProductsBtn?.addEventListener("click", function () {
    const newState = productsCardContainer.style.display === "none";

    // Alternar visibilidad del contenedor principal
    productsCardContainer.style.display = newState ? "block" : "none";

    // Guardar estado
    sessionStorage.setItem("productsVisible", newState.toString());

    // Actualizar botón (texto inverso al nuevo estado)
    updateButtonText(this, !newState);
  });
});

// Función para actualizar el texto del botón
function updateButtonText(button, shouldShow) {
  button.innerHTML = `<i class="fas fa-${
    shouldShow ? "list" : "eye-slash"
  } me-1"></i> 
                     ${shouldShow ? "Mostrar Lista" : "Ocultar Lista"}`;
}
