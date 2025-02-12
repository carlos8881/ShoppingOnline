package com.rexshop.backstage_backend.repository;

import com.rexshop.backstage_backend.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    void deleteAllByProductId(Long productId);
}