package com.rexshop.backstage_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product_categories")
@IdClass(ProductCategoryId.class)
public class ProductCategory {

    @Id
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Id
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    // Getters and Setters
    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}