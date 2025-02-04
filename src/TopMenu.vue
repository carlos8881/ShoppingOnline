<template>
    <div class="topmenu">
    <ul class="left">
      <li><a href="index.html">首頁</a></li>
      <li><a href="" id="app-download-link" @click.prevent="showDownloadAlert">APP下載</a></li>
    </ul>
      <ul class="right">
        <li v-for="item in menuItems" :key="item.text">
          <a :href="item.href" @click="item.onclick ? item.onclick() : null">{{ item.text }}</a>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        menuItems: [
          { text: '登入', href: 'login.html' },
          { text: '註冊', href: 'login.html?form=register', onclick: function() { toggleForm('showRegister'); } },
          { text: '會員中心', href: 'member_centre.html' },
          { text: '訂單', href: 'orders.html' },
          { text: '追蹤清單', href: 'attention_list.html' },
          { text: '折價券', href: 'discount.html' },
          { text: '購物車', href: 'shopping_cart.html' },
          { text: '添加商品', href: 'add_product.html' },
          { text: '瀏覽紀錄', href: 'browsing_history.html' }
        ]
      };
    },
  methods: {
    showDownloadAlert(event) {
      event.preventDefault();
      alert('APP下載未開放');
    }
  }
};
</script>