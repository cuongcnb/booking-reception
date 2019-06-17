import { localStorageKey } from '../../app.constants';
import { StringHelpers } from './string.helpers';

export class KvHelper {
    static host: string;

    static execCb(callback, ...params) {
        if (callback && typeof callback === 'function') {
            if (params) {
                callback.apply(null, params);
            } else {
                callback();
            }
        }
    }

    static generateUUID(): string {
        return (new Date).getTime().toString() + (Math.round(Math.random() * 100)).toString() + (Math.round(Math.random() * 100)).toString();
    }

    static getMessage(err) {
        try {
            if (err && err.status === 403) {
                return 'Bạn không có quyền thực hiện chức năng này.';
            }

            if (err.json) { // type is Response
                err = err.json();
            }

            if (err && err.ResponseStatus) {
                return (err.ResponseStatus.Message);
            } else if (err && err.data && typeof (err.data) === 'string') {
                return (err.data);
            } else if (err && err.message) {
                return err.message;
            } else {
                return '';
            }
        } catch (error) {
            console.log(error);
            return '';
        }
    }

    static getRetailerCode(): string {
        const retailerCode = localStorage[localStorageKey.retailer];
        return retailerCode || '';
    }

    static splitAttributes(name, fullName): string {
        if (!name || !fullName) {
             return '';
        }
        let attributes = fullName.substr(name.length);
        attributes = attributes.replace(/\s*(\(.+\))?\s*$/i, '');
        attributes = attributes.replace(/^(\s|-)+/i, '');
        attributes = attributes.replace(/(\s|-)+$/i, '');
        attributes = attributes.replace(/\s*-\s*/g, ' - ');
        return attributes;
    }

    static getHost(): string {
        if (!this.host) {
            const protocol = location.protocol;
            const slashes = protocol.concat('//');
            this.host = slashes.concat(window.location.host);
        }
        return this.host;
    }

    static executeSerially(inputTasks, func, onDone) {
        const tasks = inputTasks.slice();
        const runNext = () => {
            if (tasks.length > 0) {
                let j = tasks.shift();
                if (func && typeof (func) === 'function') {
                    func.call(null, j, runNext);
                } else {
                    j.call(null, runNext);
                }
            } else {
                KvHelper.execCb(onDone);
            }
        };
        runNext();
    }

    /**
     * @description: suggestion payment money :V
     * @author: cuongtl
     * @param amount currency payment
     */
    static suggestMoneyPayment(amount: number) {
        let result: number[] = [amount];
        const menhGia = [500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000];
        const min = amount;
        const max = amount + 500000;

        for (let i = min + 500; i <= max; i += 500) {
            for (let j = 0; j < menhGia.length; j++) {
                const tien = menhGia[j];

                if (i - tien < amount) {
                    result.push(i);
                    break;
                }
            }
        }

        return result;
    }

    /**
     * Compare time a and b
     * 0: if a === b
     * 1: if a > b
     * -1: if a < b
     * @param a date a
     * @param b date b
     */
    static perfectCompareDateTime(a: Date, b: Date) {
        const dateA = new Date(a);
        const dateB = new Date(b);
        const subtraction = dateA.getTime() - dateB.getTime();

        if (isNaN(subtraction)) {
            if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) {
                return 0;
            } else if (isNaN(dateA.getTime())) {
                return -1;
            } else {
                return 1;
            }
        }

        // Why compare number is 2
        // Because we compare without diffrent <= 100ms
        return Math.abs(subtraction) < 2 ? 0 : subtraction < 0 ? -1 : 1;
    }

    static validateUrl(retailer: string) {
        const pathName = document.location.pathname;
        const hostName = document.location.host;

        if (pathName && pathName.length > 0 &&
            (hostName && hostName.length > 0 &&
            hostName.indexOf('localhost') === -1) &&
            (pathName.toLowerCase().indexOf(`/${retailer.toLowerCase()}/`) === -1)) {
            return false;
        }

        return true;
    }

    static  getParameterByName(name: any) {
        let url = window.location.href;
        name = name.replace(/[[]]/g, '\$&');
        let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return '';
        }
        return decodeURIComponent(results[2].replace(/ +/g, ' '));
    }

    static gettext(text) {
        return StringHelpers.gettext(text);
    }
}

(<any>(window)).KvHelpers = KvHelper;
(<any>(window)).gettext = KvHelper.gettext;