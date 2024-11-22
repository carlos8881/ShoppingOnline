document.addEventListener('DOMContentLoaded', () => {
    const addToAttentionlistButton = document.createElement('button');
    addToAttentionlistButton.textContent = '加入追蹤清單';
    addToAttentionlistButton.id = 'add-to-attentionlist';
    document.querySelector('.maininfo').appendChild(addToAttentionlistButton);

    addToAttentionlistButton.addEventListener('click', () => {
        const account = localStorage.getItem('account');
        const productId = new URLSearchParams(window.location.search).get('id');

        if (!account) {
            alert('請先登入');
            return;
        }

        fetch(`${window.AppConfig.API_URL}/attentionlist/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ account, product_id: productId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('已加入追蹤清單');
            } else {
                alert('加入追蹤清單失敗');
            }
        })
        .catch(error => {
            console.error('Error adding to attentionlist:', error);
            alert('加入追蹤清單失敗');
        });
    });
});