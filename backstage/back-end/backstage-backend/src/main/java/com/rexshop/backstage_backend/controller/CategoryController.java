package com.rexshop.backstage_backend.controller;

import com.rexshop.backstage_backend.entity.Category;
import com.rexshop.backstage_backend.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) { // 注入 CategoryService
        this.categoryService = categoryService; // 初始化 CategoryService
    }

    @GetMapping("/main") // 獲取所有的主分類
    public ResponseEntity<List<Category>> getMainCategories() { // 獲取所有的主分類
        List<Category> mainCategories = categoryService.getMainCategories(); // 調用 CategoryService 的 getMainCategories
                                                                             // 方法獲取所有的主分類
        return ResponseEntity.ok(mainCategories); // 返回所有的主分類
    }

    @GetMapping("/sub/{parentId}") // 獲取指定父分類下的所有子分類
    public ResponseEntity<List<Category>> getSubCategories(@PathVariable Long parentId) { // 獲取指定父分類下的所有子分類
        List<Category> subCategories = categoryService.getSubCategories(parentId); // 調用 CategoryService 的
                                                                                   // getSubCategories 方法獲取指定父分類下的所有子分類
        return ResponseEntity.ok(subCategories); // 返回指定父分類下的所有子分類
    }
}