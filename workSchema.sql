DROP DATABASE IF EXISTS workteam_DB;
CREATE DATABASE workteam_DB;

USE workteam_DB;

CREATE TABLE department (
    department_id INT NOT NULL AUTO_INCREMENT,
    dep_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (department_id)
);

CREATE TABLE my_role (
    role_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    salary DECIMAL(40,2) NOT NULL,
    department_id int NOT NULL,
    PRIMARY KEY (role_id)
);

CREATE TABLE employee (
    employee_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_id int,
    manager_id int,
    PRIMARY KEY (employee_id)
);