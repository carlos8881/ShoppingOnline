document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    let currentImageIndex = 0;
    let images = [];
    let selectedVariantId = null;
    let productData = null;

    if (productId) {
        // 獲取用戶 account
        const account = localStorage.getItem('account');
        if (account) {
            // 發送瀏覽紀錄到後端
            fetch(`${window.AppConfig.API_URL}/browsing-history/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ account, productId })
            })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    console.error('Error adding browsing history:', data.error);
                }
            })
            .catch(error => console.error('Error adding browsing history:', error));
        }

        fetch(`${window.AppConfig.API_URL}/products/get-product-info?id=${productId}`)
            .then(response => response.json())
            .then(data => {
                productData = data;
                document.querySelector('.product h1').textContent = data.name;
                if (data.has_variants) {
                    document.querySelector('.product p.price').textContent = '請選擇規格';
                    fetch(`${window.AppConfig.API_URL}/products/get-product-variants?id=${productId}`)
                        .then(response => response.json())
                        .then(variants => {
                            const variantsContainer = document.getElementById('variants-container');
                            const variantsSelect = document.getElementById('variants');
                            variantsContainer.style.display = 'block';
                            variants.forEach(variant => {
                                const option = document.createElement('option');
                                option.value = variant.id;
                                option.textContent = `${variant.variant_combination} - $${variant.price}`;
                                variantsSelect.appendChild(option);
                            });
                            variantsSelect.addEventListener('change', function () {
                                const selectedVariant = variants.find(v => v.id == this.value);
                                selectedVariantId = selectedVariant.id;
                                document.querySelector('.product p.price').textContent = `$${selectedVariant.price}`;
                            });
                        })
                        .catch(error => console.error('Error fetching product variants:', error));
                } else {
                    document.querySelector('.product p.price').textContent = `$${data.base_price}`;
                }
                document.querySelector('.product-description p').innerHTML = data.description.replace(/\n/g, '<br>');

                // Fetch all images (cover and content images)
                fetch(`${window.AppConfig.API_URL}/products/get-product-images?id=${productId}`)
                    .then(response => response.json())
                    .then(imageData => {
                        images = imageData;
                        updateImage();
                    })
                    .catch(error => console.error('Error fetching product images:', error));

                // Fetch breadcrumb categories
                fetch(`${window.AppConfig.API_URL}/products/get-product-categories?id=${productId}`)
                    .then(response => response.json())
                    .then(categories => {
                        const breadcrumbContainer = document.querySelector('.breadcrumb');
                        breadcrumbContainer.innerHTML = ''; // 清空現有分類導覽

                        categories.forEach((category, index) => {
                            const categoryLink = document.createElement('a');
                            categoryLink.href = `categories.html?category_id=${category.id}`;
                            categoryLink.textContent = category.name;

                            breadcrumbContainer.appendChild(categoryLink);

                            if (index < categories.length - 1) {
                                const separator = document.createElement('span');
                                separator.textContent = ' > ';
                                breadcrumbContainer.appendChild(separator);
                            }
                        });
                    })
                    .catch(error => console.error('Error fetching breadcrumb categories:', error));

                // Fetch product reviews
                fetch(`${window.AppConfig.API_URL}/products/get-product-reviews?id=${productId}`)
                    .then(response => response.json())
                    .then(reviews => {
                        const reviewsContainer = document.getElementById('reviews-container');
                        const reviewButtons = document.querySelectorAll('.review-buttons button');

                        function displayReviews(rating) {
                            reviewsContainer.innerHTML = '';
                            const filteredReviews = rating === 'all' ? reviews : reviews.filter(review => review.rating == rating);
                            filteredReviews.forEach(review => {
                                const reviewDiv = document.createElement('div');
                                reviewDiv.classList.add('review');

                                const maskedBuyerName = review.buyer_name[0] + '****' + review.buyer_name.slice(-1);

                                reviewDiv.innerHTML = `
                                    <p>評分: ${review.rating} / 5</p>
                                    <p>買家: ${maskedBuyerName}</p>
                                    <p>日期: ${new Date(review.created_at).toLocaleDateString()}</p>
                                    <p>${review.review_text}</p>
                                `;

                                reviewsContainer.appendChild(reviewDiv);
                            });
                        }

                        reviewButtons.forEach(button => {
                            button.addEventListener('click', function () {
                                const rating = this.getAttribute('data-rating');
                                displayReviews(rating);
                            });
                        });

                        // 添加 "全部" 的按鈕
                        const showAllButton = document.createElement('button');
                        showAllButton.textContent = '全部';
                        showAllButton.setAttribute('data-rating', 'all');
                        showAllButton.addEventListener('click', function () {
                            displayReviews('all');
                        });
                        document.querySelector('.review-buttons').appendChild(showAllButton);

                        // 預設顯示全部評價
                        displayReviews('all');
                    })
                    .catch(error => console.error('Error fetching product reviews:', error));
            })
            .catch(error => console.error('Error fetching product data:', error));
    }

    function updateImage() {
        if (images.length > 0) {
            document.querySelector('.product-img img').src = images[currentImageIndex].image_url;
        }
    }

    document.getElementById('next-btn').addEventListener('click', function () {
        if (images.length > 0) {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateImage();
        }
    });

    document.getElementById('prev-btn').addEventListener('click', function () {
        if (images.length > 0) {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateImage();
        }
    });

    document.getElementById('add-to-cart').addEventListener('click', function () {
        const quantity = parseInt(document.getElementById('quantity').value);
        if (isNaN(quantity) || quantity <= 0) {
            alert('請輸入有效的數量');
            return;
        }

        const account = localStorage.getItem('account');
        if (!account) {
            alert('請先登入');
            return;
        }

        if (selectedVariantId === null && productData.has_variants) {
            alert('請選擇規格');
            return;
        }

        // 檢查購物車中是否已經存在相同的商品
        fetch(`${window.AppConfig.API_URL}/cart/get-cart?account=${account}`)
            .then(response => response.json())
            .then(cartItems => {
                const existingItem = cartItems.find(item => item.product_id == productId && item.variant_id == selectedVariantId);
                if (existingItem) {
                    alert('商品已在購物車中');
                } else {
                    // 如果購物車中沒有相同的商品，則添加到購物車
                    fetch(`${window.AppConfig.API_URL}/cart/add-to-cart`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            account: account,
                            product_id: productId,
                            variant_id: selectedVariantId,
                            quantity: quantity
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert('商品已加入購物車');
                        } else {
                            alert('加入購物車失敗');
                        }
                    })
                    .catch(error => console.error('Error adding to cart:', error));
                }
            })
            .catch(error => console.error('Error fetching cart items:', error));
    });
});