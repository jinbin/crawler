const redis = require("redis")
const puppeteer = require('puppeteer');
var util = require('./date');

const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});

const fs = require('fs')

function ReadFileByLines(fileName) {
    try {
        const data = fs.readFileSync('/Users/jinbin/downloaded_639/crawler/top20.txt', 'utf8')
        //console.log(data)
        const kw_list = []
        var list = data.split("\n")
        for (var i = 0; i < list.length; i++) {
            kw_list.push(list[i]);
        }
        return kw_list;
      } catch (err) {
        console.error(err)
    }
}

var start = new Date().getTime()

var result = ReadFileByLines("/Users/jinbin/downloaded_639/crawler/top20.txt")
console.log(result)

var end = new Date().getTime()
console.log("总体运行时间: " + (end - start) + "s")

process.exit()