document.addEventListener('DOMContentLoaded', function () {
    const account = localStorage.getItem('account');
    if (account) {
        fetch(`${window.AppConfig.API_URL}/browsing-history/get?account=${account}`)
            .then(response => response.json())
            .then(history => {
                const historyContainer = document.createElement('div');
                historyContainer.classList.add('history-container');

                history.forEach(item => {
                    const productDiv = document.createElement('div');
                    productDiv.classList.add('product');

                    productDiv.innerHTML = `
                        <a href="product.html?id=${item.product_id}">
                            <img src="${item.image_url}" alt="${item.name}">
                            <div>
                                <p>${item.name}</p>
                                <p>$${item.base_price}</p>
                                <p>瀏覽時間: ${new Date(item.viewed_at).toLocaleString()}</p>
                            </div>
                        </a>
                    `;

                    historyContainer.appendChild(productDiv);
                });

                document.body.appendChild(historyContainer);
            })
            .catch(error => console.error('Error fetching browsing history:', error));
    } else {
        alert('請先登入');
    }
});