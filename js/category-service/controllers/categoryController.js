const db = require('../models/db');

exports.getCategories = (req, res) => {
    const query = 'SELECT id, name, parent_id FROM categories';
    db.query(query, (err, results) => {
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
    const query = 'SELECT id, name, parent_id FROM categories';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            res.status(500).send('Error fetching categories');
            return;
        }

        // 展平分類結構
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

        // 將嵌套結構展平
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