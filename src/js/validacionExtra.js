document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const checkboxes = document.querySelectorAll('.feature-checkbox');
    const featuresContainer = document.getElementById('featuresContainer');
    const featuresFeedback = document.getElementById('featuresFeedback');
    const productImage = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const productLaunch = document.getElementById('productLaunch');
    const productDescription = document.getElementById('productDescription');

    // Función para validar características seleccionadas
    function validateFeatures() {
        const checked = document.querySelectorAll('.feature-checkbox:checked');
        if (checked.length === 0) {
            featuresContainer.classList.add('is-invalid');
            featuresFeedback.style.display = 'block';
            return false;
        } else {
            featuresContainer.classList.remove('is-invalid');
            featuresFeedback.style.display = 'none';
            return true;
        }
    }

    // Función para validar imagen
    function validateImage() {
        const file = productImage.files[0];
        if (!file) {
            productImage.classList.add('is-invalid');
            return false;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            productImage.classList.add('is-invalid');
            productImage.nextElementSibling.textContent = 'Formato de imagen no válido.';
            imagePreviewContainer.style.display = 'none';
            return false;
        }

        if (file.size > 2 * 1024 * 1024) {
            productImage.classList.add('is-invalid');
            productImage.nextElementSibling.textContent = 'La imagen no debe exceder 2MB.';
            imagePreviewContainer.style.display = 'none';
            return false;
        }

        productImage.classList.remove('is-invalid');
        return true;
    }

    // Vista previa de imagen
    productImage.addEventListener('change', function () {
        if (validateImage()) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreviewContainer.style.display = 'block';
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    // Validación de campos en tiempo real
    productLaunch.addEventListener('input', () => {
        productLaunch.classList.remove('is-invalid');
    });

    productDescription.addEventListener('input', () => {
        productDescription.classList.remove('is-invalid');
    });

    checkboxes.forEach(cb => {
        cb.addEventListener('change', validateFeatures);
    });

    // Validación completa del formulario
    form.addEventListener('submit', function (e) {
        let isValid = true;

        // Validar características
        if (!validateFeatures()) isValid = false;

        // Validar fecha de lanzamiento
        const launchDate = new Date(productLaunch.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!productLaunch.value || launchDate <= today) {
            productLaunch.classList.add('is-invalid');
            isValid = false;
        }

        // Validar descripción
        if (productDescription.value.trim().length < 20) {
            productDescription.classList.add('is-invalid');
            isValid = false;
        }

        // Validar imagen
        if (!validateImage()) isValid = false;

        if (!isValid) {
            e.preventDefault();
            e.stopPropagation();
        }

        form.classList.add('was-validated');
    });
});
