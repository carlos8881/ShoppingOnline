<template>
    <div class="system-menu">
      <div class="menu-item" v-for="item in menuItems" :key="item.text">
        <a :href="item.href">{{item.text}}</a>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { text: '商品管理', href: 'products.html' },
        { text: '訂單管理', href: 'orders.html' },
        { text: '會員管理', href: 'members.html' },
        { text: '優惠券管理', href: 'discounts.html' },
        { text: '資料統計', href: 'data_statistics.html' }
      ]
    };
  }
};
</script>

<style scoped>
.system-menu {
  padding: 10px;
}

.menu-item {
  margin: 10px 0;
}

.menu-item a {
  text-decoration: none;
  color: #007bff;
}

.menu-item a:hover {
  color: #0056b3;
}
</style>