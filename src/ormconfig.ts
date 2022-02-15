import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

let config: PostgresConnectionOptions 

if(process.env.NODE_ENV == "production"){
  config = {
    type:'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true,
    entities: ['dist/**/*.entity{.ts,.js}'],
  };
}else{
  config = {
    type:'postgres',
    port: 5432,
    database: 'ytdl',
    username: 'postgres',
    password: '123456',
    synchronize: true,
    entities: ['dist/**/*.entity{.ts,.js}'],
  };
}


export default config