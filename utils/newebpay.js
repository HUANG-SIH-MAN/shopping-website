if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
const crypto = require('crypto')
const URL = process.env.URL
const MerchantID =  process.env.MerchantID
const HashKey = process.env.HashKey
const HashIV = process.env.HashIV
//藍新測試用API表單回傳網址
const mpg_gateway ='https://ccore.newebpay.com/MPG/mpg_gateway' 


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
    getTradeInfo: (amount, email) => {
        const data = {
            MerchantID,
            RespondType: 'JSON',
            TimeStamp: Math.floor(Date.now()/1000),
            Version: '2.0',
            MerchantOrderNo: Date.now(),
            Amt: amount,
            ItemDesc: '商品資訊',
            Email: email,
            LoginType: 0,
            CREDIT: 1
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

}

module.exports = newebpay