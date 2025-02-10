<template>
  <div class="topmenu">
    <div class="menu-item">
      <a href="backstage_home.html">電商後台系統</a>
    </div>
    <div class="menu-item">
      <a href="../../index.html">檢視前台</a>
    </div>
    <div class="menu-item">
      <p v-if="isLoggedIn">{{ userStatus }}</p> <!-- 顯示使用者狀態 -->
      <button v-else @click="login">登入</button> <!-- 未登入時顯示登入按鈕 -->
    </div>
    <div class="menu-item" v-if="isLoggedIn"> <!-- 狀態是登入時顯示登出按鈕 -->
      <button @click="logout">登出</button> 
    </div>
  </div>
</template>

<script>
export default {
  data() { // 定義組件的狀態
    return {
      isLoggedIn: false,
      userStatus: '', // 用於顯示使用者狀態
    };
  },
  methods: { // 定義組件的方法
    login() {
      window.location.href = 'backstage_login.html'; // 跳轉到登入頁面
    },
    logout() {
      localStorage.removeItem('jwt'); // 移除 JWT Token
      this.userStatus = ''; // 清除使用者名稱
      this.isLoggedIn = false; // 登出後，將使用者狀態改為未登入
      alert('已登出');
    },
    setUserStatus(username) { 
      // 處理使用者狀態
      this.userStatus = `${username}`; // 顯示使用者名稱
      this.isLoggedIn = true; // 設為已登入狀態
    }
  },
  mounted() {
    // 檢查用戶是否已登入
    const token = localStorage.getItem('jwt'); // 從 localStorage 獲取 JWT Token
    console.log('JWT Token:', token); // 檢查是否獲取到 JWT
    if (token) {
      // 如果有 Token，則向後端發送請求獲取用戶資訊
      fetch('http://localhost:8080/api/user', { 
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json()) // 解析 JSON 格式的回應
      .then(data => {
        // 處理獲取到的用戶資訊
        console.log('User Data:', data); // 檢查是否獲取到用戶名
        if (data.username) { // 如果有用戶名，則設置使用者狀態
          this.setUserStatus(data.username); // 設置使用者狀態
        }
      })
      .catch(error => {
        // 處理錯誤
        console.error('Error:', error); // 輸出錯誤訊息
      });
    }
  }
};
</script>

<style scoped>
.topmenu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f8f9fa; /* 浅灰色背景 */
}

.menu-item {
  margin: 0 10px;
}

button {
  padding: 10px 20px;
  margin: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>