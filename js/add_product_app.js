document.addEventListener('DOMContentLoaded', () => {
    const mainCategorySelect = document.getElementById('main_category');
    const subCategoryContainer = document.getElementById('sub_category_container');
    const subCategorySelect = document.getElementById('sub_category');
    const hasVariantsCheckbox = document.getElementById('has_variants');
    const variantsContainer = document.getElementById('variants_container');
    const addVariant1ValueButton = document.getElementById('add_variant1_value');
    const addVariant2ValueButton = document.getElementById('add_variant2_value');
    const variant1ValuesList = document.getElementById('variant1_values_list');
    const variant1PriceStockList = document.getElementById('variant1_price_stock_list');
    const variant2ValuesList = document.getElementById('variant2_values_list');
    const variantCombinationsList = document.getElementById('variant_combinations_list');

    let categories = [];
    let mainCategories = [];
    let subCategories = [];

    fetch(`${window.AppConfig.API_URL}/categories/get_categories_for_add_product`) // 從後端獲取商品分類
        .then(response => response.json()) // 解析JSON數據
        .then(data => { // 成功獲取數據
            categories = data; // 賦值給全局變量
            mainCategories = categories.filter(category => category.parent_id === null); // 獲取主分類
            populateMainCategories(); // 填充主分類
        })
        .catch(error => { // 獲取數據失敗
            console.error('Error fetching categories:', error);
        });

    function populateMainCategories() { // 填充主分類
        mainCategories.forEach(category => { // 遍歷主分類
            const option = document.createElement('option'); // 創建選項
            option.value = category.id; // 設置選項值
            option.textContent = category.name; // 設置選項文本
            mainCategorySelect.appendChild(option); // 添加選項到下拉列表
        });
        console.log('Main Categories:', mainCategories); // 調試輸出
    }

    mainCategorySelect.addEventListener('change', () => { // 主分類更改事件監聽
        const selectedMainCategoryId = mainCategorySelect.value;
        if (selectedMainCategoryId) { // 如果選擇了主分類
            subCategories = categories.filter(category => category.parent_id == selectedMainCategoryId); // 獲取子分類
            populateSubCategories(); // 填充子分類
            subCategoryContainer.style.display = subCategories.length > 0 ? 'block' : 'none'; // 顯示或隱藏子分類容器
        } else { // 如果沒有選擇主分類
            subCategoryContainer.style.display = 'none'; // 隱藏子分類容器
        }
    });

    function populateSubCategories() { // 填充子分類
        subCategorySelect.innerHTML = ''; // 清空子分類下拉列表
        subCategories.forEach(category => { // 遍歷子分類
            const option = document.createElement('option'); // 創建選項
            option.value = category.id; // 設置選項值
            option.textContent = category.name; // 設置選項文本
            subCategorySelect.appendChild(option); // 添加選項到下拉列表
        });
        console.log('Sub Categories:', subCategories); // 調試輸出
    }

    hasVariantsCheckbox.addEventListener('change', () => { // 是否有變體事件監聽
        variantsContainer.style.display = hasVariantsCheckbox.checked ? 'block' : 'none'; // 顯示或隱藏變體容器
    });

    addVariant1ValueButton.addEventListener('click', () => { // 添加第一層變體值按鈕事件監聽
        const variant1ValueDiv = document.createElement('div'); // 創建第一層變體值容器
        const variant1ValueInput = document.createElement('input'); // 創建第一層變體值輸入框
        variant1ValueInput.type = 'text'; // 設置輸入框類型
        variant1ValueInput.name = 'variant1_values[]'; // 設置輸入框名稱
        variant1ValueInput.placeholder = '第一層變體值'; // 設置輸入框占位符
        variant1ValueInput.required = true; // 設置輸入框必填

        const removeButton = document.createElement('button'); // 創建移除按鈕
        removeButton.type = 'button'; // 設置按鈕類型
        removeButton.textContent = '移除'; // 設置按鈕文本
        removeButton.classList.add('remove_variant1_value'); // 添加移除按鈕類名

        variant1ValueDiv.appendChild(variant1ValueInput);
        variant1ValueDiv.appendChild(removeButton);
        variant1ValuesList.appendChild(variant1ValueDiv);

        removeButton.addEventListener('click', () => { // 移除按鈕事件監聽
            variant1ValuesList.removeChild(variant1ValueDiv); // 移除第一層變體值
            variant1PriceStockList.removeChild(document.getElementById(`price_stock_${variant1ValueInput.value}`)); // 移除價錢和庫存輸入框
            generateVariantCombinations(); // 生成變體組合
        });

        // 動態生成價錢和庫存的輸入框
        const priceStockDiv = document.createElement('div'); // 創建價錢和庫存容器
        priceStockDiv.id = `price_stock_${variant1ValueInput.value}`; // 設置容器ID
        priceStockDiv.innerHTML = `
            <span>${variant1ValueInput.value}</span>
            <input type="number" name="variant1_stock[]" placeholder="庫存數量" required>
            <input type="number" name="variant1_price[]" placeholder="價格" step="0.01" required>
        `;
        variant1PriceStockList.appendChild(priceStockDiv);

        generateVariantCombinations();
    });

    addVariant2ValueButton.addEventListener('click', () => { // 添加第二層變體值按鈕事件監聽
        const variant2ValueDiv = document.createElement('div'); // 創建第二層變體值容器
        variant2ValueDiv.innerHTML = `
            <input type="text" name="variant2_values[]" placeholder="第二層變體值" required>
            <button type="button" class="remove_variant2_value">移除</button>
        `;
        variant2ValuesList.appendChild(variant2ValueDiv);

        variant2ValueDiv.querySelector('.remove_variant2_value').addEventListener('click', () => { // 移除按鈕事件監聽
            variant2ValuesList.removeChild(variant2ValueDiv); // 移除第二層變體值
            generateVariantCombinations(); // 生成變體組合
        });

        generateVariantCombinations();
    });

    function generateVariantCombinations() { // 生成變體組合
        variantCombinationsList.innerHTML = ''; // 清空變體組合列表

        const variant1Values = Array.from(document.getElementsByName('variant1_values[]')).map(input => input.value); // 獲取第一層變體值
        const variant2Values = Array.from(document.getElementsByName('variant2_values[]')).map(input => input.value); // 獲取第二層變體值

        variant1Values.forEach(variant1Value => { // 遍歷第一層變體值
            variant2Values.forEach(variant2Value => {   // 遍歷第二層變體值
                const combinationDiv = document.createElement('div'); // 創建組合容器
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

    document.getElementById('addProductForm').addEventListener('submit', async (event) => { // 添加商品表單提交事件監聽
        event.preventDefault(); // 阻止表單默認提交行為
        const formData = new FormData(event.target); // 獲取表單數據

        console.log('Form Data:', formData); // 調試輸出

        try {
            const response = await fetch(`${window.AppConfig.API_URL}/products/add-products`, { // 發送添加商品請求
                method: 'POST', // 請求方法
                body: formData // 請求數據
            });

            if (response.ok) { // 如果添加商品成功
                alert('新商品添加成功');
            } else { // 如果添加商品失敗
                alert('添加商品失败');
            }
        } catch (error) { // 請求失敗
            console.error('Error:', error);
            alert('添加商品失败');
        }
    });
});