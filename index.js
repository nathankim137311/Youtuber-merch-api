const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const cors = require('cors');
const { db } = require('./database');

const { v4: uuidv4 } = require('uuid');

const PORT = 8000; 

// docker run --name some-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql

const youtubers = [
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

// fetch data from merch stores 

app.get('/ScissorBros/products', cors(), async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://shop.upstatemerch.com/scissorbros/shop/home'); 
    
    const products = await page.evaluate(() => (
        [...document.querySelectorAll('div[class="grid-x small-up-2 medium-up-1 product-card p-a-1 p-b-2 columns-3"]')].map(item => {

            return {
                id: '', 
                name: item.querySelector('p[class="product-name m14"]').textContent,
                price: item.querySelector('p[class="product-price ng-star-inserted"]').textContent,
                imgSrc: item.querySelector('img[class="product-art-image ng-star-inserted"]').src, 
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
        [...document.querySelectorAll('div[class="_product mb-8 mx-1 md:mb-12 md:mx-4"]')].map(item => {

            return {
                id: '', 
                name: item.querySelector('div[class="_product-name mb-2 text-sm md:text-base"]').textContent,
                price: item.querySelector('div[class="flex flex-row items-end mb-1 font-semibold"] > div').textContent,
                imgSrc: item.querySelector('img[class="w-full h-full object-contain duration-200 transition-opacity opacity-100"]').src, 
            }
        })
    ));
    
    // Each product id property is assigned a random id
    products.forEach(product => product.id = uuidv4());

    res.json(products);
    browser.close();
});

// extracts products from multiple pages using recursion
app.get('/TigerBelly/products', cors(), async (req, res) => {
    const extractProducts = async (url) => {
        const page = await browser.newPage();
        await page.goto(url);
        console.log(`scraping: ${url}`); 
        const productsOnPage = await page.evaluate(() => (
            [...document.querySelectorAll('div[class="grid__item large--one-quarter medium--one-half"]')].map(item => {
    
                return {
                    id: '', 
                    name: item.querySelector('span[class="product-grid-title"]').textContent,
                    price: item.querySelector('p[class="price"]').innerText,
                    imgSrc: item.querySelector('div[class="grid__image"] > img').src, 
                }
            })
        ));

        // Each product id property is assigned a random id
        productsOnPage.forEach(product => product.id = uuidv4());

        await page.close();

        if (productsOnPage.length < 1) {
            return productsOnPage
        } else {
            const nextPageNumber = parseInt(url.match(/page=(\d+)$/)[1], 10) + 1;
            const nextUrl = `https://tigerbelly.myshopify.com/collections/all?page=${nextPageNumber}`; 
            return productsOnPage.concat(await extractProducts(nextUrl));
        }
    }
    const browser = await puppeteer.launch();
    const url = 'https://tigerbelly.myshopify.com/collections/all?page=1'; 
    const products = await extractProducts(url); 

    res.send(products);
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
                name: item.querySelector('a').title,
                price: item.querySelector('.product-title em .money').textContent.replace(/[^\d\.]*/g, ''),
                imgSrc: item.querySelector('img').src, 
            }
        })
    ));
    
    // Each product id property is assigned a random id
    products.forEach(product => product.id = uuidv4());

    // Iterate through products and insert property values into table
    products.forEach(product => {
        db.query(
            'INSERT INTO YoutubeMerch (product_id, name, price, img_src) VALUES (?, ?, ?, ?)',
            [product.id, product.name, product.price, product.imgSrc],(err, result) => {
                if (err) {
                    console.log(err);
                }
            }
        )
    });

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

// app.get('/h3h3Productions/products', cors(), async (req, res) => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://teddyfresh.com'); 
    
//     const products = await page.evaluate(() => (
//         [...document.querySelectorAll('.ProductItem')].map(item => {

//             return {
//                 id: '',
//                 title: item.querySelector('a').textContent,
//                 url: item.querySelector('a').href,
//                 imgSrc: item.querySelector('img').src
//             }
//         })
//     ));
    
//     // Each product id property is assigned a random id
//     products.forEach(product => product.id = uuidv4());


//     res.json(products);
//     browser.close();
// });

// app.get('/PewDiePie/products', cors(), async (req, res) => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://represent.com/store/pewdiepie'); 
    
//     const products = await page.evaluate(() => (
//         [...document.querySelectorAll('._store_product_link')].map(item => {

//             return {
//                 id: '',
//                 title: item.querySelector('a').title,
//                 url: item.querySelector('a').href,
//                 imgSrc: item.querySelector('img').src,
//                 price: document.querySelector('h3').textContent
//             }
//         })
//     ));
    
//     // Each product id property is assigned a random id
//     products.forEach(product => product.id = uuidv4());

//     console.log(products);
//     res.json(products);
//     browser.close();
// });