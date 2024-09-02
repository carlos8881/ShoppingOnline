document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    let currentImageIndex = 0;
    let images = [];

    if (productId) {
        fetch(`http://localhost:3000/get-product-info?id=${productId}`)
            .then(response => response.json())
            .then(data => {
                document.querySelector('.product h1').textContent = data.name;
                document.querySelector('.product p.price').textContent = `$ ${data.base_price}`;
                document.querySelector('.product-description p').innerHTML = data.description.replace(/\n/g, '<br>');

                // Fetch all images (cover and content images)
                fetch(`http://localhost:3000/get-product-images?id=${productId}`)
                    .then(response => response.json())
                    .then(imageData => {
                        images = imageData;
                        updateImage();
                    })
                    .catch(error => console.error('Error fetching product images:', error));

                // Fetch breadcrumb categories
                fetch(`http://localhost:3000/get-product-categories?id=${productId}`)
                    .then(response => response.json())
                    .then(categories => {
                        const breadcrumbContainer = document.querySelector('.breadcrumb');
                        breadcrumbContainer.innerHTML = ''; // 清空现有分类导览

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

        // 檢查購物車中是否已經存在相同的商品
        fetch(`http://localhost:3000/get-cart?account=${account}`)
            .then(response => response.json())
            .then(cartItems => {
                const existingItem = cartItems.find(item => item.product_id == productId);
                if (existingItem) {
                    alert('商品已在購物車中');
                } else {
                    // 如果購物車中沒有相同的商品，則添加到購物車
                    fetch('http://localhost:3000/add-to-cart', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            account: account,
                            product_id: productId,
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