package com.rexshop.backstage_backend.service;

import com.rexshop.backstage_backend.entity.Category;
import com.rexshop.backstage_backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getMainCategories() { // 取得所有主分類
        return categoryRepository.findMainCategories();
    }

    public List<Category> getSubCategories(Long parentId) { // 取得所有子分類
        return categoryRepository.findSubCategoriesByParentId(parentId);
    }
}