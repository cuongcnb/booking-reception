import { DexieDb } from './../database/dexieDbContext';
import Dexie from 'dexie';
import * as R from 'ramda';
import { OfflineStates } from '@core/common/bunchOfEnum';

export class BaseService<T, K> {
    constructor(public db: DexieDb, public tableName: string) {
    }

    public getAll(): Dexie.Collection<T, K> {
        return this.db.context.table<T, K>(this.tableName).toCollection();
    }

    public getAllBy(index: string): Dexie.WhereClause<T, K> {
        return this.db.context.table<T, K>(this.tableName).where(index);
    }

    public getItem(primaryKey: K): Dexie.Promise<T> {
        return this.db.context.table<T, K>(this.tableName).get(primaryKey);
    }

    /**
     * @desc: filter function
     * @param: {filter} filter function must is boolean function
     * @returns: {FilterQuery<T>} indexDB filter query
     */
    public filter(filter: (entity: T) => boolean): Dexie.Collection<T, K> {
        return this.db.context.table(this.tableName).filter(filter);
    }

    /**
     * @desc: Add item of current model
     * @param: {entity<T>} entity need added
     * @returns: {Promise<T>} Promise with added entity
     */
    public async addAsync(entity: T): Promise<T> {
        if (!(entity as any).Id) {
            const key = await this.db.generateLocalKey(this.tableName);
            (entity as any).Id = key;
        }
        return await this.db.context.table(this.tableName).add(entity);
    }

    /**
     * @description Add an entity without generate unique id
     * @param entity entity will be add
     */
    public async addNoIdAsync(entity: T): Promise<T> {
        return await this.db.context.table(this.tableName).add(entity);
    }

    /**
     * @desc: Update item of current model
     * @param: {entity<T>} entity need update
     * @returns: {Promise<T>} Promise with updated entity
     */
    public async updateAsync(entity: T): Promise<T> {
        return await this.db.context.table(this.tableName).put(entity);
    }

    /**
     * @desc: Delete item of current model
     * @param: {entity<T>} entity need remove
     * @returns: {Promise<T>} promise
     */
    public async deleteAsync(key: K) {
        return await this.db.context.table(this.tableName).delete(key);
    }

    /**
     * @desc: Get local modified record
     * @returns: {Promise<Array<T>>} promise with array modified items
     */
    public async getLocallyModified(getAll?: boolean): Promise<Array<T>> {
        let added = await this.getAll()
            .filter((entity: any) => entity.Id < 0 && entity.offlineState !== OfflineStates.Backup)
            .toArray();

        added = added ? added : new Array<T>();

        const modified = await this.getAllBy('offlineState')
            .equals(OfflineStates.Modified)
            .filter((entity: T) => (entity as any).Id > 0)
            .toArray();

        if (modified) {
            added = R.union(added as any, modified as any);
        }

        return added
    }

    public async bulkPut(entities: T[], keys?: any[]) {
        return await this.db.context.table(this.tableName).bulkPut(entities, keys);
    }

    /**
     * @desc: Get local removed record
     * @returns: {Promise<Array<T>>} promise with array removed items
     */
    public getLocallyRemoved = (): Dexie.Promise<Array<T>> => {
        return this.getAllBy('offlineState').equals(OfflineStates.Removed).toArray();
    }
}
