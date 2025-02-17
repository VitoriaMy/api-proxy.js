import CryptoJS from 'crypto-js'

export function encryptData(data: any, secretKey: string = '') {
    const timeStamp = Date.now()
    const str = CryptoJS.AES.encrypt(JSON.stringify({
        data,
        timeStamp,
    }), `${secretKey}_${timeStamp.toString(36)}`).toString()
    return {
        data: str,
        timeStamp
    }
}

export function decryptData(encryptStr: string, timeStamp: number, secretKey: string = ''): {
    data: any,
    timeStamp: number,
} {
    const str = CryptoJS.AES.decrypt(encryptStr, `${secretKey}_${timeStamp.toString(36)}`).toString(CryptoJS.enc.Utf8);
    return JSON.parse(str || '{}')
}