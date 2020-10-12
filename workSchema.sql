DROP DATABASE IF EXISTS workTeam_DB;
CREATE DATABASE workTeam_DB;

USE workTeam_DB;

CREATE TABLE department (
    department_id INT NOT NULL AUTO_INCREMENT,
    dep_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (department_id)
);

CREATE TABLE my_role (
    role_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    PRIMARY KEY (role_id),
    department_id int,
    FOREIGN KEY (department_id) REFERENCES department(department_id)
);

CREATE TABLE employee (
    employee_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (employee_id),
    role_id int,
    FOREIGN KEY (role_id) REFERENCES my_role(role_id),
    manager_id int,
    FOREIGN KEY (manager_id) REFERENCES employee(employee_id)
);