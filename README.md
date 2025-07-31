## Project setup

use the `docker-compose.yml` file to spin the necessary dependancies. using the following command:
```bash
docker compose up -d
```

You will also have to create the .env file from the sample one
```bash
cp .env.sample .env
```


And then install the project dependancies as following
```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run the Seeder script.

Make sure the variable `IS_SETUP` and is equal to true. Then you can cal the API endpoint :

```
POST /api/catalogue/seed
```

This should setup the seed data in the database.