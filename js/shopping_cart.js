document.addEventListener('DOMContentLoaded', function () {
    const account = localStorage.getItem('account');
    if (!account) {
        alert('請先登入');
        window.location.href = 'login.html';
        return;
    }

    function updateCart() {
        fetch(`${window.AppConfig.API_URL}/cart/get-cart?account=${account}`)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => { throw new Error(error.error); });
                }
                return response.json();
            })
            .then(cartItems => {
                const cartContainer = document.querySelector('.cart-container');
                const totalQuantityElement = document.getElementById('total-quantity');
                const totalPriceElement = document.getElementById('total-price');
                const checkoutPriceElement = document.getElementById('checkout-price');
                const selectAllCheckbox = document.getElementById('select-all');

                cartContainer.innerHTML = ''; // 清空現有購物車内容
                let totalQuantity = 0;
                let totalPrice = 0;

                cartItems.forEach(item => {
                    const itemTotal = item.price * item.quantity;

                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('cart-item');

                    itemDiv.innerHTML = `
                        <input type="checkbox" class="select-item" data-product-id="${item.product_id}" data-variant-id="${item.variant_id}">
                        <img src="${item.image_url}" alt="${item.name}">
                        <p class="product_name">${item.name} ${item.variant_combination ? `(${item.variant_combination})` : ''}</p>
                        <div class="amount_area">
                            <p>單價${item.price}元</p>
                            <p>${item.quantity}件</p>
                            <p>總價${itemTotal}元</p>
                        </div>
                        <div class="quantity-button-area">
                            <button class="decrease-quantity" data-product-id="${item.product_id}" data-variant-id="${item.variant_id}">-</button>
                            <button class="increase-quantity" data-product-id="${item.product_id}" data-variant-id="${item.variant_id}">+</button>
                            <button class="remove-item" data-product-id="${item.product_id}" data-variant-id="${item.variant_id}">刪除</button>
                        </div>
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
                        const variantId = this.getAttribute('data-variant-id');
                        updateCartItemQuantity(productId, variantId, -1);
                    });
                });

                document.querySelectorAll('.increase-quantity').forEach(button => {
                    button.addEventListener('click', function () {
                        const productId = this.getAttribute('data-product-id');
                        const variantId = this.getAttribute('data-variant-id');
                        updateCartItemQuantity(productId, variantId, 1);
                    });
                });

                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', function () {
                        const productId = this.getAttribute('data-product-id');
                        const variantId = this.getAttribute('data-variant-id');
                        removeCartItem(productId, variantId);
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

    function updateCartItemQuantity(productId, variantId, change) {
        fetch(`${window.AppConfig.API_URL}/cart/update-cart-item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                account: account,
                product_id: productId,
                variant_id: variantId,
                change: change
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 如果商品數量小於等於0，則刪除詀商品
                if (data.newQuantity <= 0) {
                    // 從 DOM 中移除詀商品
                    const itemDiv = document.querySelector(`.cart-item input[data-product-id="${productId}"][data-variant-id="${variantId}"]`).closest('.cart-item');
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

    function removeCartItem(productId, variantId, updateCartAfterRemoval = true) {
        fetch(`${window.AppConfig.API_URL}/cart/remove-cart-item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                account: account,
                product_id: productId,
                variant_id: variantId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const itemDiv = document.querySelector(`.cart-item input[data-product-id="${productId}"][data-variant-id="${variantId}"]`).closest('.cart-item');
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
            const quantity = parseInt(itemDiv.querySelector('.amount_area p:nth-child(2)').textContent.replace('件', '')); // 更新选择器
            const price = parseFloat(itemDiv.querySelector('.amount_area p:nth-child(1)').textContent.replace('單價', '').replace('元', '')); // 更新选择器并移除非数字字符

            totalQuantity += quantity;
            totalPrice += price * quantity;
        });

        totalQuantityElement.textContent = totalQuantity;
        totalPriceElement.textContent = totalPrice.toFixed(2); // 確保顯示兩位小數
        checkoutPriceElement.textContent = totalPrice.toFixed(2); // 確保顯示兩位小數
    }

    document.getElementById('checkout-button').addEventListener('click', function () {
        const selectedItems = Array.from(document.querySelectorAll('.select-item:checked')).map(checkbox => {
            return {
                product_id: checkbox.getAttribute('data-product-id'),
                variant_id: checkbox.getAttribute('data-variant-id'),
                quantity: parseInt(checkbox.closest('.cart-item').querySelector('.amount_area p:nth-child(2)').textContent.replace('件', '')),
                price: parseFloat(checkbox.closest('.cart-item').querySelector('.amount_area p:nth-child(1)').textContent.replace('單價', '').replace('元', '')) // 確保價格是浮點數
            };
        });

        localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
        window.location.href = 'order_checkout.html';
    });

    updateCart();
});