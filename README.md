# Pharmacy App

Simple application using Pharmacies, Doctors, Users and Prescriptions to show how a REST and GraphQL API Layer might look

## Models

Represent the DB models

## DAOs

Provide Data Access, in our case to the Database. In general, DAO Layer would also be responsible for external integrations, for example to 
Stripe or similar.

DAO layer also manages any paging / sorting as required and allowed by downstream Systems.

## Services

Service layer is processing requests by clients, accessing DAO layer and implementing relevant Business Logic

## Controllers

Controllers represent the REST End Points, provide simple validation and prepare data for the Service Layer

## Resolvers / QL Fields

Provide Resolver logic and return data via Fields

# How to execute?

### install dependencies
yarn install

### create a production build
yarn build


### start the application
yarn start

### watch for file changes (only for development mode)
yarn watch


