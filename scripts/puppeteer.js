const puppeteer = require('puppeteer');
let request = require('request-promise-native');

//使用 puppeteer.launch 启动 Chrome
(async () => {
    const browser = await puppeteer.launch({
        headless: false,   //有浏览器界面启动
        slowMo: 100,       //放慢浏览器执行速度，方便测试观察
        args: [            //启动 Chrome 的参数，详见上文中的介绍
            '–no-sandbox',
            '--window-size=1280,960'
        ],
    });
    const page = await browser.newPage();

    await page.goto('https://d.weidian.com/', {
        waitUntil: 'networkidle0'
    });
    
    var username = "10000083031";
    var password = "wd123456";
    await page.type('#app > div.content-wrapper > div > div > div.flex.login-container-content > div.login-wrapper > div.logo-info > form > div.user-telephone > div > div > div > input', `${username}`);
    await page.type('#app > div.content-wrapper > div > div > div.flex.login-container-content > div.login-wrapper > div.logo-info > form > div:nth-child(2) > div > div > input', `${password}`);

    let login = await page.$('#app > div.content-wrapper > div > div > div.flex.login-container-content > div.login-wrapper > div.logo-info > form > div:nth-child(4) > div > button');
    await Promise.all([
        login.click(),
        page.waitForNavigation()  
    ]);

    const iPhone = puppeteer.devices['Nokia N9'];
    await page.emulate(iPhone);
    // width height pixels 参考：https://uiiiuiii.com/screen/
    //page.emulate({ viewport: { width: 1080, height: 2244 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3347.0 Safari/537.36' });

    await page.goto('https://h5.weidian.com/m/happy-star', {
        waitUntil: 'networkidle0'
    });

    let btn = await page.$('[class^="btn"]');
    await Promise.all([
        btn.click(),
        page.waitForNavigation()  
    ]);

    //选择的序号
    var choices=[1, 1, 2, 2, 3];
    //循环做完五道题
    for (var i=0; i<5; i++)
    {
        // div:nth-child(1)决定了做第几题
        let q = await page.$(`#app > div > div > div.content > div:nth-child(${choices[i]}) > div > button`);
        await Promise.all([
            q.click(),
            page.waitForNavigation()  
        ]);   
    }

    await page.type('#app > div > div.item > input[type=text]', "你的姓名")
    let go_to_result = await page.$('#app > div > div.btn > div')
    await Promise.all([
        go_to_result.click(),
        page.waitForNavigation({
            waitUntil: 'domcontentloaded'
        })
    ]);

    await delay(4000);

    await page.screenshot({
        path: '/Users/jinbin/Desktop/capture.png',  //图片保存路径
        type: 'png',
        fullPage: true //边滚动边截图
    });

    function delay(time) {
        return new Promise(function(resolve) { 
            setTimeout(resolve, time)
        });
    }
    
    // await page.close();
    // await browser.close();
})();