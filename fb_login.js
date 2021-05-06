const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('./config.json');
const cookies = require('./cookies.json');

(async () => {

    //Start Window
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();

    //Checking If We Have Pre-Saved Sessions
    if(Object.keys(cookies).length){
        // Set the Saved Cookies in the Puppet Window
        await page.setCookie(...cookies);

        //Go To The Website
        await page.goto('https://www.facebook.com/', { waitUntil: 'networkidle2' });

    } else {

        //Go to Website Login Page
        await page.goto('https://www.facebook.com/login/', {waitUntil: 'networkidle0'});

        //Fill Up User Name & Password
        await page.type('#email', config.username, { delay: 30 });
        await page.type('#pass', config.password, { delay: 30 });

        //Click on Login Button
        await page.click('#loginbutton');

        //Adding Time Buffer For Navigation To Finish Rendering The Screen
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        await page.waitForTimeout(15000);

        //Check If Logged In
        try{
            await page.waitForSelector('[data-click="profile_icon"]');
        } catch(error){
            console.log('Failed to Login');
            process.exit(0);
        }

        //Get Current Browser Page Sessions
        let currentCookies = await page.cookies();

        // Creating A Cookie File If Not Created To Store Session
        fs.writeFileSync('./cookies.json', JSON.stringify(currentCookies));

    }

    debugger;
})();