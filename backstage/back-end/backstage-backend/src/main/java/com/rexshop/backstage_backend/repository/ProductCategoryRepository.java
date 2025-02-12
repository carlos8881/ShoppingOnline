package com.rexshop.backstage_backend.repository;

import com.rexshop.backstage_backend.entity.ProductCategory;
import com.rexshop.backstage_backend.entity.ProductCategoryId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, ProductCategoryId> {
    void deleteAllByProductId(Long productId);
}