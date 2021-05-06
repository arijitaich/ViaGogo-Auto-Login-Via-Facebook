const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('./config.json');
const cookies = require('./cookies.json');





(async () => {

    //Start Window
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();



    
    async function newWing(wing){
    var href = wing;
    //Create A Function That will take Mid Level URLS and open them in new tabs and fetch their next level URLS & pass it on.
    //Launch New Event Link In New Window For Processing
    const pagex = await browser.newPage(); await pagex.goto(href);
    //Fetch Primary Events In The Region
               //Fetch Primary Events In The Region
               await pagex.$x('div.el-table');
               let div_selector= 'div.el-table';

               let list_length    = await pagex.evaluate((sel) => {
               let elements = Array.from(document.querySelectorAll(sel));
               return elements.length;
                 }, div_selector);


               var bag1 = [];
               for(let i=0; i< list_length; i++){
                  var href = await pagex.evaluate((l, sel) => {
                   let elements= Array.from(document.querySelectorAll(sel));
                   let anchor  = elements[l].getElementsByTagName('a')[0];
                   if(anchor){
                       return anchor.href;
                   }else{
                       return '';
                   }
               }, i, div_selector);
                console.log('Second Level Event--------> ', href);
               

                 bag1[i] = href;
                //  console.log(bag1[i]);

   }
      


// a.js-event-row-container.el-row-anchor.cGry1

       
        await pagex.close();
        // return bag1;
        
        
        }




    //Checking If We Have Pre-Saved Sessions
    if(Object.keys(cookies).length){
        // Set the Saved Cookies in the Puppet Window
        await page.setCookie(...cookies);

        //Go To The Website
        await page.goto('https://www.viagogo.co.uk/Festival-Tickets', { waitUntil: 'networkidle2' });

    } else {

        //Go to Website Login Page
        console.log('Opening  ViaGogo Login...');
        await page.goto('https://my.viagogo.co.uk/secure/loginregister/login', {waitUntil: 'networkidle0'});

        const elements = await page.$x('//*[@id="ExternalLoginForm"]/div/button');
        await elements[0].click(); 
        console.log('Routing through Facebook Login...');
        await page.waitForTimeout(10000);

        //Setting Facebook Environment
        console.log('Providing Pre-Set Facebook Credentials');
                //Fill Up User Name & Password
                await page.type('#email', config.username, { delay: 30 });
                await page.type('#pass', config.password, { delay: 30 });
                console.log('FB Login Triggerred...');
                //Click on Login Button
                await page.click('#loginbutton');
        
                //Adding Time Buffer For Navigation To Finish Rendering The Screen
                await page.waitForNavigation({ waitUntil: 'networkidle0' });
                await page.waitForTimeout(20000);
        
                //Get Current Browser Page Sessions
                let currentCookies = await page.cookies();

                //Opening Gates Post Login To ViaGogo
                console.log('Opening  ViaGogo for Top Regional Events...');
               //Go to ViaGogo Page
                await page.goto('https://www.viagogo.co.uk/Festival-Tickets', {waitUntil: 'networkidle0'});

                //Fetch Primary Events In The Region
                let div_selector= "div.toi"; 

                let list_length    = await page.evaluate((sel) => {
                let elements = Array.from(document.querySelectorAll(sel));
                return elements.length;
                  }, div_selector);


                var bag1 = [];
                for(let i=0; i< list_length; i++){
                   var href = await page.evaluate((l, sel) => {
                    let elements= Array.from(document.querySelectorAll(sel));
                    let anchor  = elements[l].getElementsByTagName('a')[0];
                    if(anchor){
                        return anchor.href;
                    }else{
                        return '';
                    }
                }, i, div_selector);
                 console.log('First Level Event--------> ', href);
                

                  bag1[i] = newWing(href);
                  console.log(bag1[i]);

    }



    //Foreach Wing 
    




        

    }
    
    debugger;
})();