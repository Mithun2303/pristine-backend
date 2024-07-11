drop table if EXISTS users;
drop table if EXISTS admin;
drop table if EXISTS batch;
drop table if EXISTS food;
drop table if EXISTS employees;
drop table if EXISTS cart;

CREATE TABLE IF NOT EXISTS users (
    userId VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL,
    dob DATE,
    phonenumber VARCHAR(15),
    access_token VARCHAR(255),
    refresh_token VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS employees (
    role VARCHAR(10),
    employeeId INT PRIMARY KEY,
    name VARCHAR(20),
    email VARCHAR(20),
    password VARCHAR(20),
    access_token VARCHAR(255),
    refresh_token VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS batch (
    batchId INT PRIMARY KEY,
    manufacturingDate DATE,
    expiryDate DATE,
    manufacture INT
);

CREATE TABLE IF NOT EXISTS food (
    id INT PRIMARY KEY,
    name VARCHAR(20),
    batchId INT,
    cost INT,
    stock INT,
    description VARCHAR(255),
    FOREIGN KEY (batchId) REFERENCES batch(batchId)
);

CREATE TABLE IF NOT EXISTS cart(
    count INT,
    userId VARCHAR(36),
    foodId INT,
    FOREIGN KEY (userId) REFERENCES users(userId),
    FOREIGN KEY (foodId) REFERENCES food(id)
);

CREATE TABLE IF NOT EXISTS wishList (
    foodId INT,
    userId VARCHAR(36),
    FOREIGN KEY (foodId) REFERENCES food(id),
    FOREIGN KEY (userId) REFERENCES users(userId)
);


\dt