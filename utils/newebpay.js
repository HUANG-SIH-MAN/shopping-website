if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
const crypto = require('crypto')

//藍新金流參數設定
const URL = process.env.URL
const MerchantID =  process.env.MerchantID
const HashKey = process.env.HashKey
const HashIV = process.env.HashIV
//藍新測試用API表單回傳網址
const mpg_gateway ='https://ccore.newebpay.com/MPG/mpg_gateway' 
//交易後回傳網址
const ReturnURL = URL + '/order/mpgateway/callback?from=ReturnURL'
const NotifyURL = URL + '/order/mpgateway/callback?from=NotifyURL'
const ClientBackURL = URL + '/cart'


//將交易資料串接成字串
//(EX:MerchantID=155480&RespondType=JSON&...)
function genDataChain(data) {
    let results = []
    for (let kv of Object.entries(data)) {
      results.push(`${kv[0]}=${kv[1]}`)
    }
    return results.join('&')
}

//將交易資料進行AES加密
function encryptTradeInfoAES (TradeInfo) {
    const encrypt = crypto.createCipheriv('aes256', HashKey, HashIV)
    let enc = encrypt.update(genDataChain(TradeInfo), "utf8", "hex");
    return enc + encrypt.final("hex");
}

//將交易資料進行SHA加密
function encryptTradeShaAES(TradeInfo) {
    let sha = crypto.createHash("sha256")
    let plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`
    return sha.update(plainText).digest("hex").toUpperCase()
}

const newebpay = {
    getTradeInfo: (amount, email, MerchantOrderNo) => {
        const data = {
            MerchantID,
            RespondType: 'JSON',
            TimeStamp: Math.floor(Date.now()/1000),
            Version: '2.0',
            MerchantOrderNo,
            Amt: amount,
            ItemDesc: '生活日用雜貨',
            Email: email,
            LoginType: 0,
            CREDIT: 1,
            ReturnURL,
            NotifyURL,
            ClientBackURL
        }
        const result = {
            mpg_gateway,
            MerchantID,
            TradeInfo : encryptTradeInfoAES (data),
            TradeSha: encryptTradeShaAES(encryptTradeInfoAES(data)),
            Version: '2.0'
        }
        return result
    },
    //回傳交易資料解密
    decryptTradeInfoAES: (TradeInfo) => {
        let decrypt = crypto.createDecipheriv("aes256", HashKey, HashIV);
        decrypt.setAutoPadding(false);
        let text = decrypt.update(TradeInfo, "hex", "utf8");
        let plainText = text + decrypt.final("utf8");
        let result = plainText.replace(/[\x00-\x20]+/g, "");
        return result;
    }
}

module.exports = newebpay