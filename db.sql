drop table if EXISTS cart;
drop table if EXISTS batch;
drop table if EXISTS food;
drop table if EXISTS employees;
drop table if EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    userId VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL,
    dob DATE,
    phoneNumber VARCHAR(15),
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
INSERT INTO users(userId,name, email, password, dob, phoneNumber) VALUES ('e6fa9909-84b8-4a52-972f-e955a2d980ef','mithun','mithunkarthick1610@gmail.com','Password@123','2005-03-23','8124473187');
INSERT INTO users(userId,name, email, password, dob, phonenumber) VALUES ('f6b34315-d4df-46ab-a675-4eff463b6577','nandhitha','nandhithasakthiveltssn@gmail.com','Password@123','2004-11-08','9791911249');
INSERT INTO users(userId,name, email, password, dob, phonenumber) VALUES ('8991af22-4f32-4711-bdb5-312e773aa20f','dharshana','dharshana1610@gmail.com','Password@123','2004-10-16','8124473187');
INSERT INTO users(userId,name, email, password, dob, phonenumber) VALUES ('ba5162da-d44b-431c-a923-4ca0effc0ce6','venki','22pc37@psgtech.ac.in','Password@123','2004-12-25','9876543210');
INSERT INTO batch(batchId,manufacturingDate, expiryDate, manufacture) VALUES (1224,'2024-07-11','2024-07-21',1);
INSERT INTO batch(batchId,manufacturingDate, expiryDate, manufacture) VALUES (1225,'2024-07-01','2024-07-11',2);
INSERT INTO batch(batchId,manufacturingDate, expiryDate, manufacture) VALUES (1226,'2024-07-21','2024-07-31',3);
INSERT INTO batch(batchId,manufacturingDate, expiryDate, manufacture) VALUES (1227,'2024-07-21','2024-07-31',3);
INSERT INTO food(id,name, batchId, cost, stock, description) VALUES (14453,'CramaelPopcorn',1224,100,10,'Delecious Creamy Popcorn');
INSERT INTO food(id,name, batchId, cost, stock, description) VALUES (12334,'BlacksesamePopcorn',1225,100,14,'Nutritious Black Sesame Popcorn');
INSERT INTO food(id,name, batchId, cost, stock, description) VALUES (18879,'WhitesesamePopcorn',1226,100,15,'Nutritious White Sesame Popcorn');
INSERT INTO food(id,name, batchId, cost, stock, description) VALUES (18889,'PohaCandy',1227,100,15,'Nutritious Poha Candy');