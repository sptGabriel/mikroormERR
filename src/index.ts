import express from 'express';
import bodyParser from 'body-parser';
import options from './mikro.config';
import { populate } from './controller/populatedb';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { EntityManager, PostgreSqlDriver } from '@mikro-orm/postgresql';
export class ExpressServer {
  private server: express.Application;
  private connection: MikroORM<PostgreSqlDriver>;
  private em: EntityManager;
  constructor() {
    this.server = express();
  }
  public dbMikro = async () => {
    try {
      this.connection = await MikroORM.init(options);
      const migrator = await this.connection.getMigrator();
      const migrations = await migrator.getPendingMigrations();
      if (!(migrations && migrations.length > 0)) return;
      await migrator.up();
    } catch (error) {
      console.log(error);
    }
  };
  private initializeRouter = () => {
    this.server.get('/favico.ico', (req, res) => {
      res.sendStatus(404);
    });
    this.server.get('/', (req, res) => {
      res.send('Welcome');
    });
  };
  private initializeMiddlewares = () => {
    this.server.use(express.json());
    this.server.use(bodyParser.json());
    this.server.use((req, res, next) => {
      RequestContext.create(this.em, next);
    });
  };
  public getServer = () => {
    return this.server;
  };
  public start = async () => {
    await this.dbMikro();
    this.initializeMiddlewares();
    this.initializeRouter();
    await populate();
    this.server.listen(3000, () => {
      console.log('this server is ready on port 3000');
    });
  };
  public stop = (): void => {
    throw new Error('Method not implemented.');
  };
}

(async () => {
  const server = new ExpressServer();
  await server.start();
})();
