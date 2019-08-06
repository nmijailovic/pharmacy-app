create table Couriers
(
    id int auto_increment primary key,
    businessName varchar(120) not null,
    contactName varchar(120) not null,
    phoneNumber varchar(30) null,
    address1 varchar(120) not null,
    address2 varchar(120) null,
    state varchar(8) not null,
    postcode varchar(8) not null,
    createdAt datetime not null,
    updatedAt datetime not null,
    deletedAt datetime null
);

create table Doctors
(
    id int auto_increment primary key,
    firstName varchar(50) not null,
    lastName varchar(50) not null,
    phoneNumber varchar(30) not null,
    licenseNo varchar(30) not null,
    licenseExpiry date not null,
    practiceType varchar(120) not null,
    createdAt datetime not null,
    updatedAt datetime not null,
    deletedAt datetime null
);

create table Drugstores
(
    id int auto_increment primary key,
    businessName varchar(120) not null,
    contactName varchar(120) null,
    phoneNumber varchar(30) null,
    address1 varchar(120) not null,
    address2 varchar(120) null,
    state varchar(8) not null,
    postcode varchar(8) not null,
    hoursOpening varchar(8) not null,
    hoursClosing varchar(8) not null,
    updatedAt datetime not null,
    createdAt datetime not null,
    deletedAt datetime null
);

create table Prescriptions
(
    id int auto_increment primary key,
    IssuingDoctorId int not null,
    IssuedToUserId int not null,
    ProvidedByDrugstoreId int null,
    ProvidedAt datetime null,
    DeliveredByCourierId int not null,
    DeliveredAt datetime null,
    expiryDate date null,
    notes text null,
    createdAt datetime not null,
    deletedAt datetime null,
    updatedAt datetime not null
);

create table PrescriptionItems
(
    id int auto_increment primary key,
    code varchar(30) not null,
    name varchar(120) not null,
    createdAt datetime null,
    updatedAt datetime not null,
    deletedAt datetime null
);

create table Users
(
    id int auto_increment primary key,
    email varchar(128) not null,
    firstName varchar(50) not null,
    lastName varchar(50) not null,
    phoneNumber varchar(30) null,
    address1 varchar(120) not null,
    address2 varchar(120) null,
    state varchar(8) not null,
    postcode varchar(8) not null,
    createdAt datetime not null,
    updatedAt datetime not null,
    deletedAt datetime null
);

