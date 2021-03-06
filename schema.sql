DROP DATABASE if exists bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    item_id INTEGER(11) auto_increment NOT NULL,
	product_name VARCHAR(50) NOT NULL,
	department_name VARCHAR(30) NOT NULL,
    price INTEGER(11) NOT NULL,
    stock_quantity INTEGER(11) NOT NULL,
    primary key (item_id)
);

ALTER TABLE products 
	ADD product_sales INTEGER(11) NOT NULL;



INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
('Indestructo Steel Ball', 'Home and Garden', 150, 15),
('Rocket-Powered Rollar Skates', 'Sports and Outdoors', 100, 10),
('Triple-Strength Fortified Leg Muscle Vitamins', 'Health', 25, 20),
('Female Road Runner Costume', 'Fashion', 55, 5),
('Artificial Rock', 'Home and Garden', 45, 15),
('Giant Rubber Band v1', 'Office', 20, 50),
('Dehydrated Boulders', 'Home and Garden', 35, 20),
('Do-It-Yourself Tornado Kit', 'Sports and Outdoors', 1000, 3),
('Iron Carrot', 'Food and Beverage', 5, 100),
('Invisible Paint', 'Home and Garden', 120, 5)
;

SELECT * FROM products;

CREATE TABLE departments (
    item_id INTEGER(11) auto_increment NOT NULL,
	department_name VARCHAR(30) NOT NULL,
	overhead_costs INTEGER NOT NULL,
    primary key (item_id)
);

INSERT INTO departments (department_name, overhead_costs)
VALUES 
('Fashion', 2623.75),
('Food and Beverage', 2725),
('Health', 2725),
('Home and Garden', 4401.25),
('Office', 2950),
('Sports and Outdoors', 5537.5)
;

SELECT * FROM departments;
