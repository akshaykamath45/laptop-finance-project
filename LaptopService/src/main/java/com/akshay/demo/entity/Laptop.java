package com.akshay.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "LAPTOP")
public class Laptop {

    @Id
    @Column(name = "LAPTOP_ID", length = 10)
    private String laptopId;

    @Column(name = "BRAND", length = 50)
    private String brand;

    @Column(name = "MODEL", length = 100)
    private String model;

    @Column(name = "PROCESSOR", length = 50)
    private String processor;

    @Column(name = "RAM", length = 20)
    private String ram;

    @Column(name = "STORAGE", length = 30)
    private String storage;

    @Column(name = "GPU", length = 50)
    private String gpu;

    @Column(name = "PRICE", precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "imgurl", length = 300)
    private String imgurl;

    // Constructors
    public Laptop() {}

    public Laptop(String laptopId, String brand, String model, String processor, String ram, String storage, String gpu, BigDecimal price, String imgurl) {
        this.laptopId = laptopId;
        this.brand = brand;
        this.model = model;
        this.processor = processor;
        this.ram = ram;
        this.storage = storage;
        this.gpu = gpu;
        this.price = price;
        this.imgurl = imgurl;
    }

    // Getters and Setters

    public String getLaptopId() {
        return laptopId;
    }

    public void setLaptopId(String laptopId) {
        this.laptopId = laptopId;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getProcessor() {
        return processor;
    }

    public void setProcessor(String processor) {
        this.processor = processor;
    }

    public String getRam() {
        return ram;
    }

    public void setRam(String ram) {
        this.ram = ram;
    }

    public String getStorage() {
        return storage;
    }

    public void setStorage(String storage) {
        this.storage = storage;
    }

    public String getGpu() {
        return gpu;
    }

    public void setGpu(String gpu) {
        this.gpu = gpu;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getImgurl() {
        return imgurl;
    }

    public void setImgurl(String imgurl) {
        this.imgurl = imgurl;
    }
}
