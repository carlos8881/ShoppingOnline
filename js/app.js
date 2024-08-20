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
  fetch('http://localhost:3000/get_categories')
      .then(response => response.json())
      .then(data => {
          const categoryContainer = document.querySelector('.category');
          categoryContainer.innerHTML = ''; // 清空现有分类

          data.forEach(category => {
              const categoryDiv = document.createElement('div');
              const categoryLink = document.createElement('a');
              categoryLink.href = '#';
              categoryLink.textContent = category.name;
              categoryDiv.appendChild(categoryLink);

              if (category.subcategories.length > 0) {
                  const subcategoryList = document.createElement('div');
                  subcategoryList.classList.add('subcategory-list');
                  subcategoryList.style.display = 'none'; // 初始隐藏子分类

                  category.subcategories.forEach(subcategory => {
                      const subcategoryLink = document.createElement('a');
                      subcategoryLink.href = '#';
                      subcategoryLink.textContent = subcategory.name;
                      subcategoryList.appendChild(subcategoryLink);
                  });

                  categoryDiv.appendChild(subcategoryList);

                  // 添加鼠标悬停事件
                  categoryDiv.addEventListener('mouseenter', () => {
                      subcategoryList.style.display = 'block';
                  });

                  categoryDiv.addEventListener('mouseleave', () => {
                      subcategoryList.style.display = 'none';
                  });
              }

              categoryContainer.appendChild(categoryDiv);
          });
      });
});