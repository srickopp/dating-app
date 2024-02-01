
## Features
This a simple datting app service that has highlighted feature:
- Register & Login
- Get user profile
- Get random profile
- Swipe to Like / Pass
- Getting Match
- Buy Premium Features

Premium Features:
- Unlimited Swipe
- Get `verified` random profile


## Tech Stack

**Server:** Node, NestJS

**Database:** PostgreSQL


## Run Locally

Clone the project

Go to the project directory

```bash
  cd dating-app
```

Install dependencies

```bash
  npm install
```

Setup environment File
- Copy the .env-example to .env
- Adjust the value

Run Migration File

```bash
  npm run typeorm:migration:run
```


Add Seeder
```bash
  npm run data:seeder
```

Run the service
```bash
  npm run start:dev
```

## Documentation

- Postman collections are inside (`docs`)
- Swagger API Documentations at: `localhost:3000/documentation`