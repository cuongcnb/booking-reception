import { select, Store } from '@ngrx/store';
import { Injectable, Injector } from '@angular/core';
import Dexie from 'dexie';
import { AppStates } from '@store/reducers';
import { execCb } from '@utils/data.utils';
import { getSession } from '@store/session/session.selectors';
import { distinctUntilChanged } from 'rxjs/internal/operators';

@Injectable()
export class DexieDb {
    private _context: Dexie
    set context(ct: Dexie) {
        this._context = ct;
    }

    get context(): Dexie {
        return this._context;
    };

    schema: any;
    public cascade: {
        Customers: [
            { name: 'Orders', property: 'CustomerId' },
            { name: 'Invoices', property: 'CustomerId' },
            { name: 'Returns', property: 'CustomerId' }
            ],
        PartnerDeliveries: [
            { name: 'Invoices', property: 'DeliveryDetail.DeliveryBy' },
            { name: 'Orders', property: 'DeliveryDetail.DeliveryBy' }
            ],
        Orders: { name: 'Invoices', property: 'OrderId' },
        PriceBooks: { name: 'PriceBookItems', property: 'PriceBookId' },
        Returns: { name: 'Invoices', property: 'ReturnId' }
    };

    constructor(private store: Store<AppStates>,
                private injector: Injector) {
        this.store.pipe(
            select(getSession),
            distinctUntilChanged((x, y) => (x ? x.BearerToken : '') === (y ? y.BearerToken : ''))
        )
            .subscribe(session => {
                if (session) {
                    if (this.context && this.context.isOpen()) {
                        if (session.Retailer &&
                            ((this.context && session.Retailer.Code.toLowerCase() !== this.context.name.replace('kiotviet-', '')) ||
                                (!this.context || !this.context.isOpen()))) {
                            this.context.close();
                            this.openDb(`kiotviet-${session.Retailer.Code.toLowerCase()}`);
                        }
                    } else {
                        this.openDb(`kiotviet-${session.Retailer.Code.toLowerCase()}`);
                    }
                } else {
                    if (this.context && this.context.isOpen()) {
                        this.context.close();
                    }
                }
            });

        if (!this.context || !this.context.isOpen()) {
            this.openDb(`booking`);
        }
    }

    public openDb(dbName: string) {
        this.context = new Dexie(dbName || 'kiotviet');
        // Schema define
        this.context.version(1).stores({
            Orders: 'Id, offlineState, CustomerId, PurchaseDate, TableId',
            Products: 'Id, CategoryId, MasterUnitId, Code, Name, NormalizedCode',
            Categories: 'Id',
            Customers: 'Id, offlineState, NormalizedCode, ContactNumber',
            Users: 'Id',
            Surcharges: 'Id',
            Invoices: 'Id, OrderId, CustomerId, offlineState, TableId, ReturnId',
            PriceBooks: 'Id',
            PriceBookItems: 'Id, ProductId, PriceBookId',
            Returns: 'Id, CustomerId, offlineState',
            Attributes: 'Id',
            ProductAttributes: '++Id, ProductId, AttributeId',
            ProductSerials: '++Id, ProductId, SerialNumber',
            BankAccounts: 'Id',
            Tables: 'Id',
            TableGroups: 'Id',
            CustomerGroups: 'Id',
            PartnerDeliveryGroups: 'Id',
            PartnerDeliveries: 'Id, offlineState, NormalizedCode, ContactNumber',
            Locations: 'Id',
            Wards: 'Id, ParentId'
        });

        // Upgrade db
        this.context.version(2).stores({
            Cache: 'Key'
        });

        // Upgrade db for audit
        this.context.version(3).stores({
            Audit: '++id, Function, Action'
        });

        this.context.version(4).stores({
            Campaigns: 'Id',
            SalePromotions: 'Id'
        });

        if (!this.context.isOpen()) {
            this.context.open().then((a) => {
                console.log('Dexie Open IDb Successed');
            })
                .catch((err) => {
                    console.log('Dexie Open IDb Failed: ' + err);
                });
        }

        window.addEventListener('unhandledrejection', (error: any) => {
            event.preventDefault();
            switch (error.reason.name) {
                case Dexie.errnames.Abort:
                    this.checkQuotaExceeded();
                    break;
            }
            ;
        });
    }

    /**
     * @author: cuongtl
     * @desc: merge function
     * @param: {domain}
     * @param: {data}
     * @param: {_localDb}
     * @param: {callback}
     */
    public merge(tableName: string, data: any, callback: () => any) {
        // Why we must clean data before merge because IndexDB only save entity with property valued not is function
        // We will parse this to json and reparse to object for cleaner object
        data = JSON.parse(JSON.stringify(data));

        if (!data || data.length === 0) {
            if (callback) {
                callback();
            }
            return;
        }
        const Id = this.context.table(tableName).schema.primKey.keyPath as string;
        const handler = (exists) => {
            let toAdd, toUpdate;
            if (exists.length > 0) {

                toUpdate = [], toAdd = [];
                for (let i = 0; i < data.length; i++) {
                    const s = data[i][Id];
                    if (exists.binaryIndexOf(s) >= 0) {
                        toUpdate.push(data[i]);
                    } else {
                        toAdd.push(data[i]);
                    }
                }
                console.log('to update = ' + toUpdate.length);
            } else {
                toAdd = data;
            }

            // batch update
            const addAll = () => {
                // batch insert
                if (!toAdd || toAdd.length === 0) {
                    execCb(callback);
                } else {
                    try {
                        this.context.table(tableName).bulkAdd(toAdd).finally(callback);
                    } catch (error) {
                        console.log(error);
                        execCb(callback);
                    }
                }
            };

            const updateAll = () => {
                if (toUpdate && toUpdate.length > 0) {
                    try {
                        this.context.table(tableName).bulkPut(toUpdate).finally(addAll);
                    } catch (error) {
                        console.log(error);
                        execCb(addAll);
                    }
                } else {
                    addAll();
                }
            };

            updateAll();
        };


        const allIds: any[] = data.map((r) => {
            return r[Id];
        });

        if (allIds && allIds.length > 0) {
            const idx = this.context.table(tableName).filter(f => f[Id] && allIds.indexOf(f[Id]) > -1).keys();
            idx.then(handler);
        } else {
            handler([]);
        }

    }

    public async generateLocalKey(table: string): Promise<number> {
        const result = await this.context.table(table).filter((f) => f.Id < 0).toArray();
        let key = -1;
        if (result && result.length > 0) {
            result.sort((a, b) => a.Id - b.Id);
            const r = result[0];
            key = r.Id ? (r.Id - 1) : (r - 1);
        }

        return key;
    }

    public getLocalCode(cartType) {
        // let prefix = '';
        // switch (cartType) {
        //     case CartType.Invoice:
        //         prefix = 'HDO';
        //         break;
        //     case CartType.Order:
        //         prefix = 'DHO';
        //         break;
        //     case CartType.Return:
        //         prefix = 'THO';
        //         break;
        // }
        //
        // return prefix + '' + (new Date().getTime());
    }

    /**
     * Clear all data in database
     */
    clearData = (): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            const allPromise = [];
            if (this.store && this._context && this._context.tables && this._context.tables.length > 0) {
                for (let i = 0; i < this._context.tables.length; i++) {
                    const table = this._context.tables[i];
                    if (table && table.name !== 'Invoices' && table.name !== 'Orders' && table.name !== 'Returns') {
                        allPromise.push(this.context.table(table.name).clear());
                    }
                }
            }

            Promise.all(allPromise)
                .then(() => {
                    resolve();
                })
                .catch((ex) => {
                    reject(ex);
                });
        });
    };

    private checkQuotaExceeded(): void {
        // (navigator as any).webkitTemporaryStorage.queryUsageAndQuota((usedBytes, grantedBytes) => {
        //     let template = this.translateService.instant('Bộ nhớ trống ổ C không đủ để hệ thống thực hiện tốt các tính năng trên màn hình bán hàng. Xin vui lòng xóa bớt dữ liệu không sử dụng và nhấn phím F5 để tiếp tục bán hàng');
        //     if (usedBytes === grantedBytes) {
        //         if ($('.modal-fulldisk').length <= 0) {
        //             this.modalService.openModal({
        //                 title: this.translateService.instant(`Cảnh báo`),
        //                 template: template,
        //                 onClose: () => {}
        //             }, {
        //                 backdrop: 'static',
        //                 class: 'modal-fulldisk'
        //             });
        //         }
        //     }
        // });
    }
}
