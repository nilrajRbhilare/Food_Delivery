# Spring Boot + MySQL Backend Setup for FoodHub

## Overview
This document provides complete instructions to build a Spring Boot backend with MySQL database for the FoodHub application. The frontend is already configured to connect to your backend at `http://localhost:8080/api`.

---

## Prerequisites
- Java 17 or higher
- Maven or Gradle
- MySQL database (local or cloud-hosted)
- Your favorite IDE (IntelliJ IDEA, Eclipse, or VS Code)

---

## Part 1: Database Setup

### 1.1 MySQL Database Schema

Run this SQL script in your MySQL database:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS fooddelivery;
USE fooddelivery;

-- Users table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    user_type ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type)
);

-- Restaurants table
CREATE TABLE restaurants (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    admin_email VARCHAR(255),
    rating DECIMAL(2,1) DEFAULT 4.0,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin_email (admin_email),
    FOREIGN KEY (admin_email) REFERENCES users(email) ON DELETE SET NULL
);

-- Menu items table
CREATE TABLE menu_items (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    restaurant_id VARCHAR(255) NOT NULL,
    restaurant_name VARCHAR(255),
    category VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    rating DECIMAL(2,1) DEFAULT 4.0,
    image TEXT,
    is_veg BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_restaurant_id (restaurant_id),
    INDEX idx_category (category),
    INDEX idx_is_veg (is_veg),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE orders (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    restaurant_id VARCHAR(255),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'New',
    delivery_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_restaurant_id (restaurant_id),
    INDEX idx_status (status),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE SET NULL
);

-- Order items table
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL,
    menu_item_id VARCHAR(255),
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    INDEX idx_order_id (order_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE SET NULL
);
```

### 1.2 Update Connection Details

**For Local XAMPP:**
- Host: `127.0.0.1`
- Port: `3307` (or `3306` for default)
- Database: `fooddelivery`
- Username: `root`
- Password: (your XAMPP MySQL password)

**For Cloud Database (Recommended for Replit):**
- Use services like PlanetScale, Railway, or AWS RDS
- Get connection string from your provider

---

## Part 2: Spring Boot Project Setup

### 2.1 Create Project Using Spring Initializr

Go to [https://start.spring.io/](https://start.spring.io/) and configure:

**Project Settings:**
- Project: Maven
- Language: Java
- Spring Boot: 3.2.x (latest stable)
- Packaging: Jar
- Java: 17

**Project Metadata:**
- Group: `com.foodhub`
- Artifact: `backend`
- Name: `FoodHub Backend`
- Package name: `com.foodhub.backend`

**Dependencies to Add:**
- Spring Web
- Spring Data JPA
- MySQL Driver
- Lombok
- Validation
- Spring Security (optional, for JWT)

Click **Generate** to download the project.

### 2.2 Maven Dependencies (pom.xml)

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Boot Starter Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- MySQL Connector -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!-- Spring Security (for JWT auth) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- JWT Library -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

### 2.3 Application Configuration (application.properties)

```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Database Configuration
spring.datasource.url=jdbc:mysql://127.0.0.1:3307/fooddelivery
spring.datasource.username=root
spring.datasource.password=your_password_here
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true

# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:5000,https://*.replit.dev
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true

# JWT Configuration
jwt.secret=YourSuperSecretKeyForJWT123456789
jwt.expiration=86400000
```

---

## Part 3: Backend Code Implementation

### 3.1 Entity Classes

**User.java**
```java
package com.foodhub.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

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
    private String password;
    
    private String phone;
    
    @Column(name = "user_type")
    @Enumerated(EnumType.STRING)
    private UserType userType = UserType.customer;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = "USER-" + System.currentTimeMillis();
        }
        createdAt = LocalDateTime.now();
    }
    
    public enum UserType {
        customer, admin
    }
}
```

**Restaurant.java**
```java
package com.foodhub.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

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
    
    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = "REST-" + System.currentTimeMillis();
        }
        createdAt = LocalDateTime.now();
    }
}
```

**MenuItem.java**
```java
package com.foodhub.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

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
    
    @Column(name = "restaurant_id", nullable = false)
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
    
    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = "ITEM-" + System.currentTimeMillis();
        }
        createdAt = LocalDateTime.now();
    }
}
```

**Order.java**
```java
package com.foodhub.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    private String id;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(name = "restaurant_id")
    private String restaurantId;
    
    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;
    
    private String status = "New";
    
    @Column(name = "delivery_address", columnDefinition = "TEXT")
    private String deliveryAddress;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = "ORD-" + System.currentTimeMillis();
        }
        createdAt = LocalDateTime.now();
    }
}
```

### 3.2 Repository Interfaces

**UserRepository.java**
```java
package com.foodhub.backend.repository;

import com.foodhub.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

**RestaurantRepository.java**
```java
package com.foodhub.backend.repository;

import com.foodhub.backend.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, String> {
    List<Restaurant> findByAdminEmail(String adminEmail);
    List<Restaurant> findByNameContainingIgnoreCase(String name);
}
```

**MenuItemRepository.java**
```java
package com.foodhub.backend.repository;

import com.foodhub.backend.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, String> {
    List<MenuItem> findByRestaurantId(String restaurantId);
    List<MenuItem> findByCategory(String category);
    List<MenuItem> findByIsVeg(Boolean isVeg);
}
```

**OrderRepository.java**
```java
package com.foodhub.backend.repository;

import com.foodhub.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByUserId(String userId);
    List<Order> findByRestaurantId(String restaurantId);
}
```

### 3.3 DTOs (Data Transfer Objects)

**LoginRequest.java**
```java
package com.foodhub.backend.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
```

**RegisterRequest.java**
```java
package com.foodhub.backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String userType;
}
```

**AuthResponse.java**
```java
package com.foodhub.backend.dto;

import com.foodhub.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class AuthResponse {
    private UserDTO user;
    private String token;
    
    @Data
    @Builder
    public static class UserDTO {
        private String id;
        private String name;
        private String email;
        private String phone;
        private String userType;
    }
}
```

### 3.4 REST Controllers

**UserController.java**
```java
package com.foodhub.backend.controller;

import com.foodhub.backend.dto.*;
import com.foodhub.backend.model.User;
import com.foodhub.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        User user = userService.register(request);
        return ResponseEntity.ok(user);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User user) {
        User updated = userService.updateUser(id, user);
        return ResponseEntity.ok(updated);
    }
}
```

**RestaurantController.java**
```java
package com.foodhub.backend.controller;

import com.foodhub.backend.model.Restaurant;
import com.foodhub.backend.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/restaurants")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class RestaurantController {
    
    private final RestaurantService restaurantService;
    
    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable String id) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }
    
    @PostMapping
    public ResponseEntity<Restaurant> createRestaurant(@RequestBody Restaurant restaurant) {
        return ResponseEntity.ok(restaurantService.createRestaurant(restaurant));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(@PathVariable String id, @RequestBody Restaurant restaurant) {
        return ResponseEntity.ok(restaurantService.updateRestaurant(id, restaurant));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable String id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.noContent().build();
    }
}
```

**MenuItemController.java**
```java
package com.foodhub.backend.controller;

import com.foodhub.backend.model.MenuItem;
import com.foodhub.backend.service.MenuItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/menu-items")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MenuItemController {
    
    private final MenuItemService menuItemService;
    
    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllMenuItems() {
        return ResponseEntity.ok(menuItemService.getAllMenuItems());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable String id) {
        return ResponseEntity.ok(menuItemService.getMenuItemById(id));
    }
    
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<MenuItem>> getMenuItemsByRestaurant(@PathVariable String restaurantId) {
        return ResponseEntity.ok(menuItemService.getMenuItemsByRestaurant(restaurantId));
    }
    
    @PostMapping
    public ResponseEntity<MenuItem> createMenuItem(@RequestBody MenuItem menuItem) {
        return ResponseEntity.ok(menuItemService.createMenuItem(menuItem));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable String id, @RequestBody MenuItem menuItem) {
        return ResponseEntity.ok(menuItemService.updateMenuItem(id, menuItem));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable String id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }
}
```

**OrderController.java**
```java
package com.foodhub.backend.controller;

import com.foodhub.backend.model.Order;
import com.foodhub.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable String id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable String userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }
    
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.createOrder(order));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}
```

### 3.5 Service Layer

**UserService.java**
```java
package com.foodhub.backend.service;

import com.foodhub.backend.dto.*;
import com.foodhub.backend.model.User;
import com.foodhub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .userType(User.UserType.valueOf(request.getUserType()))
                .build();
        
        return userRepository.save(user);
    }
    
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        AuthResponse.UserDTO userDTO = AuthResponse.UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .userType(user.getUserType().toString())
                .build();
        
        return AuthResponse.builder()
                .user(userDTO)
                .token("temp-token")
                .build();
    }
    
    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public User updateUser(String id, User userData) {
        User user = getUserById(id);
        user.setName(userData.getName());
        user.setPhone(userData.getPhone());
        return userRepository.save(user);
    }
}
```

**RestaurantService.java**
```java
package com.foodhub.backend.service;

import com.foodhub.backend.model.Restaurant;
import com.foodhub.backend.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService {
    
    private final RestaurantRepository restaurantRepository;
    
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }
    
    public Restaurant getRestaurantById(String id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }
    
    public Restaurant createRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }
    
    public Restaurant updateRestaurant(String id, Restaurant restaurantData) {
        Restaurant restaurant = getRestaurantById(id);
        restaurant.setName(restaurantData.getName());
        restaurant.setLocation(restaurantData.getLocation());
        restaurant.setRating(restaurantData.getRating());
        restaurant.setImage(restaurantData.getImage());
        return restaurantRepository.save(restaurant);
    }
    
    public void deleteRestaurant(String id) {
        restaurantRepository.deleteById(id);
    }
}
```

**MenuItemService.java**
```java
package com.foodhub.backend.service;

import com.foodhub.backend.model.MenuItem;
import com.foodhub.backend.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuItemService {
    
    private final MenuItemRepository menuItemRepository;
    
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }
    
    public MenuItem getMenuItemById(String id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
    }
    
    public List<MenuItem> getMenuItemsByRestaurant(String restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId);
    }
    
    public MenuItem createMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }
    
    public MenuItem updateMenuItem(String id, MenuItem menuItemData) {
        MenuItem menuItem = getMenuItemById(id);
        menuItem.setName(menuItemData.getName());
        menuItem.setPrice(menuItemData.getPrice());
        menuItem.setCategory(menuItemData.getCategory());
        menuItem.setDescription(menuItemData.getDescription());
        menuItem.setImage(menuItemData.getImage());
        menuItem.setIsVeg(menuItemData.getIsVeg());
        return menuItemRepository.save(menuItem);
    }
    
    public void deleteMenuItem(String id) {
        menuItemRepository.deleteById(id);
    }
}
```

**OrderService.java**
```java
package com.foodhub.backend.service;

import com.foodhub.backend.model.Order;
import com.foodhub.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    public Order getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
    
    public List<Order> getOrdersByUser(String userId) {
        return orderRepository.findByUserId(userId);
    }
    
    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }
    
    public Order updateOrderStatus(String id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
```

### 3.6 Security Configuration

**SecurityConfig.java**
```java
package com.foodhub.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            );
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5000", "https://*.replit.dev"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

---

## Part 4: Running the Application

### 4.1 Local Development

```bash
# Navigate to your Spring Boot project directory
cd backend

# Run with Maven
mvn spring-boot:run

# Or run with Gradle
./gradlew bootRun
```

Your backend will start at: `http://localhost:8080/api`

### 4.2 Testing the Connection

**Test User Registration:**
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "1234567890",
    "userType": "customer"
  }'
```

**Test Login:**
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4.3 Connect Frontend

1. Ensure your Spring Boot backend is running on `http://localhost:8080`
2. Your frontend is already configured to connect to `http://localhost:8080/api`
3. Start your Vite dev server (it's already running on port 5000)
4. Open the app and try registering/logging in!

---

## Part 5: Deployment Options

### For Replit Deployment:
- You'll need a cloud-hosted MySQL database (PlanetScale, Railway, AWS RDS)
- Update `application.properties` with cloud database credentials
- Deploy Spring Boot using Replit's Java environment

### For External Deployment:
- **Heroku**: Use ClearDB MySQL add-on
- **Railway**: Built-in PostgreSQL (adjust code) or external MySQL
- **AWS**: Use RDS for MySQL + EC2/Elastic Beanstalk for Spring Boot
- **Google Cloud**: Cloud SQL + App Engine

---

## Troubleshooting

**Connection Refused:**
- Check if MySQL is running on the correct port
- Verify database credentials in `application.properties`

**CORS Errors:**
- Ensure CORS configuration includes your frontend URL
- Check `SecurityConfig.java` CORS settings

**Authentication Issues:**
- Password encoding must match (BCrypt)
- Check JWT token generation/validation

**Database Errors:**
- Verify schema exists and matches entity definitions
- Check `spring.jpa.hibernate.ddl-auto` setting

---

## Next Steps

1. ✅ Set up your MySQL database
2. ✅ Create Spring Boot project with dependencies
3. ✅ Copy entity, repository, service, and controller code
4. ✅ Configure `application.properties`
5. ✅ Run the application
6. ✅ Test API endpoints
7. ✅ Connect with frontend

Your FoodHub application is now ready for full-stack development! 🚀
