# Architeture overview for the backend.

This backend is written with NestJS as the base framework. The choice is because it gives a very good base of work for a project that is set to grow, and ecommerce applications are that type of application that quickly need to grow and be structured in a way that let developer identify all his components.

## Application Modules

This backend has severy module that can be separated in 2 categories, **business** related modules and foundation module, the former will handle all the logic of the app and the later will simple handle everything else (configuration, auth, db, etc).

## Foundation Modules

### Common
This module is responsible of handling shared conf item, enums, interceptors and filters Component present here. The database configuration is made in this module as well.

### Auth
This module will take care of authentication endpoint, permissions and roles. It has the necessary entities to handle the authentication processes.

## Business logic module

- `cart`: customers and visitor cart handling
- `catalogue`: this module handle everything related to the product and their categories.
- `Orders`: handles everything about the orders
- `Users`:  this module manage the user, their status and lifecycle

The `AppModule` is the project entry point which load all the other one.

The database entityes are spreaded across all the application as each module is responsible of a set of business logic.

### Data flow and restrictions:

Within the modules we have many components (controller, repository, entities, DTOs, etc). Each business logic stay within a service inside a module. here are the rules for data flow and business logic implementation:

- A Business logic is always wrapped in a services
- A module SHOULD NEVER interact with entities that are not from his domain directly
- A module that need to interact with entities from a different module sould import the service from that module and call a dedicated method from there.
- A controller should never interact with an Entity or a repository.

These rules are necessary to write decoupled and testable code.

### Global implementations and utils.

The commong module has a set of components that are registered at the global scope, these are the following items and their goals:

- Interceptors:
    - `LoggingInterceptor` this is responsible of writting request logs in the console
- Filters:
    - `AllExceptionsFilter`: Catch all the exception and wrap them around a proper and standard structure (for exemple a DB error)
    - `HttpExceptionFilter`: Catch HTTP related exception and wrap them arround a proper strucutre (for exemple a validation issue)
- PIPE
    - `Custom validation pipe`: this make data validatio mandatory so all the `@body()` will follow their structure schema
- DTOs: these are used in many other modules
- Enums: used in many other module as well
- Entities: these are abstract entities meant to be used in all other entities across the app.
- Constants: this represent all the constants used acorss the repository.


## Database choices

### DB engine: PostgreSQL
I choosed PostgreSQL, because it's a mature db engine that can support multiple connection and has a good support for complex data type such as the JSON, it also support FTD (full text search) which is very iimportant for e-commerce systems. It also a better constraint checking system that MySQL as well. It provide a wide set of tools for easy extension when needed (CTE, function, custom data type.)

### DB ORM: TypeORM

Nest JS has a native support for this ORM. It's also a very good and mature ORM compared to prisma for example. It does what it does well without too much noise on internet and bells & whitsle like Prisma. There is no additional "binary" to be installed for converting expression to SQL queries. The data definition (entities) are written in one language (typescript), the ORM is very typesafe.