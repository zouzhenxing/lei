create database epay default charset=utf8;
use epay;
create table admin (
    id int primary key auto_increment,
    name varchar(50),
    pwd varchar(50)
);

insert into admin values(default,"admin@yuanku.org","admin");