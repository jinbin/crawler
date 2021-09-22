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

    await page.goto('https://xui.ptlogin2.qq.com/cgi-bin/xlogin?appid=710023101&style=20&s_url=http%3A%2F%2Fopen.qq.com%2Fhtml%2Fproxy%2FloginSuccess.html&target=self', {
        waitUntil: 'networkidle0'
    });

    // var username = "1464915393";
    // var password = "KDpocket@88";
    var username = "674817248";
    var password = "jinbinustc";

    console.log("登录");
    await page.click('#switcher_plogin');

    await page.type('#u', `${username}`);
    await page.type("#p", `${password}`);

    let login = await page.$('#login_button');
    login.click({
        waitUntil: 'networkidle0'
    })

    await page.goto('https://v.qq.com/', {
        waitUntil: 'networkidle0'
    });

})();