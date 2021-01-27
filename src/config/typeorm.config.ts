import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
function getDB(string: string): any {
  return config.get(string);
}
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: process.env.DB_TYPE || getDB('db.type'),
  host: process.env.DB_HOST || getDB('db.host'),
  port: process.env.DB_PORT || getDB('db.port'),
  username: process.env.DB_USERNAME || getDB('db.username'),
  password: process.env.DB_PASSWORD || getDB('db.password'),
  database: process.env.DB_NAME || getDB('db.name'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.DB_SYNC || getDB('db.synchronize'),
};
