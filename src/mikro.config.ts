import dotenv, { DotenvConfigOutput } from 'dotenv';
import { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection/TsMorphMetadataProvider';
import path from 'path';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
// const configResult: DotenvConfigOutput = dotenv.config();
// if (configResult.error) {
//   throw configResult.error;
// }
// const rootDir = process.env.NODE_ENV === 'development' ? 'src' : 'build/src';
// const extension = process.env.NODE_ENV === 'development' ? 'ts' : 'js';
export default {
  metadataProvider: TsMorphMetadataProvider,
  type: 'postgresql',
  dbName: 'emasa_ti',
  debug: true,
  entities: ['src/entities/*.entity.{js,ts}'],
  host: 'localhost',
  migrations: {
    path: 'src/migrations', // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
    tableName: 'migrationsHistory',
    emit: 'ts',
    transactional: true,
  },
  password: 'emasa03210',
  port: 5432,
  tsNode: true,
  user: 'emasa',
} as Options<PostgreSqlDriver>;
