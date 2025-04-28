document.addEventListener('DOMContentLoaded', function () {
    // Variables globales
    let products = [];
    let originalProductData = null;
    let currentEditIndex = null;

    // Elementos del DOM
    const productForm = document.getElementById('productForm');
    const productsTableBody = document.getElementById('productsTableBody');
    const productsTableContainer = document.getElementById('productsTableContainer');
    const noProductsMessage = document.getElementById('noProductsMessage');
    const warrantySlider = document.getElementById('productWarranty');
    const warrantyValue = document.getElementById('warrantyValue');
    const successMessage = document.getElementById('successMessage');

    // Vista previa de la imagen
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const productImageInput = document.getElementById('productImage');

    // Event Listeners iniciales
    productForm.addEventListener('submit', handleFormSubmit);
    warrantySlider.addEventListener('input', updateWarrantyValue);
    productImageInput.addEventListener('change', displayImagePreview);

    // Validación de campos numéricos para evitar negativos
    document.getElementById('productPrice').addEventListener('input', function () {
        if (this.value < 0) {
            this.value = 0;
            showNegativeNumberAlert();
        }
    });

    document.getElementById('productStock').addEventListener('input', function () {
        if (this.value < 0) {
            this.value = 0;
            showNegativeNumberAlert();
        }
    });

    function showNegativeNumberAlert() {
        alert('No se permiten valores negativos. El valor ha sido ajustado a 0.');
    }

    // Actualizar el valor de la garantía en el slider
    function updateWarrantyValue() {
        warrantyValue.textContent = warrantySlider.value;
    }

    // Mostrar vista previa de la imagen
    function displayImagePreview(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreviewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }

    // Manejar el envío del formulario
    function handleFormSubmit(event) {
        event.preventDefault();

        // Validación de Bootstrap
        if (!productForm.checkValidity()) {
            event.stopPropagation();
            productForm.classList.add('was-validated');
            return;
        }

        // Validación adicional del procesador
        const processorSelected = document.querySelector('input[name="processor"]:checked');
        if (!processorSelected) {
            alert('Por favor selecciona un procesador');
            return;
        }

        // Obtener valores del formulario
        const product = {
            name: document.getElementById('productName').value,
            brand: document.getElementById('productBrand').value,
            price: parseFloat(document.getElementById('productPrice').value).toFixed(2),
            stock: document.getElementById('productStock').value,
            warranty: warrantySlider.value,
            processor: processorSelected.value,
            features: getSelectedFeatures(),
            launchDate: document.getElementById('productLaunch').value,
            description: document.getElementById('productDescription').value,
            image: imagePreview.src || 'https://via.placeholder.com/100?text=Sin+imagen'
        };

        // Agregar nuevo producto
        products.push(product);

        // Mostrar mensaje de éxito
        showSuccessMessage('Producto registrado correctamente');

        // Actualizar la tabla
        updateProductsTable();

        // Resetear el formulario
        resetForm();
    }

    // Mostrar mensaje de éxito
    function showSuccessMessage(message) {
        successMessage.querySelector('span').textContent = message;
        successMessage.style.display = 'block';

        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }

    // Obtener características seleccionadas
    function getSelectedFeatures() {
        const features = [];
        if (document.getElementById('featureSSD').checked) features.push('SSD');
        if (document.getElementById('featureGraphics').checked) features.push('Tarjeta Gráfica');
        if (document.getElementById('featureTouch').checked) features.push('Pantalla Táctil');
        return features.length > 0 ? features.join(', ') : 'Ninguna';
    }

    // Actualizar la tabla de productos
    function updateProductsTable() {
        if (products.length === 0) {
            productsTableContainer.style.display = 'none';
            noProductsMessage.style.display = 'block';
            return;
        }

        productsTableContainer.style.display = 'block';
        noProductsMessage.style.display = 'none';

        // Limpiar la tabla
        productsTableBody.innerHTML = '';

        // Llenar la tabla con los productos
        products.forEach((product, index) => {
            const row = document.createElement('tr');
            row.setAttribute('data-index', index);

            // Formatear valores para mostrar
            const formattedPrice = typeof product.price === 'number' ? product.price.toFixed(2) : product.price;
            const formattedWarranty = product.warranty ? `${product.warranty} meses` : '0 meses';
            const formattedStock = product.stock || '0';

            row.innerHTML = `
                <td><img src="${product.image}" alt="${product.name}" class="img-thumbnail" width="80"></td>
                <td class="editable" data-field="name">${product.name}</td>
                <td class="editable" data-field="brand">${product.brand}</td>
                <td class="editable" data-field="price">$${formattedPrice}</td>
                <td class="editable" data-field="stock">${formattedStock}</td>
                <td class="editable" data-field="warranty">${formattedWarranty}</td>
                <td>${product.processor}</td>
                <td>${product.features}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary edit-product" data-index="${index}" title="Editar">
                        <img src="../assets/icon/Editar.png" alt="Editar" width="20">
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-product" data-index="${index}" title="Eliminar">
                        <img src="../assets/icon/Eliminar.png" alt="Eliminar" width="20">
                    </button>
                </td>
            `;

            productsTableBody.appendChild(row);
        });

        // Configurar event listeners
        setupEventListeners();
    }

    // Configurar event listeners para editar y eliminar
    function setupEventListeners() {
        document.querySelectorAll('.edit-product').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const index = parseInt(this.getAttribute('data-index'));
                if (currentEditIndex !== null && currentEditIndex !== index) {
                    cancelEdit(currentEditIndex);
                }
                enableEditMode(index);
            });
        });

        document.querySelectorAll('.delete-product').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const index = parseInt(this.getAttribute('data-index'));
                showDeleteConfirmation(index);
            });
        });
    }

    // Mostrar confirmación para eliminar
    function showDeleteConfirmation(index) {
        const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
        document.getElementById('confirmDeleteBtn').onclick = function () {
            deleteProduct(index);
            modal.hide();
        };
        modal.show();
    }

    // Eliminar un producto
    function deleteProduct(index) {
        // Si estamos editando el producto que se va a eliminar, cancelar primero
        if (currentEditIndex === index) {
            originalProductData = null;
            currentEditIndex = null;
        }

        products.splice(index, 1);
        updateProductsTable();

        // Ocultar tabla si no hay productos
        if (products.length === 0) {
            productsTableContainer.style.display = 'none';
            noProductsMessage.style.display = 'block';
        }

        showSuccessMessage('Producto eliminado correctamente');
    }

    // Habilitar modo edición para una fila
    function enableEditMode(index) {
        // Cancelar edición actual si existe
        if (currentEditIndex !== null && currentEditIndex !== index) {
            cancelEdit(currentEditIndex);
        }

        currentEditIndex = index;
        const product = products[index];
        originalProductData = { ...product }; // Guardar copia de los datos originales

        const row = document.querySelector(`tr[data-index="${index}"]`);

        // Convertir celdas editables a inputs
        row.querySelectorAll('.editable').forEach(cell => {
            const field = cell.getAttribute('data-field');
            let value = product[field];

            // Eliminar símbolo de dólar si es el campo de precio
            if (field === 'price') {
                value = value.toString().replace('$', '');
            }

            // Eliminar "meses" si es el campo de garantía
            if (field === 'warranty') {
                value = value.toString().replace(' meses', '');
            }

            cell.innerHTML = `<input type="text" class="form-control form-control-sm" value="${value}" data-field="${field}">`;
        });

        // Cambiar botones de editar/eliminar por guardar/cancelar
        const actionsCell = row.querySelector('td:last-child');
        actionsCell.innerHTML = `
            <button class="btn btn-sm btn-success save-product" data-index="${index}" title="Guardar">
                <img src="../assets/icon/Guardar.png" alt="Guardar" width="20">
            </button>
            <button class="btn btn-sm btn-secondary cancel-edit" data-index="${index}" title="Cancelar">
                <img src="../assets/icon/Cancelar.png" alt="Cancelar" width="20">
            </button>
        `;

        // Agregar event listeners a los nuevos botones
        actionsCell.querySelector('.save-product').addEventListener('click', function (e) {
            e.preventDefault();
            saveProductChanges(index);
        });

        actionsCell.querySelector('.cancel-edit').addEventListener('click', function (e) {
            e.preventDefault();
            cancelEdit(index);
        });
    }

    // Guardar cambios de un producto
    function saveProductChanges(index) {
        const row = document.querySelector(`tr[data-index="${index}"]`);
        const updatedProduct = { ...products[index] };
        let isValid = true;

        // Recoger los valores editados con validación
        row.querySelectorAll('input').forEach(input => {
            const field = input.getAttribute('data-field');
            let value = input.value.trim();

            try {
                if (field === 'price') {
                    value = parseFloat(value);
                    if (isNaN(value)) throw new Error('Precio debe ser un número');
                    if (value < 0) throw new Error('Precio no puede ser negativo');
                    value = value.toFixed(2);
                } else if (field === 'warranty') {
                    value = parseInt(value);
                    if (isNaN(value)) throw new Error('Garantía debe ser un número');
                    if (value < 0) throw new Error('Garantía no puede ser negativa');
                } else if (field === 'stock') {
                    value = parseInt(value);
                    if (isNaN(value)) throw new Error('Stock debe ser un número');
                    if (value < 0) throw new Error('Stock no puede ser negativo');
                }

                updatedProduct[field] = value;
            } catch (error) {
                alert(`Error en ${field}: ${error.message}`);
                isValid = false;
            }
        });

        if (!isValid) return;

        // Actualizar el producto en el array
        products[index] = updatedProduct;
        originalProductData = null;
        currentEditIndex = null;

        // Mostrar mensaje de éxito
        showSuccessMessage('Producto actualizado correctamente');

        // Actualizar la tabla
        updateProductsTable();
    }

    // Cancelar edición y restaurar valores originales
    function cancelEdit(index) {
        if (originalProductData) {
            products[index] = { ...originalProductData };
        }
        originalProductData = null;
        currentEditIndex = null;
        updateProductsTable();
    }

    // Resetear el formulario
    function resetForm() {
        productForm.reset();
        productForm.classList.remove('was-validated');
        imagePreviewContainer.style.display = 'none';
        imagePreview.src = '';
        warrantyValue.textContent = warrantySlider.value;

        // Limpiar selección de procesador
        document.querySelectorAll('input[name="processor"]').forEach(radio => {
            radio.checked = false;
        });

        // Limpiar checkboxes de características
        document.getElementById('featureSSD').checked = false;
        document.getElementById('featureGraphics').checked = false;
        document.getElementById('featureTouch').checked = false;
    }

    // Inicializar el valor de la garantía
    updateWarrantyValue();
});