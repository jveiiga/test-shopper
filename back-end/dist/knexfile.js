"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var config = {
    client: 'pg',
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
};
exports.default = config;
