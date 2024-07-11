drop table if EXISTS users;
drop table if EXISTS Admin;
drop table if EXISTS Batch;
drop table if EXISTS Food;
drop table if EXISTS Cart;

CREATE TABLE users (
    userid VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    passwords VARCHAR(60) NOT NULL,
    dob DATE,
    phonenumber VARCHAR(15)
);

CREATE TABLE Admin (
    Role VARCHAR(10),
    ID INT PRIMARY KEY,
    Name VARCHAR(20),
    Email VARCHAR(20),
    Passwords VARCHAR(20)
);

CREATE TABLE Batch (
    BatchId INT PRIMARY KEY,
    ManufacturingDate DATE,
    ExpiryDate DATE,
    Manufacture INT
);

CREATE TABLE Food (
    ID INT PRIMARY KEY,
    Name VARCHAR(20),
    BatchID INT,
    cost INT,
    stock INT,
    Description VARCHAR(255),
    FOREIGN KEY (BatchID) REFERENCES Batch(BatchID)
);

CREATE TABLE Cart (
    count INT,
    Userid VARCHAR(36),
    FoodID INT,
    FOREIGN KEY (Userid) REFERENCES Users(Userid),
    FOREIGN KEY (FoodID) REFERENCES Food(ID)
);

CREATE TABLE WishList (
    FoodID INT,
    Userid VARCHAR(36),
    FOREIGN KEY (FoodID) REFERENCES food(ID),
    FOREIGN KEY (Userid) REFERENCES users(Userid)
);
