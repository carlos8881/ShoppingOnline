document.addEventListener('DOMContentLoaded', function () {
    const account = localStorage.getItem('account');
    if (!account) {
        alert('請先登入');
        window.location.href = 'login.html';
        return;
    }

    fetch(`${window.AppConfig.API_URL}/attentionlist/get-attention-list?account=${account}`)
        .then(response => response.json())
        .then(products => {
            const attentionListContainer = document.getElementById('attention-list');
            attentionListContainer.innerHTML = ''; // 清空現有追蹤清單

            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');

                const productLink = document.createElement('a');
                productLink.href = `product.html?id=${product.product_id}`;

                const productImage = document.createElement('img');
                productImage.src = product.image_url;
                productImage.alt = product.name;

                const productName = document.createElement('div');
                productName.classList.add('name');
                productName.textContent = product.name;

                const productPrice = document.createElement('div');
                productPrice.classList.add('price');
                productPrice.textContent = `NT$ ${product.base_price}`;

                const removeButton = document.createElement('button');
                removeButton.textContent = '移除';
                removeButton.addEventListener('click', () => {
                    fetch(`${window.AppConfig.API_URL}/attentionlist/remove`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ account, product_id: product.product_id })
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(result => {
                        if (result.success) {
                            productCard.remove();
                        } else {
                            alert('移除失敗');
                        }
                    })
                    .catch(error => console.error('Error removing product:', error));
                });

                productLink.appendChild(productImage);
                productLink.appendChild(productName);

                productCard.appendChild(productLink);
                productCard.appendChild(productPrice);
                productCard.appendChild(removeButton);

                attentionListContainer.appendChild(productCard);
            });
        })
        .catch(error => console.error('Error fetching attention list:', error));
});