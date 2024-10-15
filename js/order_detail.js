document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    if (!orderId) {
        alert('無效的訂單 ID');
        window.location.href = 'orders.html';
        return;
    }

    fetch(`${window.AppConfig.API_URL}/orders/get-order-detail?orderId=${orderId}`)
        .then(response => response.json())
        .then(order => {
            const orderDetailContainer = document.getElementById('order-detail-container');

            const orderHeader = document.createElement('div');
            orderHeader.classList.add('order-header');
            orderHeader.innerHTML = `
                <h3>訂單編號: ${order.order_number}</h3>
                <p>成立日期: ${new Date(order.created_at).toLocaleString()}</p>
                <p>總價: ${order.checkout_price}</p>
                <p>運送方式: ${order.delivery_method === 'store-pickup' ? '超商取貨' : '宅配'}</p>
            `;
            orderDetailContainer.appendChild(orderHeader);

            const orderItemsContainer = document.createElement('div');
            orderItemsContainer.classList.add('order-items-container');

            order.items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('order-item');

                itemDiv.innerHTML = `
                    <img src="${item.image_url}" alt="${item.name}">
                    <p>${item.name} ${item.variant_combination ? `(${item.variant_combination})` : ''}</p>
                    <p>${item.price}</p>
                    <p>${item.quantity}</p>
                    <p>${item.price * item.quantity}</p>
                `;

                orderItemsContainer.appendChild(itemDiv);
            });

            orderDetailContainer.appendChild(orderItemsContainer);

            // 顯示評論區塊
            if (order.reviews && order.reviews.length > 0) {
                const reviewsContainer = document.createElement('div');
                reviewsContainer.classList.add('reviews-container');
                reviewsContainer.innerHTML = '<h4>評論</h4>';

                order.reviews.forEach(review => {
                    const reviewDiv = document.createElement('div');
                    reviewDiv.classList.add('review');
                    reviewDiv.innerHTML = `
                        <p>評分: ${review.rating}</p>
                        <p>內容: ${review.content}</p>
                        <p>日期: ${new Date(review.date).toLocaleString()}</p>
                    `;
                    reviewsContainer.appendChild(reviewDiv);
                });

                orderDetailContainer.appendChild(reviewsContainer);
            }

            // 顯示評論填寫區塊
            if (order.shipping_status === 'Delivered' && !order.reviewed) {
                const reviewForm = document.createElement('form');
                reviewForm.classList.add('review-form');
                reviewForm.innerHTML = `
                    <h4>填寫評論</h4>
                    <textarea name="content" placeholder="請輸入評論內容"></textarea>
                    <input type="number" name="rating" min="1" max="5" placeholder="評分 (1-5)">
                    <button type="submit">送出評論</button>
                `;
                reviewForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const content = reviewForm.querySelector('textarea[name="content"]').value;
                    const rating = reviewForm.querySelector('input[name="rating"]').value;
                    fetch(`${window.AppConfig.API_URL}/reviews/add`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            orderId: order.id,
                            userId: order.user_id, // 确保 userId 被正确传递
                            productId: order.items[0].product_id, // 假设评论的是第一个商品
                            content, // 确保 content 被正确传递
                            rating
                        })
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(result => {
                        if (result.success) {
                            alert('評論提交成功');
                            location.reload(); // 刷新頁面以更新評論狀態
                        } else {
                            alert('評論提交失敗');
                        }
                    })
                    .catch(error => console.error('Error submitting review:', error));
                });
                orderDetailContainer.appendChild(reviewForm);
            }
        })
        .catch(error => console.error('Error fetching order detail:', error));
});