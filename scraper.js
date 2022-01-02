const puppeteer = require('puppeteer');
const { db } = require('./database');
const { v4: uuidv4 } = require('uuid');

function insertProductData(products) {
    products.forEach(product => {
        db.query(
            'INSERT INTO Merch (product_id, channel_id, title, price, img_src) VALUES (?, ?, ?, ?, ?)',
            [product.id, product.channelId, product.title, product.price, product.imgSrc],(err, result) => {
                if (err) {
                    console.log(err);
                }
            }
        )
    }); 
}

async function tigerBelly() {
    const extractProducts = async (url) => {
        const page = await browser.newPage();
        await page.goto(url);
        console.log(`scraping: ${url}`); 
        const productsOnPage = await page.evaluate(() => (
            [...document.querySelectorAll('div[class="grid__item large--one-quarter medium--one-half"]')].map(item => {
                
                return {
                    id: '', 
                    channelId: 'UCIyIoM_Nd8HtY19fuR_ov2A',
                    title: item.querySelector('span[class="product-grid-title"]').textContent,
                    price: item.querySelector('p[class="price"]').textContent,  
                    imgSrc: item.querySelector('div[class="grid__image"] > img').src, 
                }
            })
        ));

        // Each product id property is assigned a random id
        productsOnPage.forEach(product => {
            const pattern = /[A-Za-z\s+\$]/g; 
            product.price = product.price.replace(pattern, ''); 
            
            if (product.price.length === 10) product.price = product.price.slice(0, -5);
    
            product.id = uuidv4(); 
        });

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

    // Iterate through products and insert property values into table
    insertProductData(products); 

    browser.close();
}

// async function YourMomsHousePodcast() {
//     const extractProducts = async (url) => {
//         const page = await browser.newPage();
//         await page.goto(url);
//         console.log(`scraping: ${url}`); 
//         const productsOnPage = await page.evaluate(() => (
//             [...document.querySelectorAll('div[class="box product"]')].map(item => {
//                 const parser = new DOMParser();
//                 const doc = parser.parseFromString(document.querySelector('noscript'), 'text/html');
//                 console.log(doc); 
                
//                 return {
//                     id: '', 
//                     channelId: '',
//                     title: '',
//                     // title: item.querySelector('a[class="title"]').textContent,
//                     price: '',
//                     // price: item.querySelector('span[class="money"]').textContent.replace(/\$/g, ''),  
//                     // imgSrc: item.querySelector('').src, 
//                     imgSrc: doc.textContent, // returns null  
//                 }
//             })
//         ));

//         // Each product id property is assigned a random id
//         productsOnPage.forEach(product => product.id = uuidv4());

//         await page.close();
//         if (productsOnPage.length < 1) {
//             return productsOnPage
//         } else {
//             const nextPageNumber = parseInt(url.match(/page=(\d+)$/)[1], 10) + 1;
//             console.log(nextPageNumber);
//             const nextUrl = `https://store.ymhstudios.com/collections/all-products?page=${nextPageNumber}`; 
//             return productsOnPage.concat(await extractProducts(nextUrl));
//         }
//     }

//     const browser = await puppeteer.launch();
//     const url = 'https://store.ymhstudios.com/collections/all-products?page=1'; 
//     const products = await extractProducts(url); 

//     // Iterate through products and insert property values into table
//     insertProductData(products); 

//     browser.close();
// }

// YourMomsHousePodcast();
// tigerBelly();

async function YourMomsHousePodcast() {
    const browser = await puppeteer.launch();
    const url = 'https://store.ymhstudios.com/collections/all-products?page=1';
    const page = await browser.newPage();
    await page.goto(url);

    const products = await page.evaluate(() => {
        return [...document.querySelectorAll('figure.product-grid-item--center')].map(element => {
            return {
                id: '',
                title: element.querySelector('figcaption a').textContent,
                price: element.querySelector('figcaption span.money').textContent.replace(/\$/g, ''), 
                imgSrc: element.querySelector('img.product_card__image') === null ? '' : element.querySelector('img.product_card__image').getAttribute('data-fallback'), 
            }
        });
    });

    products.forEach(product => product.id = uuidv4());

    console.log(products.length);
    browser.close();
    return
}

YourMomsHousePodcast();