# SvelteKit

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
pnpm create svelte@latest

# create a new project in my-app
pnpm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `pnpm install` or `yarn`, start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

# Prisma

1. Install prisma dependencies:

    pnpm install @prisma/client
    pnpm install prisma -D

2. Run `pnpm exec prisma init` to initialise prisma project.

3. Set the `DATABASE_URL` in the `.env` file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started

4. Set the `provider` of the `datasource` block in `schema.prisma` to match your database: `postgresql`, `mysql`, `sqlite`, `sqlserver`, `mongodb` or `cockroachdb`.

5. Create your schema in `schema.prisma`.

6. Run `pnpm exec prisma migrate dev` to migrate your schema.

More information in our documentation:
https://pris.ly/d/getting-started

## Prisma seeding

1. Create a new file named `seed.js`. This can be placed anywhere within your projects folder structure. Suggested in the `/prisma` folder.

2. In the `seed.js` file, import Prisma Client, initialize it and create some records.

3. Add the `prisma.seed` to your `package.json` file.

4. Run `pnpm exec prisma db seed` to seed the database.

More information in our documentation:
https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding#seeding-your-database-with-typescript-or-javascript