package com.rexshop.backstage_backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import java.time.LocalDateTime;

@Entity // 標示這是一個 JPA 實體類
@Table(name = "products") // 指定資料庫表名稱
public class Product {

    @Id // 標示主鍵
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 自動生成主鍵
    private Long id;

    private String name; // 商品名稱
    private String description; // 商品描述

    @Column(name = "base_price")
    private Double basePrice; // 商品價格

    @Column(name = "created_at")
    private LocalDateTime createdAt; // 創建時間

    @Column(name = "has_variants")
    private Boolean hasVariants; // 是否有變體

    // Getters and Setters 獲取與設定的公開方法
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return basePrice;
    }

    public void setPrice(Double price) {
        this.basePrice = price;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getHasVariants() {
        return hasVariants;
    }

    public void setHasVariants(Boolean hasVariants) {
        this.hasVariants = hasVariants;
    }

}