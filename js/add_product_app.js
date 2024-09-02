document.addEventListener('DOMContentLoaded', () => {
    const mainCategorySelect = document.getElementById('main_category');
    const subCategoryContainer = document.getElementById('sub_category_container');
    const subCategorySelect = document.getElementById('sub_category');

    let categories = [];
    let mainCategories = [];
    let subCategories = [];

    // *注入式攻擊或其他安全措施未設置
    // Fetch categories from the server
    fetch('http://localhost:3000/get_categories_for_add_product')
        .then(response => response.json())
        .then(data => {
            categories = data;
            mainCategories = categories.filter(category => category.parent_id === null);
            populateMainCategories();
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });

    // Populate main categories
    function populateMainCategories() {
        mainCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            mainCategorySelect.appendChild(option);
        });
        console.log('Main Categories:', mainCategories); // 調試輸出
    }

    // Event listener for main category change
    mainCategorySelect.addEventListener('change', () => {
        const selectedMainCategoryId = mainCategorySelect.value;
        if (selectedMainCategoryId) {
            subCategories = categories.filter(category => category.parent_id == selectedMainCategoryId);
            populateSubCategories();
            subCategoryContainer.style.display = subCategories.length > 0 ? 'block' : 'none';
        } else {
            subCategoryContainer.style.display = 'none';
        }
    });

    // Populate sub categories
    function populateSubCategories() {
        subCategorySelect.innerHTML = ''; // Clear previous options
        subCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            subCategorySelect.appendChild(option);
        });
        console.log('Sub Categories:', subCategories); // 調試輸出
    }

    // Form submission handler
    document.getElementById('addProductForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        console.log('Form Data:', formData); // 調試輸出

        const response = await fetch('http://localhost:3000/add-products', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('新商品添加成功');
        } else {
            alert('添加商品失敗');
        }
    });
});