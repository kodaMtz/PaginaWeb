const form = document.getElementById("contactForm");
const nombreInput = document.getElementById("contactName");
const emailInput = document.getElementById("contactEmail");
const asuntoSelect = document.getElementById("contactSubject");
const mensajeTextarea = document.getElementById("contactMessage");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const subjectError = document.getElementById("subjectError");
const messageError = document.getElementById("messageError");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Limpiar errores anteriores
  nameError.textContent = "";
  emailError.textContent = "";
  subjectError.textContent = "";
  messageError.textContent = "";

  let valido = true;

  // Validación nombre
  const nombre = nombreInput.value.trim();
  if (nombre === "") {
    nameError.textContent = "El campo nombre es obligatorio.";
    valido = false;
  } else if (!/^[A-Za-z\s]+$/.test(nombre)) {
    nameError.textContent = "El nombre solo debe contener letras.";
    valido = false;
  }

  // Validación correo
  const email = emailInput.value.trim();
  if (email === "") {
    emailError.textContent = "El campo correo es obligatorio.";
    valido = false;
  } else if (!email.endsWith("@gmail.com")) {
    emailError.textContent = "El correo debe terminar en @gmail.com";
    valido = false;
  }

  // Validación asunto
  if (asuntoSelect.value === "") {
    subjectError.textContent = "Por favor selecciona un asunto.";
    valido = false;
  }

  // Validación mensaje (solo que no esté vacío)
  const mensaje = mensajeTextarea.value.trim();
  if (mensaje === "") {
    messageError.textContent = "El mensaje no puede estar vacío.";
    valido = false;
  }

  // Si todo es válido
  if (valido) {
    alert("¡Su mensaje a sido enviado correctamente 😊!");
    form.reset();
  }
});
