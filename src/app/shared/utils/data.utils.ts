import { SimpleChange } from '@angular/core';

export const isNewChange = (prop: SimpleChange) => {
    return prop.currentValue !== prop.previousValue;
};

export const toPayload = (action: any) => action.payload;

export function execCb(callback, ...params) {
    if (callback && typeof callback === 'function') {
        if (params) {
            callback.apply(null, params);
        } else {
            callback();
        }
    }
}
