document.addEventListener("DOMContentLoaded", function () {
  // Selección de elementos
  const form = document.getElementById("contenedor-formulario");
  const nombreInput = document.querySelector('input[placeholder="Nombre(s)"]');
  const apellidoInput = document.querySelector('input[placeholder="Apellido"]');
  const usuarioInput = document.querySelector(
    'input[placeholder="Nombre de usuario"]'
  );
  const emailInput = document.querySelector(
    'input[placeholder="CuentaGmail@gmail.com"]'
  );
  const passwordInput = document.getElementById("floatingPassword");

  // Agregar spans de error si no existen (para campos que no los tienen)
  function asegurarErrorSpan(input) {
    if (
      !input.nextElementSibling ||
      !input.nextElementSibling.classList.contains("error-mensaje")
    ) {
      const errorSpan = document.createElement("span");
      errorSpan.className = "error-mensaje";
      input.parentNode.insertBefore(errorSpan, input.nextSibling);
    }
    return input.nextElementSibling;
  }

  // Validación genérica
  function validarCampo(input, tipo) {
    const valor = input.value.trim();
    const errorSpan = asegurarErrorSpan(input);

    // Limpiar errores previos
    input.classList.remove("is-invalid", "is-valid");
    errorSpan.style.display = "none";
    errorSpan.textContent = "";

    try {
      // Validar campo vacío
      if (valor === "") {
        throw new Error(`El ${tipo} no puede estar vacío`);
      }

      // Validaciones específicas
      switch (tipo) {
        case "nombre":
        case "apellido":
          if (/\d/.test(valor)) {
            throw new Error(`El ${tipo} no puede contener números`);
          }
          if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) {
            throw new Error(`El ${tipo} solo puede contener letras`);
          }
          break;
        case "usuario":
          if (valor.length < 5) {
            throw new Error("El usuario debe tener al menos 5 caracteres");
          }
          if (/\s/.test(valor)) {
            throw new Error("El usuario no puede contener espacios");
          }
          if (!/^[a-zA-Z0-9_]+$/.test(valor)) {
            throw new Error(
              "El usuario solo puede contener letras, números y guiones bajos"
            );
          }
          break;
        case "email":
          if (!/^[\w.-]+@gmail\.com$/.test(valor)) {
            throw new Error("Debe ser una cuenta @gmail.com válida");
          }
          break;
        case "contraseña":
          if (valor.length < 8) {
            throw new Error("La contraseña debe tener al menos 8 caracteres");
          }
          break;
      }

      // Si pasa las validaciones
      input.classList.add("is-valid");
      return true;
    } catch (error) {
      errorSpan.textContent = error.message;
      errorSpan.style.display = "block";
      input.classList.add("is-invalid");
      return false;
    }
  }

  // Event listeners para validación en tiempo real
  nombreInput.addEventListener("blur", () =>
    validarCampo(nombreInput, "nombre")
  );
  apellidoInput.addEventListener("blur", () =>
    validarCampo(apellidoInput, "apellido")
  );
  usuarioInput.addEventListener("blur", () =>
    validarCampo(usuarioInput, "usuario")
  );
  emailInput.addEventListener("blur", () => validarCampo(emailInput, "email"));
  passwordInput.addEventListener("blur", () =>
    validarCampo(passwordInput, "contraseña")
  );

  // Validación al enviar el formulario
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validar todos los campos
    const validoNombre = validarCampo(nombreInput, "nombre");
    const validoApellido = validarCampo(apellidoInput, "apellido");
    const validoUsuario = validarCampo(usuarioInput, "usuario");
    const validoEmail = validarCampo(emailInput, "email");
    const validaPassword = validarCampo(passwordInput, "contraseña");

    // Si todos son válidos
    if (
      validoNombre &&
      validoApellido &&
      validoUsuario &&
      validoEmail &&
      validaPassword
    ) {
      // Crear objeto del usuario
      const nuevoUsuario = {
        nombre: nombreInput.value.trim(),
        apellido: apellidoInput.value.trim(),
        usuario: usuarioInput.value.trim(),
        correo: emailInput.value.trim(),
        contrasena: passwordInput.value.trim(),
      };

      // Guardar en localStorage
      localStorage.setItem("usuarioRegistrado", JSON.stringify(nuevoUsuario));
      alert("Registro exitoso. Puedes iniciar sesión ahora.");
      window.location.href = "Login.html";
    }
  });
});
