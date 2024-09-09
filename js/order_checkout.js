document.addEventListener('DOMContentLoaded', function () {
    const account = localStorage.getItem('account');
    if (!account) {
        alert('請先登入');
        window.location.href = 'login.html';
        return;
    }

    fetch(`http://3.112.202.79:3000/get-cart?account=${account}`)
        .then(response => response.json())
        .then(cartItems => {
            const orderItemsContainer = document.getElementById('order-items-container');
            const totalPriceElement = document.getElementById('total-price');
            const deliveryPriceElement = document.getElementById('delivery-price');
            const checkoutPriceElement = document.getElementById('checkout-price');
            const deliveryMethodSelect = document.getElementById('delivery-method');

            let totalPrice = 0;

            cartItems.forEach(item => {
                const itemTotal = item.price * item.quantity;

                const itemDiv = document.createElement('div');
                itemDiv.classList.add('order-item');

                itemDiv.innerHTML = `
                    <img src="${item.image_url}" alt="${item.name}" class="order-item-image">
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
                const deliveryMethod = deliveryMethodSelect.value;

                fetch('http://3.112.202.79:3000/checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        account: account,
                        selectedItems: cartItems,
                        deliveryMethod: deliveryMethod
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert(`訂單成功！總價：${data.checkoutPrice} 元`);
                        window.location.href = 'orders.html';
                    } else {
                        alert('訂單失敗');
                    }
                })
                .catch(error => console.error('Error placing order:', error));
            });

            updateCheckoutPrice();
        })
        .catch(error => console.error('Error fetching cart items:', error));
});