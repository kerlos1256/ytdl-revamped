import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const config: PostgresConnectionOptions = {
  type:'postgres',
  url: process.env.DATABASE_URL,
  // port: 5432,
  // database: 'ytdl',
  // username: 'postgres',
  // password: '123456',
  synchronize: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
};
