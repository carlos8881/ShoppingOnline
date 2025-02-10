package com.rexshop.backstage_backend.entity;

import java.io.Serializable;
import java.util.Objects;

public class ProductCategoryId implements Serializable {

    private Long product;
    private Integer category;

    // Default constructor
    public ProductCategoryId() {
    }

    // Parameterized constructor
    public ProductCategoryId(Long product, Integer category) {
        this.product = product;
        this.category = category;
    }

    // Getters and Setters
    public Long getProduct() {
        return product;
    }

    public void setProduct(Long product) {
        this.product = product;
    }

    public Integer getCategory() {
        return category;
    }

    public void setCategory(Integer category) {
        this.category = category;
    }

    // hashCode and equals
    @Override
    public int hashCode() {
        return Objects.hash(product, category);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        ProductCategoryId that = (ProductCategoryId) obj;
        return Objects.equals(product, that.product) && Objects.equals(category, that.category);
    }
}