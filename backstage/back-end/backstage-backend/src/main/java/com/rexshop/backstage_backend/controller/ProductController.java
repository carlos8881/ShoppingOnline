package com.rexshop.backstage_backend.controller;

import com.rexshop.backstage_backend.entity.Product;
import com.rexshop.backstage_backend.entity.ProductVariant;
import com.rexshop.backstage_backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping // 取得所有商品
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}") // 透過商品 ID 取得商品
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}") // 刪除商品
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping // 新增商品
    public ResponseEntity<Product> addProduct(
            @RequestParam("name") String name, // 商品名稱
            @RequestParam("description") String description, // 商品描述
            @RequestParam("base_price") Double basePrice, // 商品價格
            @RequestParam("has_variants") Boolean hasVariants, // 是否有變體
            @RequestParam("main_category") Long mainCategoryId, // 主分類 ID
            @RequestParam(value = "sub_category", required = false) Long subCategoryId, // 子分類 ID
            @RequestParam("cover_image") MultipartFile coverImage, // 封面圖片
            @RequestParam("content_images") MultipartFile[] contentImages, // 內容圖片
            @RequestParam(value = "variant_name_1", required = false) String variantName1, // 變體名稱 1
            @RequestParam(value = "variant_price_1", required = false) Double variantPrice1, // 變體價格 1
            @RequestParam(value = "variant_name_2", required = false) String variantName2, // 變體名稱 2
            @RequestParam(value = "variant_price_2", required = false) Double variantPrice2) { // 變體價格 2
        List<ProductVariant> variants = new ArrayList<>(); // 變體列表
        if (hasVariants) { // 如果有變體
            if (variantName1 != null && variantPrice1 != null) { // 如果變體名稱 1 和變體價格 1 不為空
                variants.add(new ProductVariant(variantName1, variantPrice1, null)); // 添加變體 1
            }
            if (variantName2 != null && variantPrice2 != null) { // 如果變體名稱 2 和變體價格 2 不為空
                variants.add(new ProductVariant(variantName2, variantPrice2, null)); // 添加變體 2
            }
        }

        try {
            Product product = productService.addProduct(name, description, basePrice, hasVariants, mainCategoryId,
                    subCategoryId, coverImage, contentImages, variants); // 新增商品
            return ResponseEntity.ok(product); // 返回新增的商品
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null); // 返回錯誤狀態碼
        }
    }
}