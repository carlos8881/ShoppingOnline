package com.rexshop.backstage_backend.service;

import com.rexshop.backstage_backend.entity.*;
import com.rexshop.backstage_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
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
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(basePrice);
        product.setHasVariants(hasVariants);
        product.setCreatedAt(LocalDateTime.now());
        product = productRepository.save(product);

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
            String coverImageUrl = s3Service.uploadFile(coverImage);
            ProductImage coverProductImage = new ProductImage();
            coverProductImage.setProductId(product.getId());
            coverProductImage.setImageUrl(coverImageUrl);
            coverProductImage.setIsCover(true);
            productImageRepository.save(coverProductImage);

            for (MultipartFile contentImage : contentImages) {
                String contentImageUrl = s3Service.uploadFile(contentImage);
                ProductImage contentProductImage = new ProductImage();
                contentProductImage.setProductId(product.getId());
                contentProductImage.setImageUrl(contentImageUrl);
                contentProductImage.setIsCover(false);
                productImageRepository.save(contentProductImage);
            }
        } catch (Exception e) {
            logger.error("Error uploading images", e);
            throw new RuntimeException("Error uploading images", e);
        }

        return product;
    }
}