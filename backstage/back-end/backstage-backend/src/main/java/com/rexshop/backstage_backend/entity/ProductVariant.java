package com.rexshop.backstage_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product_variants")
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "variant_combination")
    private String variantCombination;

    @Column(name = "price")
    private Double price;

    // Default constructor
    public ProductVariant() {
    }

    // Parameterized constructor
    public ProductVariant(String variantCombination, Double price, Product product) {
        this.variantCombination = variantCombination;
        this.price = price;
        this.product = product;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getVariantCombination() {
        return variantCombination;
    }

    public void setVariantCombination(String variantCombination) {
        this.variantCombination = variantCombination;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}