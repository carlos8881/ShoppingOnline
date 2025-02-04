package com.rexshop.backstage_backend.repository;

import com.rexshop.backstage_backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // JpaRepository 提供了許多現成的方法，無需自己實現
}
