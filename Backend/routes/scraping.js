const router = require('express').Router();
const puppeteer = require('puppeteer')

router.get(`/straw_price`, (req, res) => {
    try {

        const data = {}
            
        async function scrap() {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto('https://www.simummuangmarket.com/product/2277');
            // await page.screenshot({ path: 'example.png' });
            for (let i = 1; i < 4; i++) {
                let element = await page.waitForSelector(`#frontend_app > div.application--wrap > main > div > div > div > div:nth-child(1) > div.flex.md8 > div > div.section-body > div:nth-child(1) > div:nth-child(${i}) > div.card-style.round-corner.text-xs-center.responsive-square > div > div > div > div.price.text-red > strong`)
                let text = await page.evaluate(element => element.textContent, element)
                
                data[`p${i}`] = text;
                // console.log(text)
            }
            let date = await page.waitForSelector('#frontend_app > div.application--wrap > main > div > div > div > div:nth-child(1) > div.flex.md8 > div > div.section-body > div:nth-child(2) > div > div > div')
            data['date'] = await page.evaluate(element => element.textContent, date)
            
            await browser.close();
        };

        scrap().then(() => {
            console.log('Scraping Done.')
            res.json(  data  )
            }).catch(error => res.json(error));

    }
    catch (ex) { res.error(ex) }
})



module.exports = router;