const puppeteer = require('puppeteer');
let request = require('request-promise-native');
const expect = require('chai').expect;

describe("添加编辑商品增加商品群配置项", () => {
    
    it("打开绑定商品群页", 
        //使用 puppeteer.launch 启动 Chrome
        async () => {
            const browser = await puppeteer.launch({
                headless: false,   //有浏览器界面启动
                slowMo: 100,       //放慢浏览器执行速度，方便测试观察
                args: [            //启动 Chrome 的参数，详见上文中的介绍
                    '–no-sandbox',
                    // '--window-size=1280,960'
                ],
            });
            const page = await browser.newPage();

            await page.goto('https://d.weidian.com/', {
                waitUntil: 'networkidle0'
            });
    
            var username = "10000083031";
            var password = "wd123456";
            // var username = '15910622192';
            // var password = 'wd123456';
            await page.type('#app > div.content-wrapper > div > div > div.flex.login-container-content > div.login-wrapper > div.logo-info > form > div.user-telephone > div > div > div > input', `${username}`);
            await page.type('#app > div.content-wrapper > div > div > div.flex.login-container-content > div.login-wrapper > div.logo-info > form > div:nth-child(2) > div > div > input', `${password}`);

            let login = await page.$('#app > div.content-wrapper > div > div > div.flex.login-container-content > div.login-wrapper > div.logo-info > form > div:nth-child(4) > div > button');
            await Promise.all([
                login.click(),
                page.waitForNavigation()
            ]);

            const iPhone = puppeteer.devices['iPhone 6'];
            await page.emulate(iPhone);

            // page.emulate({ viewport: { width: 1280, height: 800 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3347.0 Safari/537.36' });

            //进入真正要测试的页面
            let url = 'https://h5.pre.weidian.com/m/auto-join-group/?imGroupId=0&identifier=GMEditPage#/bind-group-input';
            await page.goto(url, {
                waitUntil: 'networkidle0'
            });

            await delay(2000);

            await page.screenshot({
                path: '/Users/jinbin/Desktop/capture.png',  //图片保存路径
                type: 'png',
                fullPage: true //边滚动边截图
            });

            await delay(500);

            expect(1).to.equal(0);
    
            await page.close();
            await browser.close();

            function delay(time) {
                return new Promise(function (resolve) {
                    setTimeout(resolve, time)
                });
            }
        }
    ).timeout(50000);

});