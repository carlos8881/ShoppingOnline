document.addEventListener('DOMContentLoaded', function () {
    const account = localStorage.getItem('account');
    if (!account) {
        alert('請先登入');
        window.location.href = 'login.html';
        return;
    }

    fetch(`${window.AppConfig.API_URL}/orders/get-orders?account=${account}`)
        .then(response => response.json())
        .then(orders => {
            const completedOrdersContainer = document.getElementById('completed-orders-container');
            const pendingOrdersContainer = document.getElementById('pending-orders-container');
            const ordersTitle = document.getElementById('orders-title');

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
                orderHeader.addEventListener('click', () => {
                    window.location.href = `order_detail.html?orderId=${order.id}`;
                });
                orderDiv.appendChild(orderHeader);

                const orderItemsContainer = document.createElement('div');
                orderItemsContainer.classList.add('order-items-container');

                order.items.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('order-item');

                    itemDiv.innerHTML = `
                        <img class="product_img" src="${item.image_url}" alt="${item.name}">
                        <p class="product_name">${item.name} ${item.variant_combination ? `(${item.variant_combination})` : ''}</p>
                        <div class="amount_area">
                            <p class="product_price">單價${item.price}元</p>
                            <p class="product_quantity">${item.quantity}件</p>
                            <p class="product_total_price">總和${item.price * item.quantity}元</p>
                        </div>
                    `;

                    orderItemsContainer.appendChild(itemDiv);
                });

                const statusSelect = document.createElement('select');
                const statusMap = {
                    'Pending': '待處理',
                    'Delivered': '已送達'
                };
                Object.keys(statusMap).forEach(status => {
                    const option = document.createElement('option');
                    option.value = status;
                    option.textContent = statusMap[status];
                    if (status === order.shipping_status) {
                        option.selected = true;
                    }
                    statusSelect.appendChild(option);
                });

                const updateButton = document.createElement('button');
                updateButton.textContent = '更新狀態(測試用)';
                updateButton.addEventListener('click', () => {
                    const newStatus = statusSelect.value;
                    fetch(`${window.AppConfig.API_URL}/orders/update-status`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ orderId: order.id, status: newStatus })
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(result => {
                        if (result.success) {
                            alert('狀態更新成功');
                            location.reload(); // 刷新頁面以更新訂單狀態
                        } else {
                            alert('狀態更新失敗');
                        }
                    })
                    .catch(error => console.error('Error updating order status:', error));
                });

                orderDiv.appendChild(orderItemsContainer);
                orderDiv.appendChild(statusSelect);
                orderDiv.appendChild(updateButton);

                if (order.shipping_status === 'Delivered') {
                    completedOrdersContainer.appendChild(orderDiv);
                } else {
                    pendingOrdersContainer.appendChild(orderDiv);
                }
            });

            // 顯示未完成訂單，隱藏完成訂單
            document.getElementById('show-pending-orders').addEventListener('click', () => {
                pendingOrdersContainer.style.display = 'block';
                completedOrdersContainer.style.display = 'none';
                ordersTitle.textContent = '未完成訂單';
            });

            // 顯示完成訂單，隱藏未完成訂單
            document.getElementById('show-completed-orders').addEventListener('click', () => {
                pendingOrdersContainer.style.display = 'none';
                completedOrdersContainer.style.display = 'block';
                ordersTitle.textContent = '完成的訂單';
            });

            // 預設顯示未完成訂單
            document.getElementById('show-pending-orders').click();
        })
        .catch(error => console.error('Error fetching orders:', error));
});