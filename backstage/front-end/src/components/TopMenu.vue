<template>
  <div class="topmenu">
    <div class="menu-item">
      <a href="backstage_home.html">電商後台系統</a>
    </div>
    <div class="menu-item">
      <a href="../../index.html">檢視前台</a>
    </div>
    <div class="menu-item">
      <p v-if="isLoggedIn">{{ userStatus }}</p> <!-- 顯示使用者狀態(未登入或角色加名稱) -->
      <button v-else @click="login">登入</button> <!-- 未登入時顯示登入按鈕 -->
    </div>
    <div class="menu-item" v-if="isLoggedIn">
      <button @click="logout">登出</button> <!-- 狀態是登入時顯示 -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      userStatus: '未登入', // 用於顯示使用者狀態
    };
  },
  methods: {
    login() {
      // 跳轉到登入頁面
      window.location.href = 'backstage_login.html';
    },
    logout() {
      // 清除 JWT Cookie
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      this.userStatus = '未登入';
      this.isLoggedIn = false; // 登出後，將使用者狀態改為未登入
      alert('已登出');
    },
    setUserStatus(username) {
      this.userStatus = `用戶: ${username}`;
      this.isLoggedIn = true;
    },
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }
  },
  mounted() {
    // 檢查用戶是否已登入
    const token = this.getCookie('jwt');
    console.log('JWT Token:', token); // 調試代碼，檢查是否獲取到 JWT
    if (token) {
      fetch('/api/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include' // 確保請求攜帶 Cookie
      })
      .then(response => response.json())
      .then(data => {
        console.log('User Data:', data); // 調試代碼，檢查是否獲取到用戶名
        if (data.username) {
          this.setUserStatus(data.username);
        }
      })
      .catch(error => {
        console.error('Error:', error);
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