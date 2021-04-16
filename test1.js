const express = require('express')

const puppeteer = require('puppeteer');

router.get('/api/events',async (req,res) => {
  
  
  
    events = await Event.find().exec();
    docs = await events
    res.send(JSON.stringify(events))
  })
router.get('/api/get_new_events',(req,res) => {
  const entities = new Entities();
    // run in a non-headless mode
    events = []
   
    const fetchEvents = async () => {
      try{
        const browser = await puppeteer.launch({ headless : true, devtools: true,'args' : [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ] });
        const page = await browser.newPage();
        await page.setViewport({ width: 1199, height: 900 });
        await page.goto('https://www.facebook.com/pg/durhampoca/events/?ref=page_internal', {waitUntil: 'networkidle2'});   
        await page.waitForSelector('._50f7');
        console.log('Page Object is set up')
        thing = await page.evaluate(() => {
          links = Array.from(document.querySelectorAll('._50f7'))
          here = links.map((elem) => 'https://www.facebook.com' + elem.parentNode.getAttribute('href'))
          return here
        })
        console.log('Returning', [thing,page])
        return [thing,page]
        
      }
      catch(err){
        
      }
      }
      
    const mel = async function (t,page) {
      try{
        for (let i = 0; i < t.length; i++) {
            urll = t[i];
            console.log(urll)
            await page.goto(urll, {waitUntil: 'networkidle2'})
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
              title : entities.decode(title)
            })
                }
              return(events)}
    
    catch(err){
      
    }}
                fetchEvents()
                .then(p => {
                  console.log(p,"here")
                  return mel(p[0],p[1])})
                .then(events => {
                  events.forEach((elem) => {

                    longString = elem.date
                    count = 0
                    for (let i in longString){
                      if (longString[i] == ':'){
                        
                        count++
                      }
                    }
                    index = longString.search(' UTC')
                    longString = longString.slice(0, index)
                    if (count == 2){
                      console.log(elem,"Start and end dates")
                      endTime = longString.slice(longString.length - 6,longString.length)
                      longString = longString.slice(0,longString.length - 6)
                      fromIndex = longString.search(' from')
                      longString1 = longString.slice(0,fromIndex)
                      longString2 = longString.slice(fromIndex + 5,longString.length)
                      longString = longString1 + longString2
                      console.log(longString)
                      elem.startDate = longString
                      elem.endDate = longString.slice(0,longString.length-5)+endTime.slice(1,endTime.length)
                      console.log(elem.endDate)

                    } else{
                      console.log(elem,"Start dates")
                      atIndex = longString.search(' at')
                      longString1 = longString.slice(0,atIndex)
                      longString2 = longString.slice(atIndex + 3,longString.length)
                      longString = longString1 + longString2
                      elem.startDate = longString
                      elem.endDate = longString
                    }

                  }
                )
              return events})
                .then(events =>  modeler(events,res))
                
                .then(()=> res.json({success: true}))
  }) 
  async function modeler(events,res){
    await Event.deleteMany()
     for (let i = 0; i < events.length; i++){
      eventObj = new Event(events[i])
      try{
      doc = await eventObj.save()
      }
      catch(err){
        
      }
     }
   }

module.exports = router