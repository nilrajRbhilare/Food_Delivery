package com.foodhub.backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "menu_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItem {
    
    @Id
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    @JsonIgnore
    private Restaurant restaurant;
    
    @Column(name = "restaurant_id", insertable = false, updatable = false)
    private String restaurantId;
    
    @Column(name = "restaurant_name")
    private String restaurantName;
    
    private String category;
    
    @Column(nullable = false)
    private Double price;
    
    private Double rating = 4.0;
    
    @Column(columnDefinition = "TEXT")
    private String image;
    
    @Column(name = "is_veg")
    private Boolean isVeg = false;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "menuItem", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<OrderItem> orderItems = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = "ITEM-" + System.currentTimeMillis();
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (restaurant != null) {
            this.restaurantId = restaurant.getId();
            this.restaurantName = restaurant.getName();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        if (restaurant != null) {
            this.restaurantId = restaurant.getId();
            this.restaurantName = restaurant.getName();
        }
    }
}
