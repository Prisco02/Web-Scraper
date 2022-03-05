const puppeteer = require('puppeteer') //libreria interazione browser
const fs = require('fs/promises') //libreria scrittura file
var mysql = require('mysql');

async function webScraper(url, database){
    const browser= await puppeteer.launch() //avvio browser
    const page = await browser.newPage() //apro nuova pagina
    await page.goto(url) //vado nell'url

    //evaluate(() => {...}) interagisce con la pagina, 
    //$$eval("a", (b) => {...}) interagisce con TUTTI gli elenti 'a' mettendoli dentro la variabile 'b',
    //$eval("a", (b) => {...}) interagisce con IL PRIMO degli elenti 'a' mettendoli dentro la variabile 'b'
    
    while(true){
        try{
            await page.click(".ags-NewsLandingPage-loadMoreLink") //esegue un click sull'elemento selezionato
            console.log("pulsante premuto")
            await page.waitForTimeout(1000)
            
        }
        catch{
            console.log("pulsanti finiti")
            break;
        }
    }
    //let links = await page.evaluate(() => {return Array.from(document.querySelectorAll('.ags-SlotModule-spacer')).map(x => x.href)})

    let links = await page.$$eval(".ags-SlotModule-spacer", (link) => {return link.map(x => x.href)})
    let titles = await page.$$eval(".ags-SlotModule-contentContainer-heading", (title) => {return title.map(x => x.textContent)})
    let texts = await page.$$eval(".ags-SlotModule-contentContainer-text", (text) => {return text.map(x => x.textContent)})
    // let images = await page.evaluate(() => {return Array.from(document.querySelectorAll('.ags-SlotModule-imageContainer-image')).map(x => x.src)})

    //await page.screenshot({ path: 'example.png', fullPage: true }) //screenshotta tutta la pagina

    // await fs.writeFile("links.txt", links.join("\r\n"))
    // await fs.writeFile("titles.txt", titles.join("\r\n"))
    // await fs.writeFile("texts.txt", texts.join("\r\n"))

    //salva immagine nel progetto (non mi serve al momento)
    /* for (image of images) {
        imagepage = await page.goto(image) // va al percorso dell'immagine
        await fs.writeFile(image.split('/').pop(), await imagepage.buffer())
    }*/


    await browser.close() //chiude il browser
}
 
webScraper('https://www.newworld.com/en-us/news', database)