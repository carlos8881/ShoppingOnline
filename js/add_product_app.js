
document.getElementById('addProductForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert('新商品添加成功');
    } else {
        alert('添加商品失敗');
    }
});

new Vue({
    el: '#app',
    data: {
        categories: [],
        mainCategories: [],
        subCategories: [],
        selectedMainCategory: null,
        selectedSubCategory: null
    },
    created() {
        this.fetchCategories();
    },
    methods: {
        fetchCategories() {
            fetch('http://localhost:3000/get_categories_for_add_product')
                .then(response => response.json())
                .then(data => {
                    console.log('Raw Data:', data);
                    this.categories = data;
                    this.mainCategories = data.filter(category => category.parent_id === null);
                    console.log('Main Categories:', this.mainCategories);
                })
                .catch(error => {
                    console.error('Error fetching categories:', error);
                });
        },
        fetchSubCategories() {
            console.log('Selected Main Category:', this.selectedMainCategory);
            if (this.selectedMainCategory !== null) {
                this.subCategories = this.categories.filter(category => category.parent_id === this.selectedMainCategory);
                console.log('Sub Categories:', this.subCategories);
            } else {
                this.subCategories = [];
            }
        }
    }
});