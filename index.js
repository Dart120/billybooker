const express = require('express')

const puppeteer = require('puppeteer');


const entities = new Entities();
// run in a non-headless mode
events = []

const fetchEvents = async() => {

    const browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        'args': [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1199,
        height: 900
    });
    await page.goto('https://apps.dur.ac.uk/bookings/book/type', {
        waitUntil: 'networkidle2'
    });
    await page.waitForSelector('._50f7');
    console.log('Page Object is set up')
    thing = await page.evaluate(() => {
        links = Array.from(document.querySelectorAll('._50f7'))
        here = links.map((elem) => 'https://www.facebook.com' + elem.parentNode.getAttribute('href'))
        return here
    })
    console.log('Returning', [thing, page])
    return [thing, page]


}



for (let i = 0; i < t.length; i++) {
    urll = t[i];
    console.log(urll)
    await page.goto(urll, {
        waitUntil: 'networkidle2'
    })
    cover = await page.evaluate(() => document.querySelector('._3ojl').children[0].getAttribute('src'))
    console.log(1)
    date = await page.evaluate(() => document.querySelector('._5xhk').innerHTML)
    console.log(2)
    place = await page.evaluate(() => document.querySelectorAll('._xkh')[1].children[0].innerHTML)
    console.log(3)
    title = await page.evaluate(() => document.querySelector('._5gmx').innerHTML)
    console.log(4)
    events.push({
        cover,
        date,
        place,
        title: entities.decode(title)
    })
}




module.exports = router