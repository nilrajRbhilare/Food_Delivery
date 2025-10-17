# Spring Boot Entity Classes with Proper JPA Mappings

## Complete Entity Classes for FoodHub Application

### 1. User Entity

```java
package com.foodhub.backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    @JsonIgnore
    private String password;
    
    private String phone;
    
    @Column(name = "user_type")
    @Enumerated(EnumType.STRING)
    private UserType userType = UserType.customer;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Order> orders = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = "USER-" + System.currentTimeMillis();
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
    
    public enum UserType {
        customer, admin
    }
    
    public void addOrder(Order order) {
        orders.add(order);
        order.setUser(this);
    }
    
    public void removeOrder(Order order) {
        orders.remove(order);
        order.setUser(null);
    }
}
```

---

### 2. Restaurant Entity

```java
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
```

---

### 3. MenuItem Entity

```java
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
```

---

### 4. Order Entity

```java
package com.foodhub.backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    
    @Id
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
    
    @Column(name = "user_id", insertable = false, updatable = false)
    private String userId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id")
    @JsonIgnore
    private Restaurant restaurant;
    
    @Column(name = "restaurant_id", insertable = false, updatable = false)
    private String restaurantId;
    
    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;
    
    private String status = "New";
    
    @Column(name = "delivery_address", columnDefinition = "TEXT")
    private String deliveryAddress;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = "ORD-" + System.currentTimeMillis();
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (user != null) {
            this.userId = user.getId();
        }
        if (restaurant != null) {
            this.restaurantId = restaurant.getId();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        if (user != null) {
            this.userId = user.getId();
        }
        if (restaurant != null) {
            this.restaurantId = restaurant.getId();
        }
    }
    
    public void addOrderItem(OrderItem orderItem) {
        orderItems.add(orderItem);
        orderItem.setOrder(this);
    }
    
    public void removeOrderItem(OrderItem orderItem) {
        orderItems.remove(orderItem);
        orderItem.setOrder(null);
    }
    
    public Double calculateTotalAmount() {
        return orderItems.stream()
            .mapToDouble(item -> item.getPrice() * item.getQuantity())
            .sum();
    }
}
```

---

### 5. OrderItem Entity

```java
package com.foodhub.backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;
    
    @Column(name = "order_id", insertable = false, updatable = false)
    private String orderId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id")
    @JsonIgnore
    private MenuItem menuItem;
    
    @Column(name = "menu_item_id", insertable = false, updatable = false)
    private String menuItemId;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false)
    private Double price;
    
    @PrePersist
    protected void onCreate() {
        if (order != null) {
            this.orderId = order.getId();
        }
        if (menuItem != null) {
            this.menuItemId = menuItem.getId();
            if (this.price == null) {
                this.price = menuItem.getPrice();
            }
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        if (order != null) {
            this.orderId = order.getId();
        }
        if (menuItem != null) {
            this.menuItemId = menuItem.getId();
        }
    }
    
    public Double getSubtotal() {
        return price * quantity;
    }
}
```

---

## Key Mapping Features

### 1. **User ↔ Order Relationship**
- **User**: `@OneToMany` with Order (One user can have many orders)
- **Order**: `@ManyToOne` with User (Many orders belong to one user)
- Cascade: `CascadeType.ALL` - when user is deleted, all their orders are deleted
- Helper methods: `addOrder()`, `removeOrder()`

### 2. **Restaurant ↔ MenuItem Relationship**
- **Restaurant**: `@OneToMany` with MenuItem (One restaurant has many menu items)
- **MenuItem**: `@ManyToOne` with Restaurant (Many items belong to one restaurant)
- Cascade: `CascadeType.ALL` with `orphanRemoval = true` - when restaurant is deleted, all menu items are deleted
- Auto-sync: MenuItem automatically updates `restaurantId` and `restaurantName` fields

### 3. **Restaurant ↔ Order Relationship**
- **Restaurant**: `@OneToMany` with Order (One restaurant can have many orders)
- **Order**: `@ManyToOne` with Restaurant (Many orders can be from one restaurant)
- Cascade: `CascadeType.ALL` - restaurant deletion removes all its orders
- Optional relationship: Orders can exist without restaurant (use `nullable`)

### 4. **Order ↔ OrderItem Relationship**
- **Order**: `@OneToMany` with OrderItem (One order contains many items)
- **OrderItem**: `@ManyToOne` with Order (Many items belong to one order)
- Cascade: `CascadeType.ALL` with `orphanRemoval = true` - deleting order removes all items
- Helper methods: `addOrderItem()`, `removeOrderItem()`, `calculateTotalAmount()`

### 5. **MenuItem ↔ OrderItem Relationship**
- **MenuItem**: `@OneToMany` with OrderItem (One menu item can be in many orders)
- **OrderItem**: `@ManyToOne` with MenuItem (Each order item references one menu item)
- Cascade: `CascadeType.ALL` - menu item deletion affects order items
- Auto-pricing: OrderItem automatically copies price from MenuItem

---

## Important Annotations Explained

### **@JsonIgnore**
- Prevents circular reference in JSON serialization
- Applied to parent entities in bidirectional relationships
- Example: `Order.user`, `MenuItem.restaurant`

### **@PrePersist & @PreUpdate**
- `@PrePersist`: Runs before entity is first saved
- `@PreUpdate`: Runs before entity is updated
- Used for auto-generating IDs and syncing denormalized fields

### **FetchType.LAZY**
- Lazy loading prevents unnecessary database queries
- Related entities loaded only when accessed
- Improves performance for large object graphs

### **Cascade Types**
- `CascadeType.ALL`: All operations cascade to children
- `orphanRemoval = true`: Removes orphaned child entities
- Example: Deleting a restaurant removes all its menu items

### **insertable = false, updatable = false**
- Used for read-only columns managed by JPA relationships
- Prevents duplicate column mapping issues
- Example: `restaurantId` in MenuItem (managed by `restaurant` relationship)

---

## Database Flow Example

### Creating a Complete Order:

```java
// 1. User places an order
User user = userRepository.findById("USER-123").orElseThrow();
Restaurant restaurant = restaurantRepository.findById("REST-456").orElseThrow();
MenuItem pizza = menuItemRepository.findById("ITEM-789").orElseThrow();

// 2. Create order
Order order = Order.builder()
    .totalAmount(0.0)
    .status("New")
    .deliveryAddress("123 Main St")
    .build();

// 3. Link order to user and restaurant
user.addOrder(order);  // Sets bidirectional relationship
restaurant.addOrder(order);

// 4. Add items to order
OrderItem orderItem = OrderItem.builder()
    .quantity(2)
    .build();
orderItem.setMenuItem(pizza);  // Auto-copies price
order.addOrderItem(orderItem);

// 5. Calculate total
order.setTotalAmount(order.calculateTotalAmount());

// 6. Save (cascades to orderItems)
orderRepository.save(order);
```

---

## Relationship Summary

| Entity | Owns Relationship | Mapped By | Cascade | Notes |
|--------|------------------|-----------|---------|-------|
| User → Order | @OneToMany | "user" | ALL | User deletion removes orders |
| Restaurant → MenuItem | @OneToMany | "restaurant" | ALL + orphanRemoval | Restaurant deletion removes menu |
| Restaurant → Order | @OneToMany | "restaurant" | ALL | Restaurant deletion removes orders |
| MenuItem → OrderItem | @OneToMany | "menuItem" | ALL | Menu deletion affects order items |
| Order → OrderItem | @OneToMany | "order" | ALL + orphanRemoval | Order deletion removes items |
| Order → User | @ManyToOne | - | - | Order belongs to user |
| Order → Restaurant | @ManyToOne | - | - | Order belongs to restaurant |
| MenuItem → Restaurant | @ManyToOne | - | - | Menu item belongs to restaurant |
| OrderItem → Order | @ManyToOne | - | - | Order item belongs to order |
| OrderItem → MenuItem | @ManyToOne | - | - | Order item references menu item |

---

## Additional DTO for API Responses

### OrderResponseDTO.java
```java
package com.foodhub.backend.dto;

import lombok.Data;
import lombok.Builder;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponseDTO {
    private String id;
    private String userId;
    private String restaurantId;
    private String restaurantName;
    private Double totalAmount;
    private String status;
    private String deliveryAddress;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> items;
    
    @Data
    @Builder
    public static class OrderItemDTO {
        private Long id;
        private String menuItemId;
        private String menuItemName;
        private Integer quantity;
        private Double price;
        private Double subtotal;
    }
}
```

This structure ensures:
✅ Proper bidirectional relationships  
✅ Automatic ID synchronization  
✅ Cascade operations for data integrity  
✅ Prevention of circular JSON serialization  
✅ Optimized lazy loading  
✅ Clean separation of concerns  
