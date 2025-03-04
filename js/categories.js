document.addEventListener("DOMContentLoaded", function() { 
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category_id');

    function loadProductsByCategory(categoryId) {
        fetch(`${window.AppConfig.API_URL}/products/get-products-by-category?category_id=${categoryId}`)
            .then(response => response.json())
            .then(products => {
                const productCardContainer = document.querySelector('.product-card-container');
                const header = document.querySelector('.all-products-container-categories-page .header');
                productCardContainer.innerHTML = ''; // 清空現有商品卡

                if (products.length === 0) {
                    const noProductsMessage = document.createElement('div');
                    noProductsMessage.classList.add('no-products-message');
                    noProductsMessage.textContent = '這個分類目前沒有商品';
                    productCardContainer.appendChild(noProductsMessage);
                } else {
                    // 更新 title 和 header
                    const categoryName = products[0].category_name;
                    document.title = `Shopping Online ${categoryName}`;
                    header.textContent = categoryName;

                    products.forEach(product => {
                        const productCard = document.createElement('div');
                        productCard.classList.add('product-card');

                        const productLink = document.createElement('a');
                        productLink.href = `product.html?id=${product.id}`;

                        const productImage = document.createElement('img');
                        productImage.src = product.image_url;
                        productImage.alt = product.name;

                        const productName = document.createElement('div');
                        productName.classList.add('name');
                        productName.textContent = product.name;

                        const productPrice = document.createElement('div');
                        productPrice.classList.add('price');
                        productPrice.textContent = `NT$ ${product.base_price}`;

                        productLink.appendChild(productImage);
                        productLink.appendChild(productName);

                        productCard.appendChild(productLink);
                        productCard.appendChild(productPrice);

                        productCardContainer.appendChild(productCard);
                    });
                }
            });
    }

    if (categoryId) {
        loadProductsByCategory(categoryId);
    }
});