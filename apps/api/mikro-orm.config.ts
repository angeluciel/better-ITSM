import { defineConfig } from '@mikro-orm/postgresql';

export default defineConfig({
  clientUrl:
    process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/better_itsm',
  entities: ['./dist/modules/**/entities/*.js'],
  entitiesTs: ['./src/modules/**/entities/*.ts'],
  migrations: {
    path: './src/migrations',
    pathTs: './src/migrations',
  },
  schema: 'app',
});
