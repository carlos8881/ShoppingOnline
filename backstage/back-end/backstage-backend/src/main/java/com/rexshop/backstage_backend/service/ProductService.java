package com.rexshop.backstage_backend.service;

import com.rexshop.backstage_backend.entity.Product;
import com.rexshop.backstage_backend.entity.ProductImage;
import com.rexshop.backstage_backend.repository.ProductRepository;
import com.rexshop.backstage_backend.repository.ProductImageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    public ProductService(ProductRepository productRepository, ProductImageRepository productImageRepository) {
        // 注入 Repository
        this.productRepository = productRepository; // 注入商品 Repository
        this.productImageRepository = productImageRepository; // 注入商品圖片 Repository
    }

    public List<Product> getAllProducts() { // 取得所有商品
        List<Product> products = productRepository.findAll(); // 取得所有商品
        for (Product product : products) { // 對每個商品
            List<ProductImage> images = productImageRepository.findByProductId(product.getId()); // 取得商品圖片
            product.setImages(images); // 將圖片設定到商品中
        }
        return products;
    }

    public Optional<Product> getProductById(Long id) { // 取得商品
        Optional<Product> product = productRepository.findById(id); // 取得商品
        product.ifPresent(p -> { // 如果有取得商品
            List<ProductImage> images = productImageRepository.findByProductId(p.getId()); // 取得商品圖片
            p.setImages(images); // 將圖片設定到商品中
        });
        return product;
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}