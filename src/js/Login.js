document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validar campos
      let isValid = true;

      // Validar email
      if (!emailInput.value || !validateEmail(emailInput.value)) {
        emailError.textContent = "Por favor ingresa un email válido";
        isValid = false;
      } else {
        emailError.textContent = "";
      }

      // Validar contraseña
      if (!passwordInput.value || passwordInput.value.length < 6) {
        passwordError.textContent =
          "La contraseña debe tener al menos 6 caracteres";
        isValid = false;
      } else {
        passwordError.textContent = "";
      }

      if (isValid) {
        // Leer el usuario registrado
        const registeredUser = JSON.parse(localStorage.getItem('usuarioRegistrado'));

        if (registeredUser && registeredUser.correo === emailInput.value && registeredUser.contrasena === passwordInput.value) {
          // Usuario correcto
          localStorage.setItem('isLoggedIn', 'true');
          window.location.href = "../../index.html";
        } else {
          // Error de login
          alert('Correo o contraseña incorrectos.');
        }
      }
    });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});
