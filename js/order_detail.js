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
            orderDetailContainer.innerHTML = ''; // 清空容器

            displayOrderDetails(order, orderDetailContainer);
            displayOrderItems(order.items, orderDetailContainer, orderId, order.user_id, order.shipping_status); // 傳遞 order.shipping_status
        })
        .catch(error => console.error('Error fetching order detail:', error));
});

function displayOrderDetails(order, container) {
    const orderHeader = document.createElement('div');
    orderHeader.classList.add('order-header');
    orderHeader.innerHTML = `
        <h3>訂單編號: ${order.order_number}</h3>
        <p>成立日期: ${new Date(order.created_at).toLocaleString()}</p>
        <p>總價: ${order.checkout_price}</p>
        <p>運送方式: ${order.delivery_method === 'store-pickup' ? '超商取貨' : '宅配'}</p>
    `;
    container.appendChild(orderHeader);
}

function displayOrderItems(items, container, orderId, userId, orderStatus) { // 添加 orderStatus 參數
    const orderItemsContainer = document.createElement('div');
    orderItemsContainer.classList.add('order-items-container');

    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('order-item');

        itemDiv.innerHTML = `
            <img src="${item.image_url}" alt="${item.name}">
            <p>${item.name} ${item.variant_combination ? `(${item.variant_combination})` : ''}</p>
            <p>${item.price}</p>
            <p>${item.quantity}</p>
            <p>${item.price * item.quantity}</p>
            <div id="review-container-${item.product_id}"></div>
        `;

        orderItemsContainer.appendChild(itemDiv);

        fetch(`${window.AppConfig.API_URL}/reviews/product-reviews/${orderId}/${item.product_id}`)
        .then(response => {
            if (response.status === 404) {
                return null; // 沒有找到評論
            }
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // 使用 text() 方法而不是 json()
        })
        .then(text => {
            if (!text) {
                return null; // 空響應
            }
            return JSON.parse(text); // 手動解析 JSON
        })
        .then(review => {
            if (review && review.review_text && review.rating) {
                displayProductReview(review, item.product_id);
            } else if (orderStatus === 'Delivered') { // 檢查訂單狀態
                displayReviewInput(item.product_id, orderId, userId);
            }
        })
        .catch(error => console.error('Error fetching product review:', error));
    });

    container.appendChild(orderItemsContainer);
}

function displayReviewInput(productId, orderId, userId) { // 添加 userId 參數
    const reviewContainer = document.getElementById(`review-container-${productId}`);
    reviewContainer.innerHTML = `
        <textarea id="review-text-${productId}" placeholder="輸入評論"></textarea>
        <input type="number" id="review-rating-${productId}" min="1" max="5" placeholder="評分 (1-5)">
        <button onclick="submitReview(${orderId}, ${productId}, ${userId})">提交評論</button>
    `;
}

function displayProductReview(review, productId) {
    const reviewContainer = document.getElementById(`review-container-${productId}`);
    if (review && review.review_text && review.rating) {
        reviewContainer.innerHTML = `
            <p>評論: ${review.review_text}</p>
            <p>評分: ${review.rating}</p>
        `;
    } else {
        reviewContainer.innerHTML = `
        `;
    }
}

function submitReview(orderId, productId, userId) {
    const reviewText = document.getElementById(`review-text-${productId}`).value;
    const reviewRating = document.getElementById(`review-rating-${productId}`).value;

    const reviewData = {
        orderId,
        productId,
        userId,
        reviewText,
        rating: reviewRating
    };

    // 在主控台顯示將要送出的資料
    console.log('Submitting review data:', reviewData);

    fetch(`${window.AppConfig.API_URL}/reviews/add-product-review`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
    })
    .then(response => response.json())
    .then(data => {
        alert('評論提交成功');
        // 更新頁面上的評論內容
        displayProductReview(reviewData, productId);
    })
    .catch(error => console.error('Error submitting review:', error));
}