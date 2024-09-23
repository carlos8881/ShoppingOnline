document.addEventListener('DOMContentLoaded', () => {
    const mainCategorySelect = document.getElementById('main_category');
    const subCategoryContainer = document.getElementById('sub_category_container');
    const subCategorySelect = document.getElementById('sub_category');
    const hasVariantsCheckbox = document.getElementById('has_variants');
    const variantsContainer = document.getElementById('variants_container');
    const addVariant1ValueButton = document.getElementById('add_variant1_value');
    const addVariant2ValueButton = document.getElementById('add_variant2_value');
    const variant1ValuesList = document.getElementById('variant1_values_list');
    const variant1PriceStockList = document.getElementById('variant1_price_stock_list'); // 新增這個變數
    const variant2ValuesList = document.getElementById('variant2_values_list');
    const variantCombinationsList = document.getElementById('variant_combinations_list');

    let categories = [];
    let mainCategories = [];
    let subCategories = [];

    // Fetch categories from the server
    fetch('https://d1khcxe0f8g5xw.cloudfront.net/categories/get_categories_for_add_product')
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

    // Event listener for has variants checkbox
    hasVariantsCheckbox.addEventListener('change', () => {
        variantsContainer.style.display = hasVariantsCheckbox.checked ? 'block' : 'none';
    });

    // Event listener for add variant1 value button
    addVariant1ValueButton.addEventListener('click', () => {
        const variant1ValueDiv = document.createElement('div');
        const variant1ValueInput = document.createElement('input');
        variant1ValueInput.type = 'text';
        variant1ValueInput.name = 'variant1_values[]';
        variant1ValueInput.placeholder = '第一層變體值';
        variant1ValueInput.required = true;

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.textContent = '移除';
        removeButton.classList.add('remove_variant1_value');

        variant1ValueDiv.appendChild(variant1ValueInput);
        variant1ValueDiv.appendChild(removeButton);
        variant1ValuesList.appendChild(variant1ValueDiv);

        // Event listener for remove variant1 value button
        removeButton.addEventListener('click', () => {
            variant1ValuesList.removeChild(variant1ValueDiv);
            variant1PriceStockList.removeChild(document.getElementById(`price_stock_${variant1ValueInput.value}`));
            generateVariantCombinations();
        });

        // 動態生成價錢和庫存的輸入框
        const priceStockDiv = document.createElement('div');
        priceStockDiv.id = `price_stock_${variant1ValueInput.value}`;
        priceStockDiv.innerHTML = `
            <span>${variant1ValueInput.value}</span>
            <input type="number" name="variant1_stock[]" placeholder="庫存數量" required>
            <input type="number" name="variant1_price[]" placeholder="價格" step="0.01" required>
        `;
        variant1PriceStockList.appendChild(priceStockDiv);

        generateVariantCombinations();
    });

    // Event listener for add variant2 value button
    addVariant2ValueButton.addEventListener('click', () => {
        const variant2ValueDiv = document.createElement('div');
        variant2ValueDiv.innerHTML = `
            <input type="text" name="variant2_values[]" placeholder="第二層變體值" required>
            <button type="button" class="remove_variant2_value">移除</button>
        `;
        variant2ValuesList.appendChild(variant2ValueDiv);

        // Event listener for remove variant2 value button
        variant2ValueDiv.querySelector('.remove_variant2_value').addEventListener('click', () => {
            variant2ValuesList.removeChild(variant2ValueDiv);
            generateVariantCombinations();
        });

        generateVariantCombinations();
    });

    // Generate variant combinations
    function generateVariantCombinations() {
        variantCombinationsList.innerHTML = ''; // Clear previous combinations

        const variant1Values = Array.from(document.getElementsByName('variant1_values[]')).map(input => input.value);
        const variant2Values = Array.from(document.getElementsByName('variant2_values[]')).map(input => input.value);

        variant1Values.forEach(variant1Value => {
            variant2Values.forEach(variant2Value => {
                const combinationDiv = document.createElement('div');
                combinationDiv.innerHTML = `
                    <span>${variant1Value} - ${variant2Value}</span>
                    <input type="hidden" name="variant_combinations[]" value="${variant1Value}-${variant2Value}">
                    <input type="number" name="variant_stock[]" placeholder="庫存數量" required>
                    <input type="number" name="variant_price[]" placeholder="價格" step="0.01" required>
                `;
                variantCombinationsList.appendChild(combinationDiv);
            });
        });
    }

    // Form submission handler
    document.getElementById('addProductForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        console.log('Form Data:', formData); // 調試輸出

        const response = await fetch('https://d1khcxe0f8g5xw.cloudfront.net/products/add-products', {
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