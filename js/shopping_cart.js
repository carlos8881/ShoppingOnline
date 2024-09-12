document.addEventListener('DOMContentLoaded', function () {
    const account = localStorage.getItem('account');
    if (!account) {
        alert('請先登入');
        window.location.href = 'login.html';
        return;
    }

    function updateCart() {
        fetch(`https://d1khcxe0f8g5xw.cloudfront.net/get-cart?account=${account}`)
            .then(response => response.json())
            .then(cartItems => {
                const cartContainer = document.querySelector('.cart-container');
                const totalQuantityElement = document.getElementById('total-quantity');
                const totalPriceElement = document.getElementById('total-price');
                const checkoutPriceElement = document.getElementById('checkout-price');
                const selectAllCheckbox = document.getElementById('select-all');
    
                cartContainer.innerHTML = ''; // 清空现有购物车内容
                let totalQuantity = 0;
                let totalPrice = 0;
    
                cartItems.forEach(item => {
                    const itemTotal = item.price * item.quantity;
    
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('cart-item');
    
                    itemDiv.innerHTML = `
                        <input type="checkbox" class="select-item" data-product-id="${item.product_id}">
                        <img src="${item.image_url}" alt="${item.name}">
                        <p>${item.name}</p>
                        <p>${item.price}</p>
                        <p>${item.quantity}</p>
                        <p>${itemTotal}</p>
                        <button class="decrease-quantity" data-product-id="${item.product_id}">-</button>
                        <button class="increase-quantity" data-product-id="${item.product_id}">+</button>
                        <button class="remove-item" data-product-id="${item.product_id}">刪除</button>
                    `;
    
                    cartContainer.appendChild(itemDiv);
                });
    
                // 初始化結帳明細
                totalQuantityElement.textContent = 0;
                totalPriceElement.textContent = 0;
                checkoutPriceElement.textContent = 0;
    
                // 添加事件監聽器
                document.querySelectorAll('.decrease-quantity').forEach(button => {
                    button.addEventListener('click', function () {
                        const productId = this.getAttribute('data-product-id');
                        updateCartItemQuantity(productId, -1);
                    });
                });
    
                document.querySelectorAll('.increase-quantity').forEach(button => {
                    button.addEventListener('click', function () {
                        const productId = this.getAttribute('data-product-id');
                        updateCartItemQuantity(productId, 1);
                    });
                });
    
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', function () {
                        const productId = this.getAttribute('data-product-id');
                        removeCartItem(productId);
                    });
                });
    
                document.querySelectorAll('.select-item').forEach(checkbox => {
                    checkbox.addEventListener('change', function () {
                        updateCheckoutDetails();
                        // 更新全選框的狀態
                        selectAllCheckbox.checked = document.querySelectorAll('.select-item:checked').length === document.querySelectorAll('.select-item').length;
                    });
                });
    
                selectAllCheckbox.addEventListener('change', function () {
                    const isChecked = this.checked;
                    document.querySelectorAll('.select-item').forEach(checkbox => {
                        checkbox.checked = isChecked;
                    });
                    updateCheckoutDetails();
                });
            })
            .catch(error => console.error('Error fetching cart items:', error));
    }

    function updateCartItemQuantity(productId, change) {
        fetch('https://d1khcxe0f8g5xw.cloudfront.net/update-cart-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                account: account,
                product_id: productId,
                change: change
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 如果商品數量小於等於0，則刪除該商品
                if (data.newQuantity <= 0) {
                    // 從 DOM 中移除該商品
                    const itemDiv = document.querySelector(`.cart-item input[data-product-id="${productId}"]`).closest('.cart-item');
                    itemDiv.remove();
                    // 更新結帳詳情和全選狀態
                    updateCheckoutDetails();
                    const selectAllCheckbox = document.getElementById('select-all');
                    selectAllCheckbox.checked = document.querySelectorAll('.select-item:checked').length === document.querySelectorAll('.select-item').length;
                } else {
                    updateCart();
                }
            } else {
                alert('更新購物車失敗');
            }
        })
        .catch(error => console.error('Error updating cart item:', error));
    }

    function removeCartItem(productId, updateCartAfterRemoval = true) {
        fetch('https://d1khcxe0f8g5xw.cloudfront.net/remove-cart-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                account: account,
                product_id: productId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 從 DOM 中移除該商品
                const itemDiv = document.querySelector(`.cart-item input[data-product-id="${productId}"]`).closest('.cart-item');
                itemDiv.remove();
                if (updateCartAfterRemoval) {
                    updateCart();
                } else {
                    // 刪除後僅更新結帳詳情和全選狀態
                    updateCheckoutDetails();
                    const selectAllCheckbox = document.getElementById('select-all');
                    selectAllCheckbox.checked = document.querySelectorAll('.select-item:checked').length === document.querySelectorAll('.select-item').length;
                }
            } else {
                alert('刪除購物車商品失敗');
            }
        })
        .catch(error => console.error('Error removing cart item:', error));
    }

    function updateCheckoutDetails() {
        const totalQuantityElement = document.getElementById('total-quantity');
        const totalPriceElement = document.getElementById('total-price');
        const checkoutPriceElement = document.getElementById('checkout-price');
    
        let totalQuantity = 0;
        let totalPrice = 0;
    
        document.querySelectorAll('.select-item:checked').forEach(checkbox => {
            const itemDiv = checkbox.closest('.cart-item');
            const quantity = parseInt(itemDiv.querySelector('p:nth-child(5)').textContent);
            const price = parseInt(itemDiv.querySelector('p:nth-child(4)').textContent);
    
            totalQuantity += quantity;
            totalPrice += price * quantity;
        });
    
        totalQuantityElement.textContent = totalQuantity;
        totalPriceElement.textContent = totalPrice;
        checkoutPriceElement.textContent = totalPrice;
    }

    document.getElementById('checkout-button').addEventListener('click', function () {
        const selectedItems = Array.from(document.querySelectorAll('.select-item:checked')).map(checkbox => {
            return {
                product_id: checkbox.getAttribute('data-product-id'),
                quantity: parseInt(checkbox.closest('.cart-item').querySelector('p:nth-child(5)').textContent),
                price: parseInt(checkbox.closest('.cart-item').querySelector('p:nth-child(4)').textContent)
            };
        });

        localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
        window.location.href = 'order_checkout.html';
    });

    updateCart();
});