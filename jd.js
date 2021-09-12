const puppeteer = require('puppeteer');
let request = require('request-promise-native');
const chalk = require('chalk')
const redis = require("redis")
var util = require('./date');

const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});

client.on('error', err => {
    console.log('Error ' + err);
});

var mysql = require('mysql');
 
var connection = mysql.createConnection({     
  host     : '81.68.92.238',       
  user     : 'root',              
  password : 'test',       
  port: '3306',                   
  database: 'crawler'
});

connection.connect((err) => {
    if (err) throw err;
    //console.log('Connected!');
});

//使用 puppeteer.launch 启动 Chrome
async function jd() {

    const browser = await puppeteer.launch({
        headless: true,   //有浏览器界面启动
        slowMo: 100,       //放慢浏览器执行速度，方便测试观察
        args: [            //启动 Chrome 的参数，详见上文中的介绍
            '–no-sandbox',
            '--window-size=1280,960'
        ],
    });

    try {
        console.log(chalk.green("京东搜索数据收集开始..."))

        kw_list = ["毛衣"] //, "优衣库", "女装", "汉堡"]

        const page = []

        for (var i = 0; i < kw_list.length; i++) {
            page[i] = await browser.newPage();

            await page[i].goto("https://search.jd.com/Search?keyword=" + kw_list[i], {
                //waitUntil: 'networkidle0'
            });
    
            let writeDataList = new Array()

            var nowStr = util.format();
            var buff = Buffer.from(kw_list[i], 'utf-8').toString('base64')
            var key = nowStr + "_" + buff

            for (x = 1; x <= 4; x++) {
                    
                let writeData = {
                    picture: undefined,
                    link: undefined,
                    title: undefined,
                    price: undefined
                }
        
                writeData.title = await page[i].$eval('#J_goodsList > ul > li:nth-child(' + x + ') > div > div.p-name.p-name-type-2 > a', el => el.innerText);
            
                writeData.link = await page[i].$eval('#J_goodsList > ul > li:nth-child(' + x + ') > div > div.p-img > a', el => el.getAttribute('href'))
                
                writeData.picture = await page[i].$eval('#J_goodsList > ul > li:nth-child(' + x + ') > div > div.p-img > a > img', img => img.src)
    
                writeData.price = await page[i].$eval('#J_goodsList > ul > li:nth-child(' + x + ') > div > div.p-price > strong > i', el => el.innerText)
    
                writeDataList.push(writeData);
                //}

            }
            console.log(chalk.green("写入redis，key为" + key))
            //client.rpush(key, JSON.stringify(writeDataList));
            client.hset("search", key, JSON.stringify(writeDataList))
        }

        await browser.close()
        console.log(chalk.green("京东搜索数据收集结束。"))
        process.exit()
    } catch (err) {
        console.log(chalk.red("搜索过程中发生错误，将输出错误信息并结束程序"))
        console.log(err)
        await browser.close()
        process.exit(1)
    }
}

jd()