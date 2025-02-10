<template>
    <div class="product_management" v-if="isLoggedIn">
        <div class="product_management_header">
            <h2>商品管理</h2>
        </div>
        <div class="product_management_content">
            <div class="product_management_select">
                <div class="category_select">
                    <h3>分類選擇</h3>
                </div>
                <div class="creation_date">
                    <h3>建立日期</h3>
                </div>
            </div>
            <div class="product_management_list">
                <div class="product_management_list_header">
                    <h3>所有商品</h3>
                    <button @click="goToAddProduct">新增商品</button> <!-- 導航到新增商品頁面的按鈕 -->
                </div>
                <div class="product_management_list_content"> <!-- 商品列表 -->
                    <div class="product_management_list_item" v-for="product in products" :key="product.id"> <!-- 各個商品 -->
                        <div class="product_management_list_item_img">
                            <img :src="product.imageUrl" :alt="product.name">
                        </div>
                        <div class="product_management_list_item_info"> <!-- 商品資訊 -->
                            <h4>{{ product.name }}</h4>
                            <p>{{ product.category }}</p>
                            <p>{{ product.description }}</p>
                            <p>NT$ {{ product.price }}</p>
                        </div>
                        <div class="product_management_list_item_btn"> <!-- 操作按鈕 -->
                            <button @click="editProduct(product.id)">修改</button>
                            <button @click="deleteProduct(product.id)">刪除</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <h2 v-else>未登入使用者</h2>
</template>

<script>
export default {
  data() { // 定義組件的狀態
    return { // 返回組件的狀態
      isLoggedIn: false, // 用於檢查使用者是否已登入
      products: [] // 用於儲存商品資訊
    };
  },
  methods: {
    fetchProducts() {
      // 獲取商品資訊
      const token = localStorage.getItem('jwt'); // 從 localStorage 獲取 JWT Token
      fetch('http://localhost:8080/api/products', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json()) // 解析 JSON 格式的回應
      .then(data => { // 處理獲取到的商品資訊
        console.log('Products:', data); // 檢查是否獲取到商品資訊
        this.products = data.map(product => { // 設置商品資訊
          const coverImage = product.images.find(image => image.isCover); // 獲取封面圖片
          return { // 返回商品資訊
            ...product, // 複製商品資訊
            imageUrl: coverImage ? coverImage.imageUrl : '' // 設置封面圖片 URL
          };
        });
      })
      .catch(error => { // 處理錯誤
        console.error('Error:', error); // 輸出錯誤訊息
      });
    },
    editProduct(productId) {
      // 編輯商品的邏輯
    },
    deleteProduct(productId) {
      // 刪除商品的邏輯
      const token = localStorage.getItem('jwt'); // 從 localStorage 獲取 JWT Token
      fetch(`http://localhost:8080/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.ok) {
          // 刪除成功後更新商品列表
          this.products = this.products.filter(product => product.id !== productId);
          alert('商品已刪除');
        } else {
          alert('刪除失敗');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('刪除失敗');
      });
    },
    goToAddProduct() {
      window.location.href = 'backstage_add_product.html'; // 導航到新增商品頁面
    }
  },
  mounted() {
    // 檢查用戶是否已登入
    const token = localStorage.getItem('jwt'); // 從 localStorage 獲取 JWT Token
    if (token) { // 如果有 Token，則設置使用者狀態為已登入
      this.isLoggedIn = true; // 設置使用者狀態為已登入
      this.fetchProducts(); // 獲取商品資訊
    }
  }
};
</script>

<style scoped>
.product_management {
  padding: 20px;
}

.product_management_header {
  margin-bottom: 20px;
}

.product_management_list_item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.product_management_list_item_img img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 20px;
}

.product_management_list_item_info {
  flex-grow: 1;
}

.product_management_list_item_btn button {
  margin-right: 10px;
}
</style>