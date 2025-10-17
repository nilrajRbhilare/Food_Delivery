package com.foodhub.backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "restaurants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant {
    
    @Id
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    private String location;
    
    @Column(name = "admin_email")
    private String adminEmail;
    
    private Double rating = 4.0;
    
    @Column(columnDefinition = "TEXT")
    private String image;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<MenuItem> menuItems = new ArrayList<>();
    
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Order> orders = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = "REST-" + System.currentTimeMillis();
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
    
    public void addMenuItem(MenuItem menuItem) {
        menuItems.add(menuItem);
        menuItem.setRestaurant(this);
    }
    
    public void removeMenuItem(MenuItem menuItem) {
        menuItems.remove(menuItem);
        menuItem.setRestaurant(null);
    }
    
    public void addOrder(Order order) {
        orders.add(order);
        order.setRestaurant(this);
    }
    
    public void removeOrder(Order order) {
        orders.remove(order);
        order.setRestaurant(null);
    }
}
