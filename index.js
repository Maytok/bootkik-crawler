const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const ua = require("useragent");

function isBot(userAgent) {
    const agent = ua.is(userAgent);
    return !agent.webkit && !agent.opera && !agent.ie &&
        !agent.chrome && !agent.safari && !agent.mobile_safari &&
        !agent.firefox && !agent.mozilla && !agent.android;
}

const react_build_dir = "../build/"; // this variable refers to directory where our client-side React is built
app.use(react_build_dir); // this is to allow browser download the static files of the React app (CSS, JS, images).

const port = 3002;
app.get('*', async (req, res) => {
    try {
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
            
        // we need to override the headless Chrome user agent since its default one is still considered as "bot"
        await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36');

        const local_url = req.originalUrl;
        const request_url = req.query.page
        console.log(request_url);
        await page.goto(local_url, {
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
