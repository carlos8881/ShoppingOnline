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
      this.userStatus = '未登入';
      this.isLoggedIn = false; // 登出後，將使用者狀態改為未登入
      alert('已登出');
    },
    setUserStatus(username) {
      this.userStatus = `用戶: ${username}`;
      this.isLoggedIn = true;
    }
  },
  mounted() {
    // 檢查用戶是否已登入
    fetch('/api/protected-endpoint', {
      method: 'GET',
      credentials: 'include' // 確保在請求中包含 Cookie
    })
    .then(response => response.json())
    .then(data => {
      if (data.username) {
        this.setUserStatus(data.username);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
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