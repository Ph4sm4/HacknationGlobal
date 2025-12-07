import {
  DeepPartial,
  EntityManager,
  EntityTarget,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  InsertResult,
  Repository,
  SaveOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';

export abstract class BaseRepository<T> {
  protected constructor(
    protected readonly entity: EntityTarget<T>,
    protected readonly repository: Repository<T>,
  ) {}

  async increment<K extends keyof T>(
    where: FindOptionsWhere<T>,
    property: K,
    value: number,
    manager?: EntityManager,
  ): Promise<void> {
    const repo = this.getRepo(manager);
    await repo.increment(where, property as string, value);
  }

  async decrement<K extends keyof T>(
    where: FindOptionsWhere<T>,
    property: K,
    value: number,
    manager?: EntityManager,
  ): Promise<void> {
    const repo = this.getRepo(manager);
    await repo.decrement(where, property as string, value);
  }

  async incrementMany(
    where: FindOptionsWhere<T>,
    increments: Partial<T>,
    manager?: EntityManager,
  ): Promise<void> {
    const repo = this.getRepo(manager);
    const qb = repo.createQueryBuilder().update();

    const setObj: Record<string, () => string> = {};
    for (const [field, value] of Object.entries(increments)) {
      if (value === undefined || value === null) continue;

      setObj[field] = () => `${field} + ${value}`;
    }

    qb.set(setObj).where(where);
    await qb.execute();
  }

  async findById(
    id: string,
    relations?: string[],
    manager?: EntityManager,
  ): Promise<T | null> {
    const repo = this.getRepo(manager);

    return await repo.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
      relations,
    });
  }

  async findByIds(
    ids: string[],
    relations?: string[],
    manager?: EntityManager,
  ): Promise<T[]> {
    const repo = this.getRepo(manager);

    return repo.find({
      where: { id: In(ids) } as unknown as FindOptionsWhere<T>,
      relations,
    });
  }

  async find(
    where?: FindOptionsWhere<T>,
    order?: FindOptionsOrder<T>,
    limit?: number,
    skip?: number,
    relations?: string[],
    manager?: EntityManager,
  ): Promise<T[]> {
    const repo = this.getRepo(manager);

    return repo.find({
      where,
      order,
      skip,
      take: limit,
      relations: relations,
    });
  }

  async findOne(
    where?: FindOptionsWhere<T>,
    relations?: string[],
    manager?: EntityManager,
  ): Promise<T> {
    const repo = this.getRepo(manager);

    return repo.findOne({
      where,
      relations: relations,
    });
  }

  async upsert(
    entity: QueryDeepPartialEntity<T> | DeepPartial<T>,
    manager?: EntityManager,
    options?: UpsertOptions<T> | SaveOptions,
  ): Promise<InsertResult | T> {
    const repo = this.getRepo(manager);

    return options
      ? repo.upsert(
          entity as QueryDeepPartialEntity<T>,
          options as UpsertOptions<T>,
        )
      : repo.save(entity as DeepPartial<T>, options as SaveOptions);
  }

  async save(entity: DeepPartial<T>, manager?: EntityManager): Promise<T> {
    const repo = this.getRepo(manager);

    const created = repo.create(entity);

    return repo.save(created);
  }

  async saveMany(
    entities: DeepPartial<T>[],
    manager?: EntityManager,
  ): Promise<T[]> {
    const repo = this.getRepo(manager);

    const created = repo.create(entities);

    return repo.save(created);
  }

  async update(
    id: string,
    data: QueryDeepPartialEntity<T>,
    manager?: EntityManager,
  ): Promise<T> {
    const repo = this.getRepo(manager);

    if ('updatedAt' in repo.metadata.propertiesMap) {
      (data as any).updatedAt = new Date();
    }

    await repo.update(id, data);

    return this.findById(id);
  }

  async delete(id: string, manager?: EntityManager): Promise<void> {
    const repo = this.getRepo(manager);

    await repo.delete(id);
  }

  async softDelete(id: string, manager?: EntityManager): Promise<void> {
    const repo = this.getRepo(manager);

    await repo.softDelete(id);
  }

  async deleteMany(ids: string[], manager?: EntityManager): Promise<void> {
    if (!ids.length) return;

    const repo = this.getRepo(manager);

    await repo.delete(ids);
  }

  protected getRepo(manager?: EntityManager): Repository<T> {
    return manager ? manager.getRepository(this.entity) : this.repository;
  }
}
