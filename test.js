const redis = require("redis")
var util = require('./date');

const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});

client.on('error', err => {
    console.log('Error ' + err);
});

var buff = Buffer.from("中文", 'utf-8').toString('base64')
console.log(buff)

var buff1 = Buffer.from("西瓜", 'utf-8').toString('base64')
console.log(buff1)

let rawStr = Buffer.from(buff1, 'base64').toString('utf-8')
console.log(rawStr)

var nowStr = util.format();
var buff = Buffer.from("毛衣", 'utf-8').toString('base64')
var key = nowStr + "_" + buff

console.log(key)
console.log("写入redis，key为" + key)
client.set(key, "value", redis.print);

// if (client.lrange(key, 0, 100) != null) {
//     console.log("exists")
// } else if(client.lrange(key, 0, 100) == null){
//     console.log("not exist")
// }

if (client.exists("20210912_5q+b6KGj") == 1) {
    console.log("exists")
} else if(client.exists("20210912_5q+b6KGj") == 0){
    console.log("not exist")
}

process.exit()