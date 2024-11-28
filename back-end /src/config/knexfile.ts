
import path from 'path';
import { Knex } from 'knex';
import * as dotenv from 'dotenv';

dotenv.config();

const config: Knex.Config = {
  client: 'pg',
  connection: process.env.DATABASE_URL || {
    host: 'localhost',
    user: 'jveiga',
    password: 'guilherme',
    database: 'shopper',
  },
  migrations: {
    directory: path.resolve(__dirname, '../database/migrations'),  // Caminho para as migrações
  },
  seeds: {
    directory: path.resolve(__dirname, '../database/seeds'),  // Caminho para os seeds
  },
};

export default config

/*

Cria Banco de Dados 
npx ts-node -r tsconfig-paths/register node_modules/.bin/knex migrate:latest --knexfile ./src/config/knexfile.ts

Popula Banco de Dados
npx ts-node -r tsconfig-paths/register node_modules/.bin/knex seed:run --knexfile ./src/config/knexfile.ts

*/