
const puppeteer = require('puppeteer');    
require('dotenv').config();
async function visitPage(){
    const browser = await puppeteer.launch({ headless : false, devtools: true,'args' : [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ] });
      const page = await browser.newPage();
      await page.setViewport({ width: 1199, height: 900 });
      await page.goto('https://apps.dur.ac.uk/bookings/login', {waitUntil: 'networkidle2'});

}   

visitPage()
console.log('hey')