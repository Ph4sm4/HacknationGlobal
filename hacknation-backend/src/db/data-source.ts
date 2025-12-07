import * as dotenv from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	entities: [join(__dirname, 'entities', '**', '*.entity.{ts,js}')],
	migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
	synchronize: false,
	namingStrategy: new SnakeNamingStrategy()
});

// npm run typeorm migration:generate -- src/db/migrations/AddWSClientSocketId -d src/db/data-source.ts

// npx typeorm-ts-node-commonjs migration:revert -d src/db/data-source.ts
