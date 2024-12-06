-- Schema gpedb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `gpedb` DEFAULT CHARACTER SET utf8 ; 
USE `gpedb` ;

-- Table `gpedb`.`users` -- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gpedb`.`users` 
( 
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('client', 'artisan', 'admin') NOT NULL,
    address VARCHAR(255),
    city VARCHAR(255),
    zipcode VARCHAR(255),
    profession VARCHAR(255),
    image_profile VARCHAR(255),
    image_bg VARCHAR(255),
    images_detail JSON, -- { "image1", "image2", ... }
    description TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Table `gpedb`.`products` -- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gpedb`.`products` 
( 
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    artisan_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    images_product JSON,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (artisan_id) REFERENCES users (user_id) ON DELETE CASCADE,
    INDEX idx_artisan_id (artisan_id)  
);

-- Table `gpedb`.`carts` -- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gpedb`.`carts` 
( 
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    artisan_id INT NOT NULL,
    product_id INT NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM ('pending', 'confirmed', 'deleted') NOT NULL DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (artisan_id) REFERENCES users (user_id) ON DELETE CASCADE,
    INDEX idx_cart_user_id (user_id)
);

-- Table `gpedb`.`orders` -- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gpedb`.`orders` 
( 
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    artisan_id INT NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    status ENUM ('Pending', 'Confirmed', 'Paid', 'Delivered', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (artisan_id) REFERENCES users (user_id) ON DELETE CASCADE
);
-- Table `gpedb`.`order_details` -- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gpedb`.`order_details` 
( 
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE
);

-- Table `gpedb`.`meta` -- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gpedb`.`meta`
(
    meta_id INT AUTO_INCREMENT PRIMARY KEY,
    meta_key VARCHAR(255) NOT NULL UNIQUE, -- category
    meta_values JSON NOT NULL, -- ["meubles", "vêtements", "chaussures", "portes", "portails", "accessoires", ...]
    INDEX idx_meta_key (meta_key)
);

-- Table `gpedb`.`product_meta` -- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gpedb`.`product_meta`
(
    product_meta_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    meta_id INT NOT NULL,
    meta_value JSON NOT NULL, -- valeur de la meta_id
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
    FOREIGN KEY (meta_id) REFERENCES meta (meta_id) ON DELETE CASCADE
);

-- Table `gpedb`.`discussions` --
CREATE TABLE IF NOT EXISTS `gpedb`.`discussions` (
    discussion_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    artisan_id INT NOT NULL,
    messages JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(user_id),
    FOREIGN KEY (artisan_id) REFERENCES users(user_id)
);

-- Table `gpedb`.`favorites`
CREATE TABLE IF NOT EXISTS `gpedb`.`favorites` (
    fav_id INT AUTO_INCREMENT PRIMARY KEY,
    fav_user INT NOT NULL,
    fav_product INT DEFAULT NULL,
    fav_business INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (fav_user) REFERENCES users (user_id),
    FOREIGN KEY (fav_product) REFERENCES products (product_id),
    FOREIGN KEY (fav_business) REFERENCES users (user_id)
);

-- Table `gpedb`.`comments` -- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gpedb`.`comments` 
( 
    comment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    content VARCHAR(1000),
    rating TINYINT NOT NULL CHECK (rating BETWEEN 0 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

-- Table `gpedb`.`password_resets` -- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gpedb`.`password_resets`
(
  password_reset_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(64) NOT NULL,
  expires DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Table `gpedb`.`predictions` -- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gpedb`.`predictions` (
    prediction_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    age VARCHAR(50),
    customization VARCHAR(5),
    personality VARCHAR(100),
    product_name VARCHAR(255),
    gender VARCHAR(20),
    preference_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);