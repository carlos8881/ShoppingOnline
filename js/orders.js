document.addEventListener('DOMContentLoaded', function () {
    const account = localStorage.getItem('account');
    if (!account) {
        alert('請先登入');
        window.location.href = 'login.html';
        return;
    }

    fetch(`http://localhost:3000/get-orders?account=${account}`)
        .then(response => response.json())
        .then(orders => {
            const ordersContainer = document.getElementById('orders-container');

            orders.forEach(order => {
                const orderDiv = document.createElement('div');
                orderDiv.classList.add('order');

                const orderHeader = document.createElement('div');
                orderHeader.classList.add('order-header');
                orderHeader.innerHTML = `
                    <h3>訂單編號: ${order.order_number}</h3>
                    <p>成立日期: ${new Date(order.created_at).toLocaleString()}</p>
                    <p>總價: ${order.checkout_price}</p>
                    <p>運送方式: ${order.delivery_method === 'store-pickup' ? '超商取貨' : '宅配'}</p>
                `;
                orderDiv.appendChild(orderHeader);

                const orderItemsContainer = document.createElement('div');
                orderItemsContainer.classList.add('order-items-container');

                order.items.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('order-item');

                    itemDiv.innerHTML = `
                        <img src="${item.image_url}" alt="${item.name}">
                        <p>${item.name}</p>
                        <p>${item.price}</p>
                        <p>${item.quantity}</p>
                        <p>${item.price * item.quantity}</p>
                    `;

                    orderItemsContainer.appendChild(itemDiv);
                });

                orderDiv.appendChild(orderItemsContainer);
                ordersContainer.appendChild(orderDiv);
            });
        })
        .catch(error => console.error('Error fetching orders:', error));
});