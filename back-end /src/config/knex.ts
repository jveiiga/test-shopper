import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();  // Carrega as variáveis do arquivo .env

const db = knex({
    client: 'pg', // Definindo o cliente como PostgreSQL (use 'mysql' ou outro conforme necessário)
    connection: process.env.DATABASE_URL || {
      host: 'localhost',
      user: 'jveiga',
      password: 'guilherme',
      database: 'shopper',
    },
    migrations: {
      directory: './src/database/migrations', // Caminho para as migrações
    },
    seeds: {
      directory: './src/database/seeds', // Caminho para os seeds
    },
  });

export default db;