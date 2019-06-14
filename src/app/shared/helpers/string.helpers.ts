export namespace StringHelpers {
    const SNAKE_CASE_REGEXP = /[A-Z]/g;

    /**
     * @author: cuongtl
     * @desc: Create Random UuId Code
     * @return: Uuid code: string
     */
    export function generateUUID(): string {
        return (new Date).getTime().toString() + (Math.round(Math.random() * 100)).toString();
    }

    export function gettext(text: string): string {
        return text;
    }

    /**
     * @author: cuongtl
     * @desc: nomalizeString
     * @return: string nomalize : string
     */
    export function nomalizeString(obj: string, length?: number, isLowerCase?: boolean): string {
        let str;

        str = obj || '';
        if (length && length > 0) {
            str = str.substring(0, length);
        }
        if (isLowerCase) {
            str = str.toLowerCase();
        } else {
            str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|À|Á|Ặ|Ả|Ã/g, 'a');
            str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'e');
            str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'i');
            str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'o');
            str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'u');
            str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'y');
            str = str.replace(/Đ/g, 'd');
        }
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        str = str.replace(/^\-+|\-+$/g, '');

        return str;
    }

    /**
     * @author thuctd
     * @description kiểm tra chuỗi str1 có là con của str2 không sau khi đã nomalize, không phân biệt chữ hoa, chữ thường, bỏ qua kí tự khoảng trắng ở đầu và cuối chuỗi.
     */
    export function isSubStringNomalize(str1: string, str2: string) {
        const _str1 = StringHelpers.nomalizeString(str1 || '', null, true).trim();
        const _str2 = StringHelpers.nomalizeString(str2 || '', null, true).trim();
        return _str2.indexOf(_str1) >= 0;
    }

    export function snakeCase(name) {
        const separator = '-';
        return name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
            return (pos ? separator : '') + letter.toLowerCase();
        });
    }

    /**
     * @author: cuongtl
     * @desc: split words
     * @return Array String split
     */
    export function splitWords(text: string) {
        const allWordsIncludingDups = text.split(' ');
        const wordSet = allWordsIncludingDups.reduce(function (prev: any, current: any) {
            prev[current] = true;
            return prev;
        }, {});
        return Object.keys(wordSet);
    }

    export function isNullOrEmpty(text: string) {
        return !text || text.length === 0;
    }
}
