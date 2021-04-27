const express = require('express')
const schedule = require('node-schedule');
const date = require('date-and-time');


const puppeteer = require('puppeteer');
require('dotenv').config()



const bookTable = async(day, month, preferences, time) => {

    const browser = await puppeteer.launch({
        headless: true,
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
    await page.waitForSelector('#username');
    console.log('Page Object is set up')
    console.log(process.env.USERNAME)
        //Logs in
    await page.type('input[name=username]', process.env.USERNAME, { delay: 20 })
    await page.type('input[name=password]', process.env.PASSWORD, { delay: 20 })
    await page.click('button[type="submit"]')
    await page.waitForSelector('#category_6');
    await page.screenshot({ path: 's1.png' });
    //selects type of booking
    await page.$eval('input[name="category[6]"]', check => check.checked = true);
    await page.click('button[type="submit"]')
    await page.waitForSelector('#date');
    await page.screenshot({ path: 's2.png' });
    await page.type('#date', day + month);

    let {
        options,
        values
    } = await page.evaluate(() => {
        let options = [];
        let values = [];
        document.getElementById('type').childNodes.forEach(node => options.push(node.innerText))
        document.getElementById('type').childNodes.forEach(node => values.push(node.getAttribute("value")))
        return {
            options,
            values
        }
    });


    for (let i = 0; i < preferences.length; i++) {

        if (options.indexOf(preferences[i]) !== -1) {

            await page.evaluate((value) => {
                document.querySelector(`option[value="${value}"]`).selected = true
            }, values[options.indexOf(preferences[i])])
            break
        }
    }
    console.log('here')
    await page.click('button[type="submit"]')
    await page.waitForSelector('.card-body');
    await page.screenshot({ path: 's3.png' });
    //selects room
    await page.evaluate((time) => {
        let rooms = document.querySelectorAll('[name="room"]');
        let getSiblings = function(e) {
            // for collecting siblings
            let siblings = [];
            // if no parent, return no sibling
            if (!e.parentNode) {
                return siblings;
            }
            // first child of the parent node
            let sibling = e.parentNode.firstChild;

            // collecting siblings
            while (sibling) {
                if (sibling.nodeType == 1 && sibling !== e) {
                    siblings.push(sibling);
                }
                sibling = sibling.nextSibling;
            }
            return siblings;

        };
        let currentRoom = 0;
        for (let i = 0; i < rooms.length; i++) {

            if (getSiblings(rooms[i].parentNode).reverse()[0].innerText.includes(time)) {

                currentRoom = rooms[i]
                break
            }
        }
        currentRoom.click()
    }, time)
    await page.click('button[type="submit"]')
    await page.waitForSelector('.card-body');
    await page.screenshot({ path: 's4.png' });
    //selects time
    await page.evaluate((time) => {
        document.querySelector(`#start${time.slice(0,2)}_0`).click()
    }, time)
    await page.click('button[type="submit"]')
    await page.waitForSelector('.card-body');
    //done
    await page.screenshot({ path: 's5.png' });
    await page.$eval('input[name="terms"]', check => check.checked = true);
    await page.click('button[type="submit"]')

}
const now = new Date();
const target = date.addDays(now, 5);
pattern = date.compile('DD');
day = date.format(target, pattern);
pattern = date.compile('MM');
month = date.format(target, pattern);
const job = schedule.scheduleJob('5 30 18 * * *', function() {

    bookTable(day, month, [
        'Bill Bryson Library: Stay and Study',
        'Mathematical Sciences & Computer Science Building: Individual Study',
        'Teaching and Learning Centre: Individual Study - long stay'
    ], '13:00')
});



// [
//     'Bill Bryson Library: Overnight Stay and Study',
//     'Bill Bryson Library: Stay and Study',
//     'Dunelm House: Individual Study',
//     'Elvet Riverside: Individual Study',
//     'Hotel Indigo: Individual Study',
//     'Leazes Road: Individual Study',
//     'Mathematical Sciences & Computer Science Building: Individual Study',
//     'Teaching and Learning Centre: High Bar Table',
//     'Teaching and Learning Centre: Individual Study - long stay',
//     'Teaching and Learning Centre: Individual Study Space',
//     'Teaching and Learning Centre: Low Soft Seating',
//     'Teaching and Learning Centre: Media Table',
//     'Teaching and Learning Centre: Study Table'
// ]