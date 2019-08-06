///////////////////////////////////////////////////////////////////////////////////////////////////
// THIS IS OPEN SCHEMA, IE. NO AUTHENTICATION REQUIRED SO BE EXTRA CAREFUL AS TO WHAT GOES IN HERE
// AS API CLIENTS CAN QUERY EVERYTING DEFINED BELOW
///////////////////////////////////////////////////////////////////////////////////////////////////

export const OpenSchemaDef = `

#################################
### COURIER
#################################

# You can use ID! for Primary Key fields
type Courier {
    id: Int!
    businessName: String!
    contactName: String!
    phoneNumber: String
    address1: String!
    address2: String
    state: String!
    postcode: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    deletedAt: DateTime
}

input CourierFilter {
    id: Int!
    businessName: String!
    contactName: String!
    phoneNumber: String
    address1: String!
    address2: String
    state: String!
    postcode: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    deletedAt: DateTime
}

input CourierInput {
    id: Int!
    businessName: String!
    contactName: String!
    phoneNumber: String
    address1: String!
    address2: String
    state: String!
    postcode: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    deletedAt: DateTime
}

type CouriersPaged implements IApiPagedResponse {
  totalRecords: Int
  page: Int
  pageSize: Int
  totalPages: Int
  rows: [Courier]
}

#################################
### DOCTOR
#################################

# You can use ID! for Primary Key fields
type Doctor {
    id: Int!
    firstName: String!
    lastName: String!
    phoneNumber: String!
    licenseNo: String!
    licenseExpiry: Date!
    practiceType: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    deletedAt: DateTime
}

input DoctorFilter {
    id: Int!
    firstName: String!
    lastName: String!
    phoneNumber: String!
    licenseNo: String!
    licenseExpiry: Date!
    practiceType: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    deletedAt: DateTime
}

input DoctorInput {
    id: Int!
    firstName: String!
    lastName: String!
    phoneNumber: String!
    licenseNo: String!
    licenseExpiry: Date!
    practiceType: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    deletedAt: DateTime
}

type DoctorsPaged implements IApiPagedResponse {
  totalRecords: Int
  page: Int
  pageSize: Int
  totalPages: Int
  rows: [Doctor]
}

#################################
### DRUGSTORE
#################################

# You can use ID! for Primary Key fields
type Drugstore {
    id: Int!
    businessName: String!
    contactName: String
    phoneNumber: String
    address1: String!
    address2: String
    state: String!
    postcode: String!
    hoursOpening: String!
    hoursClosing: String!
    updatedAt: DateTime!
    createdAt: DateTime!
    deletedAt: DateTime
}

input DrugstoreFilter {
    id: Int!
    businessName: String!
    contactName: String
    phoneNumber: String
    address1: String!
    address2: String
    state: String!
    postcode: String!
    hoursOpening: String!
    hoursClosing: String!
    updatedAt: DateTime!
    createdAt: DateTime!
    deletedAt: DateTime
}

input DrugstoreInput {
    id: Int!
    businessName: String!
    contactName: String
    phoneNumber: String
    address1: String!
    address2: String
    state: String!
    postcode: String!
    hoursOpening: String!
    hoursClosing: String!
    updatedAt: DateTime!
    createdAt: DateTime!
    deletedAt: DateTime
}

type DrugstoresPaged implements IApiPagedResponse {
  totalRecords: Int
  page: Int
  pageSize: Int
  totalPages: Int
  rows: [Drugstore]
}

#################################
### PRESCRIPTION
#################################

# You can use ID! for Primary Key fields
type Prescription {
    id: Int!
    IssuingDoctorId: Int!
    IssuedToUserId: Int!
    ProvidedByDrugstoreId: Int
    ProvidedAt: DateTime
    DeliveredByCourierId: Int!
    DeliveredAt: DateTime
    expiryDate: Date
    notes: String
    createdAt: DateTime!
    deletedAt: DateTime
    updatedAt: DateTime!
}

input PrescriptionFilter {
    id: Int!
    IssuingDoctorId: Int!
    IssuedToUserId: Int!
    ProvidedByDrugstoreId: Int
    ProvidedAt: DateTime
    DeliveredByCourierId: Int!
    DeliveredAt: DateTime
    expiryDate: Date
    notes: String
    createdAt: DateTime!
    deletedAt: DateTime
    updatedAt: DateTime!
}

input PrescriptionInput {
    id: Int!
    IssuingDoctorId: Int!
    IssuedToUserId: Int!
    ProvidedByDrugstoreId: Int
    ProvidedAt: DateTime
    DeliveredByCourierId: Int!
    DeliveredAt: DateTime
    expiryDate: Date
    notes: String
    createdAt: DateTime!
    deletedAt: DateTime
    updatedAt: DateTime!
}

type PrescriptionsPaged implements IApiPagedResponse {
  totalRecords: Int
  page: Int
  pageSize: Int
  totalPages: Int
  rows: [Prescription]
}

#################################
### PRESCRIPTION ITEM
#################################

# You can use ID! for Primary Key fields
type PrescriptionItem {
    id: Int!
    code: String!
    name: String!
    createdAt: DateTime
    updatedAt: DateTime!
    deletedAt: DateTime
}

input PrescriptionItemFilter {
    id: Int!
    code: String!
    name: String!
    createdAt: DateTime
    updatedAt: DateTime!
    deletedAt: DateTime
}

input PrescriptionItemInput {
    id: Int!
    code: String!
    name: String!
    createdAt: DateTime
    updatedAt: DateTime!
    deletedAt: DateTime
}

type PrescriptionItemsPaged implements IApiPagedResponse {
  totalRecords: Int
  page: Int
  pageSize: Int
  totalPages: Int
  rows: [PrescriptionItem]
}

#################################
### USER
#################################

# You can use ID! for Primary Key fields
type User {
    id: Int!
    email: String!
    firstName: String!
    lastName: String!
    phoneNumber: String
    address1: String!
    address2: String
    state: String!
    postcode: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    deletedAt: DateTime
}

input UserFilter {
    id: Int!
    email: String!
    firstName: String!
    lastName: String!
    phoneNumber: String
    address1: String!
    address2: String
    state: String!
    postcode: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    deletedAt: DateTime
}

input UserInput {
    id: Int!
    email: String!
    firstName: String!
    lastName: String!
    phoneNumber: String
    address1: String!
    address2: String
    state: String!
    postcode: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    deletedAt: DateTime
}

type UsersPaged implements IApiPagedResponse {
  totalRecords: Int
  page: Int
  pageSize: Int
  totalPages: Int
  rows: [User]
}

#################################
### QUERY SPEC
#################################

type Query {
  
  GetCourier(id: ID!): Courier
  ListCouriers(page: Int, pageSize: Int, sort: [String], sortDir: [String], filter: CourierFilter): CouriersPaged
  
  GetDoctor(id: ID!): Doctor
  ListDoctors(page: Int, pageSize: Int, sort: [String], sortDir: [String], filter: DoctorFilter): DoctorsPaged
  
  GetDrugstore(id: ID!): Drugstore
  ListDrugstores(page: Int, pageSize: Int, sort: [String], sortDir: [String], filter: DrugstoreFilter): DrugstoresPaged
  
  GetPrescriptionItem(id: ID!): PrescriptionItem
  ListPrescriptionItems(page: Int, pageSize: Int, sort: [String], sortDir: [String], filter: PrescriptionItemFilter): PrescriptionItemsPaged
  
  GetPrescription(id: ID!): Prescription
  ListPrescriptions(page: Int, pageSize: Int, sort: [String], sortDir: [String], filter: PrescriptionFilter): PrescriptionsPaged
  
  GetUser(id: ID!): User
  ListUsers(page: Int, pageSize: Int, sort: [String], sortDir: [String], filter: UserFilter): UsersPaged
  
}

type mutation {

  CreateOrSaveCourier(courier: CourierInput): Courier
  
  CreateOrSaveDoctor(doctor: DoctorInput): Doctor
  
  CreateOrSaveDrugstore(drugstore: DrugstoreInput): Drugstore
  
  CreateOrSavePrescription(prescription: PrescriptionInput): Prescription
  
  CreateOrSavePrescriptionItem(prescriptionItem: PrescriptionItemInput): PrescriptionItem
  
  CreateOrSaveUser(user: UserInput): User
}

`;
