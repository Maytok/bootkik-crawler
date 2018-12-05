const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
import fsPath from "fs-path";
var fs = require('fs');

const saveUrlToFile = ({ html = "", pathName = "/", output = "." }) => {
  
    const path = pathName == "/"
                ? `${output}/index.html`
                : `${output}${pathName}.html`;
  
    fsPath.writeFile(path, html, err => {
        if (err) {
            throw err;
        }
    });
};


const port = 3002;
app.get('*', async (req, res) => {
    try {
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
            
        // we need to override the headless Chrome user agent since its default one is still considered as "bot"
        await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36');

        const origin_url = req.originalUrl;
        console.log('origin_url: ' + origin_url);
        
        let cached_file_path = `.${origin_url}.html`;
        
        if (fs.existsSync(cached_file_path)) {
            let file_content = fs.readFileSync('DATA', 'utf8');
            console.log("I got a cached file. Sending...")
            res.send(file_content);
        }        
        
        await page.goto('https://test.bootkik.com' + origin_url, {
            waitUntil: "networkidle0",
        });

        const html = await page.evaluate(() => {
            return document.documentElement.innerHTML;
        });
        
        await page.close();
        browser.disconnect();
        browser.close();

        res.send(html);

        } catch(e) {
            console.log(e);
            res.send("ERROR");
        } finally{
            console.log('FInally reached');
        }

});

app.listen(port, () => {
    console.log(`Web server is running at port ${port}`);
});
