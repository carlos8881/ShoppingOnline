const db = require('../models/db');
const CategoryService = require('../services/categoryService');

const categoryService = new CategoryService(db);

exports.getCategories = (req, res) => {
    categoryService.getAllCategories((err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            res.status(500).send('Error fetching categories');
            return;
        }

        const categories = results.reduce((acc, category) => {
            if (category.parent_id === null) {
                acc.push({ ...category, subcategories: [] });
            } else {
                const parentCategory = acc.find(cat => cat.id === category.parent_id);
                if (parentCategory) {
                    parentCategory.subcategories.push(category);
                }
            }
            return acc;
        }, []);

        res.json(categories);
    });
};

exports.getCategoriesForAddProduct = (req, res) => {
    categoryService.getAllCategories((err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            res.status(500).send('Error fetching categories');
            return;
        }

        // 展開分類結構
        const flattenCategories = (categories) => {
            let flatCategories = [];

            categories.forEach(category => {
                flatCategories.push({
                    id: category.id,
                    name: category.name,
                    parent_id: category.parent_id
                });

                if (category.subcategories && category.subcategories.length > 0) {
                    flatCategories = flatCategories.concat(flattenCategories(category.subcategories));
                }
            });

            return flatCategories;
        };

        // 將嵌套結構展開
        const categories = results.reduce((acc, category) => {
            if (category.parent_id === null) {
                acc.push({ ...category, subcategories: [] });
            } else {
                const parentCategory = acc.find(cat => cat.id === category.parent_id);
                if (parentCategory) {
                    parentCategory.subcategories.push(category);
                }
            }
            return acc;
        }, []);

        const flatCategories = flattenCategories(categories);

        res.json(flatCategories);
    });
};