const express = require('express')

const puppeteer = require('puppeteer');
require('dotenv').config()



const bookTable = async(day, month, preferences) => {

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
    await page.waitForSelector('#username');
    console.log('Page Object is set up')
    console.log(process.env.USERNAME)
    await page.type('input[name=username]', process.env.USERNAME, { delay: 20 })
    await page.type('input[name=password]', process.env.PASSWORD, { delay: 20 })
    await page.click('button[type="submit"]')
    await page.waitForSelector('#category_6');
    await page.$eval('input[name="category[6]"]', check => check.checked = true);
    await page.click('button[type="submit"]')
    await page.waitForSelector('#date');
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
    await page.evaluate(() => {
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
                if (sibling !== e) {
                    siblings.push(sibling);
                }
                sibling = sibling.nextSibling;
            }
            return siblings;

        };
        let currentRoom = 0;
        for (let i = 0; i < rooms.length; i++) {
            siblings = getSiblings(rooms[i].parentNode)
            if (getSiblings(rooms[i].parentNode)[0].innerText.includes('13:00')) {

                currentRoom = rooms[i]
                break
            }
        }
        currentRoom.click()
    })



    //     thing = await page.evaluate(() => {
    //         links = Array.from(document.querySelectorAll('._50f7'))
    //         here = links.map((elem) => 'https://www.facebook.com' + elem.parentNode.getAttribute('href'))
    //         return here
    //     })
    //     console.log('Returning', [thing, page])
    //     return [thing, page]


    // }



    // for (let i = 0; i < t.length; i++) {
    //     urll = t[i];
    //     console.log(urll)
    //     await page.goto(urll, {
    //         waitUntil: 'networkidle2'
    //     })
    //     cover = await page.evaluate(() => document.querySelector('._3ojl').children[0].getAttribute('src'))
    //     console.log(1)
    //     date = await page.evaluate(() => document.querySelector('._5xhk').innerHTML)
    //     console.log(2)
    //     place = await page.evaluate(() => document.querySelectorAll('._xkh')[1].children[0].innerHTML)
    //     console.log(3)
    //     title = await page.evaluate(() => document.querySelector('._5gmx').innerHTML)
    //     console.log(4)
    //     events.push({
    //         cover,
    //         date,
    //         place,
    //         title: entities.decode(title)
    //     })
}
bookTable('29', '04', [
    'Bill Bryson Library: Stay and Study',
    'Mathematical Sciences & Computer Science Building: Individual Study',
    'Teaching and Learning Centre: Individual Study - long stay'
])

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