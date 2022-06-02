const puppeteer = require('puppeteer');

const openBrowser = async() => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox"],
            slowMo: 10
        });
        const page = await browser.newPage();
        // await page.setViewport({ width: 1366, height: 5000 });

        return [browser, page];
    } catch (err) {
        return err;
    }
}

const closeBrowser = async(browser, page) => {
    try {
        await browser.close();
        await page.close();
    } catch (err) {
        return err;
    }
}

const sleep = async(page, limit, start = 0) => {
    try {
        const pause = Math.floor(Math.random() * limit) * 1000 + start * 1000;
        await page.waitForTimeout(pause);
    } catch (err) {
        return err;
    }
}

const scrollDown = async(page) => {
    await page.evaluate(async() => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            const distance = 1000;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 1000);
        });
    });
}

const removeHtmlElement = async(page, elm) => {
    await page.evaluate((div) => {
        const element = document.getElementsByClassName(div)[0];
        if (element) {
            element.parentNode.removeChild(element);
        }
    }, elm)
}

module.exports = { openBrowser, closeBrowser, sleep, scrollDown, removeHtmlElement };