// Verificar si el usuario está autenticado
const isLoggedIn = localStorage.getItem('isLoggedIn');

if (isLoggedIn !== 'true') {
  // Redirigir a la página de login si no está autenticado
  window.location.href = './src/pages/Login.html';
}