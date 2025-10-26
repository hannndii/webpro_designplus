const productForm = document.getElementById('product-form');
const quantityInput = document.getElementById('quantity');
const qtyBtns = document.querySelectorAll('.qty-btn');

productForm.addEventListener('change', function(e) {
    const material = document.querySelector('input[name="material"]:checked').value;
    const color = document.querySelector('input[name="color"]:checked').value;
    const design = document.querySelector('input[name="design"]:checked').value;
    const quantity = parseInt(quantityInput.value);

    document.getElementById('product-name').innerText = `Kaos ${material} ${color}`;
    document.getElementById('material').innerText = material;
    document.getElementById('color').innerText = color;
    document.getElementById('design-option').innerText = design;
    document.getElementById('total').innerText = quantity;
});

qtyBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const isPlus = this.classList.contains('plus');
        const currentVal = parseInt(quantityInput.value);
        
        if (isPlus) {
            quantityInput.value = currentVal + 1;
        } else if (currentVal > 1) {
            quantityInput.value = currentVal - 1;
        }
    });
});

productForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const selections = {
        material: formData.get('material'),
        color: formData.get('color'),
        design: formData.get('design'),
        quantity: formData.get('quantity')
    };
    
    console.log('Selected options:', selections);
});

document.getElementById('buy-button').onclick = function() {
    window.location.href = 'paymentpage.html'
}