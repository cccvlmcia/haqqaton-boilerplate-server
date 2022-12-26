import "reflect-metadata";
import {DataSource, EntityManager} from "typeorm";
import config from "@config/ormconfig";
import {dbLogger as logger} from "@config/winston.config";
let _datasource: DataSource;

const {host, port, username, password, database, synchronize, logging, entities, extra, migrations} = config;

export const initDatasource = async () => {
  if (_datasource == null) {
    const datasource = new DataSource({type: "mariadb", host, port, username, password, database, synchronize, logging, entities, extra, migrations});
    try {
      logger.info("try to database connect... ");
      const startDate = new Date();
      _datasource = await datasource.initialize();
      const endDate = new Date();
      logger.info(`database connected! elapsed time ${endDate.getTime() - startDate.getTime()}ms`);
    } catch (err: any) {
      logger.error(err);
      throw new Error(err);
    }
  }
  return _datasource;
};

export const txProcess = async (callback: (manager: EntityManager) => Promise<any>) => {
  const queryRunner = _datasource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const manager: EntityManager = queryRunner.manager;
    const result: any = await callback(manager);
    await queryRunner.commitTransaction();
    return result;
  } catch (err: any) {
    await queryRunner.rollbackTransaction();
    throw Error(err);
  } finally {
    await queryRunner.release();
  }
};
export function getManager(): EntityManager {
  return _datasource.createQueryRunner().manager;
}
