function showDownloadAlert() {
  alert('APP下載未開放');
};

new Vue({
  el: '#headApp',
  data: {
    showAlert: false
  },
  methods: {
    showDownloadAlert() {
      alert('APP下載未開放');
    }
  },
  mounted() {
    document.getElementById('app-download-link').addEventListener('click', this.showDownloadAlert);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const account = localStorage.getItem('account');
  const loginButton = document.querySelector('.right li a[href="login.html"]');
  const registerButton = document.querySelector('.right li a[href="login.html?form=register"]');

  if (account) {
      const accountSpan = document.createElement('span');
      accountSpan.textContent = account;
      loginButton.parentNode.replaceChild(accountSpan, loginButton);
      registerButton.textContent = '登出';
      registerButton.href = '#';
      registerButton.onclick = () => {
          localStorage.removeItem('account');
          window.location.reload();
      };
  }
});

document.addEventListener("DOMContentLoaded", function() {
  fetch(`${window.AppConfig.API_URL}/categories/get_categories`)
    .then(response => response.json())
    .then(data => {
        const categoryContainer = document.querySelector('.category');
        categoryContainer.innerHTML = ''; // 清空現有分類

        data.forEach(category => {
            const categoryContainerDiv = document.createElement('div');
            categoryContainerDiv.classList.add('category-container');

            const categoryDiv = document.createElement('div');
            const categoryLink = document.createElement('a');
            categoryLink.href = `categories.html?category_id=${category.id}`;
            categoryLink.textContent = category.name;
            categoryDiv.appendChild(categoryLink);

            if (category.subcategories.length > 0) {
                const subcategoryList = document.createElement('div');
                subcategoryList.classList.add('subcategory-list');
                subcategoryList.style.display = 'none'; // 初始隱藏子分類

                category.subcategories.forEach(subcategory => {
                    const subcategoryLink = document.createElement('a');
                    subcategoryLink.href = `categories.html?category_id=${subcategory.id}`;
                    subcategoryLink.textContent = subcategory.name;
                    subcategoryList.appendChild(subcategoryLink);
                });

                categoryContainerDiv.appendChild(subcategoryList);

                // 添加游標懸停事件
                categoryContainerDiv.addEventListener('mouseenter', () => {
                    subcategoryList.style.display = 'block';
                });

                categoryContainerDiv.addEventListener('mouseleave', () => {
                    subcategoryList.style.display = 'none';
                });
            }

            categoryContainerDiv.appendChild(categoryDiv);
            categoryContainer.appendChild(categoryContainerDiv);
        });
    });

  // Fetch products and populate product cards
  fetch(`${window.AppConfig.API_URL}/products/get-products`)
    .then(response => response.json())
    .then(products => {
        const productCardContainer = document.querySelector('.product-card-container');
        productCardContainer.innerHTML = ''; // 清空現有商品卡

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
    });

  // 自動輪播廣告圖片
  const scrollContent = document.querySelector('.scrollcontent');
  const images = scrollContent.querySelectorAll('img');
  let currentIndex = 0;

  function showNextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      const offset = -currentIndex * scrollContent.clientWidth;
      scrollContent.style.transform = `translateX(${offset}px)`;
  }

  setInterval(showNextImage, 5000); // 每5秒切換一次圖片
});