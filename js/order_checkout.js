document.addEventListener('DOMContentLoaded', function () {
    const selectedItems = JSON.parse(localStorage.getItem('selectedItems'));
    const orderItemsContainer = document.getElementById('order-items-container');
    const totalPriceElement = document.getElementById('total-price');
    const deliveryPriceElement = document.getElementById('delivery-price');
    const checkoutPriceElement = document.getElementById('checkout-price');
    const deliveryMethodSelect = document.getElementById('delivery-method');

    let totalPrice = 0;

    selectedItems.forEach(item => {
        const itemTotal = item.price * item.quantity;

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('order-item');

        itemDiv.innerHTML = `
            <img src="${item.image_url}" alt="${item.name}">
            <p>${item.name}</p>
            <p>${item.price}</p>
            <p>${item.quantity}</p>
            <p>${itemTotal}</p>
        `;

        orderItemsContainer.appendChild(itemDiv);
        totalPrice += itemTotal;
    });

    totalPriceElement.textContent = totalPrice;

    function updateCheckoutPrice() {
        const deliveryPrice = parseInt(deliveryMethodSelect.selectedOptions[0].getAttribute('data-price'));
        deliveryPriceElement.textContent = deliveryPrice;
        checkoutPriceElement.textContent = totalPrice + deliveryPrice;
    }

    deliveryMethodSelect.addEventListener('change', updateCheckoutPrice);

    document.getElementById('place-order-button').addEventListener('click', function () {
        const account = localStorage.getItem('account');
        const deliveryMethod = deliveryMethodSelect.value;

        fetch('http://localhost:3000/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                account: account,
                selectedItems: selectedItems,
                deliveryMethod: deliveryMethod
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`訂單成功！總價：${data.checkoutPrice} 元`);
                localStorage.removeItem('selectedItems');
                window.location.href = 'index.html';
            } else {
                alert('訂單失敗');
            }
        })
        .catch(error => console.error('Error placing order:', error));
    });

    updateCheckoutPrice();
});