package com.rexshop.backstage_backend.service;

import com.rexshop.backstage_backend.entity.*;
import com.rexshop.backstage_backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final ProductVariantRepository productVariantRepository;
    private final S3Service s3Service;

    public ProductService(ProductRepository productRepository, ProductImageRepository productImageRepository,
            ProductVariantRepository productVariantRepository, ProductCategoryRepository productCategoryRepository,
            S3Service s3Service) {
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.productVariantRepository = productVariantRepository;
        this.productCategoryRepository = productCategoryRepository;
        this.s3Service = s3Service;
    }

    public List<Product> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream().map(product -> {
            List<ProductImage> images = productImageRepository.findByProductId(product.getId());
            product.setImages(images);
            return product;
        }).collect(Collectors.toList());
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    @Transactional
    public void deleteProduct(Long id) {
        productVariantRepository.deleteAllByProductId(id);
        productImageRepository.deleteAllByProductId(id);
        productCategoryRepository.deleteAllByProductId(id);
        productRepository.deleteById(id);
    }

    @Transactional
    public Product addProduct(String name, String description, Double basePrice, Boolean hasVariants,
            Long mainCategoryId, Long subCategoryId,
            MultipartFile coverImage, MultipartFile[] contentImages, List<ProductVariant> variants) {

        // 1. 填入商品資料表
        Product product = new Product(); // 商品
        product.setName(name); // 商品名稱
        product.setDescription(description); // 商品描述
        product.setPrice(basePrice); // 商品價格
        product.setHasVariants(hasVariants); // 是否有變體
        product.setCreatedAt(LocalDateTime.now()); // 建立時間
        product = productRepository.save(product); // 填入商品

        // 2. 填入商品分類表
        ProductCategory mainCategory = new ProductCategory(); // 主分類
        mainCategory.setProduct(product); // 商品 ID
        mainCategory.setCategory(new Category(mainCategoryId)); // 分類 ID
        productCategoryRepository.save(mainCategory); // 填入主分類

        if (subCategoryId != null) {
            ProductCategory subCategory = new ProductCategory(); // 子分類
            subCategory.setProduct(product); // 商品 ID
            subCategory.setCategory(new Category(subCategoryId)); // 分類 ID
            productCategoryRepository.save(subCategory); // 填入子分類
        }

        // 3. 填入商品變體表
        if (hasVariants) { // 如果有變體
            for (ProductVariant variant : variants) { // 遍歷變體列表
                variant.setProduct(product); // 商品 ID
                productVariantRepository.save(variant); // 填入變體
            } // 結束遍歷變體列表
        } else {
            product.setHasVariants(false); // 設置 hasVariants 為 false
        }

        // 4. 上傳商品圖片到 AWS S3 儲存桶 並傳回商品圖片 URL 到商品圖片表
        try {
            String coverImageUrl = s3Service.uploadFile(coverImage); // 上傳封面圖片
            ProductImage coverProductImage = new ProductImage(); // 封面圖片
            coverProductImage.setProductId(product.getId()); // 商品 ID
            coverProductImage.setImageUrl(coverImageUrl); // 圖片 URL
            coverProductImage.setIsCover(true); // 是否為封面圖片
            productImageRepository.save(coverProductImage); // 填入封面圖片

            for (MultipartFile contentImage : contentImages) { // 遍歷內容圖片
                String contentImageUrl = s3Service.uploadFile(contentImage); // 上傳內容圖片
                ProductImage contentProductImage = new ProductImage(); // 內容圖片
                contentProductImage.setProductId(product.getId()); // 商品 ID
                contentProductImage.setImageUrl(contentImageUrl); // 圖片 URL
                contentProductImage.setIsCover(false); // 是否為封面圖片
                productImageRepository.save(contentProductImage); // 填入內容圖片
            }
        } catch (Exception e) {
            logger.error("Error uploading images", e);
            throw new RuntimeException("Error uploading images", e);
        }

        return product;
    }

    @Transactional
    public Product updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id).map(product -> {
            product.setName(updatedProduct.getName());
            product.setDescription(updatedProduct.getDescription());
            product.setPrice(updatedProduct.getPrice());
            return productRepository.save(product);
        }).orElseThrow(() -> new RuntimeException("Product not found"));
    }
}