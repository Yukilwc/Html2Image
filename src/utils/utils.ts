/*
 * @Descripttion: 工具类库
 * @version: 
 * @Author: falost
 * @Date: 2019-08-27 14:10:16
 * @LastEditors: falost
 * @LastEditTime: 2019-08-27 14:15:52
 */
import fs from 'fs'
import path from 'path'

const mkdirsSync = (dirname) => {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}
const formatNumber = function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

export {
    mkdirsSync,
    formatNumber
}