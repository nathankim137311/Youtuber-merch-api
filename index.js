const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const PORT = 8000; 

const youtubers = [
    {
        channelId: 'UCDWIvJwLJsE4LG1Atne2blQ',
        channelName: 'h3h3Productions',
        merchStore: 'https://teddyfresh.com', 
    },
    {
        channelId: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw',
        channelName: 'PewDiePie',
        merchStore: 'https://represent.com/store/pewdiepie', 
    },
    {
        channelId: 'UCO1ITICo8MLHGAXR1uzFwjA',
        channelName: 'OneyPlays',
        merchStore: 'https://sharkrobot.com/collections/oney', 
    },
    {
        channelId: 'UCYzPXprvl5Y-Sf0g4vX-m6g',
        channelName: 'jacksepticeye',
        merchStore: 'https://store.jacksepticeye.com',
    },
    {
        channelId: 'UCrTNhL_yO3tPTdQ5XgmmWjA',
        channelName: 'RedLetterMedia',
        merchStore: 'https://red-letter-media.creator-spring.com/?', 
    },
    {
        channelId: 'UCsgv2QHkT2ljEixyulzOnUQ',
        channelName: 'AngryJoeShow',
        merchStore: 'https://metathreads.com/collections/angry-joe',
    },
    {
        channelId: 'UClHVl2N3jPEbkNJVx-ItQIQ',
        channelName: 'HealthyGamerGG',
        merchStore: 'https://healthygamerstore.com',
    },
    {
        channelId: 'UCRLOLGZl3-QTaJfLmAKgoAw',
        channelName: 'Alan Thrall',
        merchStore: 'https://untamedstrengthapparel.com',
    },
    {
        channelId: 'UCIyIoM_Nd8HtY19fuR_ov2A',
        channelName: 'TigerBelly',
        merchStore: 'https://thetigerbelly.com/collections/all',
    },
    {
        channelId: 'UCGCXWfqaovf_vI05iW6pLdA',
        channelName: 'ScissorBros',
        merchStore: 'https://shop.upstatemerch.com/scissorbros/shop/home',
    }
]

const app = express(); 

app.get('/', (req, res) => {
    res.json('Welcome to my Youtuber Merch Api');
});

app.get('/youtubers', (req, res) => {
    res.json(youtubers); 
});

app.get('/h3h3Productions/products', cors(), async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://teddyfresh.com'); 
    
    const products = await page.evaluate(() => (
        [...document.querySelectorAll('.ProductItem')].map(item => {

            return {
                id: '',
                title: item.querySelector('a').textContent,
                url: item.querySelector('a').href,
                imgSrc: item.querySelector('img').src
            }
        })
    ));
    
    // Each product id property is assigned a random id
    products.forEach(product => product.id = uuidv4());


    res.json(products);
    browser.close();
});

app.get('/PewDiePie/products', cors(), async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://represent.com/store/pewdiepie'); 
    
    const products = await page.evaluate(() => (
        [...document.querySelectorAll('._store_product_link')].map(item => {

            return {
                id: '',
                title: item.querySelector('a').title,
                url: item.querySelector('a').href,
                imgSrc: item.querySelector('img').src,
                price: document.querySelector('h3').textContent
            }
        })
    ));
    
    // Each product id property is assigned a random id
    products.forEach(product => product.id = uuidv4());

    console.log(products);
    res.json(products);
    browser.close();
});

app.get('/OneyPlays/products', cors(), async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://sharkrobot.com/collections/oney'); 
    
    const products = await page.evaluate(() => (
        [...document.querySelectorAll('.block-grid li')].map(item => {

            return {
                id: '',
                title: item.querySelector('a').title,
                url: item.querySelector('a').href,
                imgSrc: item.querySelector('img').src
            }
        })
    ));
    
    // Each product id property is assigned a random id
    products.forEach(product => product.id = uuidv4());

    console.log(products);
    res.json(products);
    browser.close();
});


app.listen(PORT, () => console.log(`server running on port ${PORT}`));

// app.get('/', cors(), async (req, res) => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://sharkrobot.com/collections/oney');

//     const product = await page.evaluate(() => {
//         let items = [...document.querySelectorAll('div[class*="product" i] a')].map(item => {
//             return {
//                 title: item.textContent,
//             }
//         });

//         return items 
//     });
    
//     res.send(product);
//     console.log(product);
// });
// a[href*="products" i]

// app.get('/products', async (req, res) => {
//     const response = await axios.get('https://represent.com/store/pewdiepie'); 
//     const html = response.data;
//     const $ = cheerio.load(html);

//     $('a').each(() => {
//         const title = $(this).text();
//         const url = $(this).attr('href'); 
//         products.push({
//             title,
//             url,
//         })
//     });

//     console.log(products);
//     res.send(products);
// });