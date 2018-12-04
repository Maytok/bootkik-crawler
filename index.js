const express = require('express');
const app = express();
const puppeteer = require('puppeteer');

//const react_build_dir = "/home/ubuntu/test_bootkik_com/build/"; // this variable refers to directory where our client-side React is built
//app.use(react_build_dir); // this is to allow browser download the static files of the React app (CSS, JS, images).

const port = 3002;
app.get('*', async (req, res) => {
    try {
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
            
        // we need to override the headless Chrome user agent since its default one is still considered as "bot"
        await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36');

        const request_url = req.query.page;
        const origin_url = req.originalUrl;
        console.log('request_url' + request_url);
        console.log('origin_url' + origin_url);
        await page.goto('https://test.bootkik.com' + origin_url, {
            waitUntil: "networkidle0",
        });

        const html = await page.evaluate(() => {
            return document.documentElement.innerHTML;
        });

        res.send(html);

        } catch(e) {
            console.log(e);
            res.send("ERROR");
        }

});

app.listen(port, () => {
    console.log(`Web server is running at port ${port}`);
});
