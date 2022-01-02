const express = require('express');
const cors = require('cors');

const PORT = 8000; 

const comedyPodcasts = [
    {
        channelId: 'UCIyIoM_Nd8HtY19fuR_ov2A',
        channelName: 'TigerBelly',
        storeUrl: 'https://thetigerbelly.com/collections/all', // multi page
    },
    {
        channelId: 'UCGCXWfqaovf_vI05iW6pLdA',
        channelName: 'ScissorBros',
        storeUrl: 'https://shop.upstatemerch.com/scissorbros/shop/home', // single page
    },
    {
        channelId: 'UCYIgiXwJck_Pb5Nj-wIrsqg',
        channelName: 'YourMomsHousePodcast',
        storeUrl: 'https://store.ymhstudios.com/collections/all-products', // multi page
    },
    {
        channelId: 'UC5AQEUAwCh1sGDvkQtkDWUQ',
        channelName: 'Theo Von',
        storeUrl: 'https://www.theovonstore.com', // single page
    },
    {
        channelId: 'UCTeIxzkL9QZ2noyLVUNfXJg',
        channelName: 'Chris D\'Elia',
        storeUrl: 'https://store.chrisdelia.com', // single page
    },
    {
        channelId: 'UC6AbsTfBMQ_dHjtipwh3bZg',
        channelName: 'The Fighter and The Kid',
        storeUrl: 'https://thefighterandthekidshop.com', // single page
    },
    {
        channelId: 'UCzQUP1qoWDoEbmsQxvdjxgQ',
        channelName: 'PowerfulJRE',
        storeUrl: 'https://www.higherprimate.com', // multi page
    },
    {
        channelId: 'UC5tigjL4SYA_nWP-E8-eiBw',
        channelName: 'Trash Tuesday',
        storeUrl: 'https://trash-tuesday.myshopify.com', // single page
    },
    {
        channelId: 'UCYCGsNTvYxfkPkfQopRMP7w',
        channelName: 'Rick Glassman',
        storeUrl: 'https://www.rickglassman.com/store', // single page 
    },
    {
        channelId: 'UCNGbPFX8UOm7qk6kvnHKr0w',
        channelName: 'Andrew Santino',
        storeUrl: 'https://www.andrewsantinostore.com', // single page
    },
    {
        channelId: 'UCLZc32yrTEMxH1ZO-6fKOzA',
        channelName: 'The Andrew Schulz',
        storeUrl: 'https://fashun.shop', // single page
    },
    {
        channelId: 'UCmUsedCabQ7ylB8mL38NYXw',
        channelName: 'King and the Sting',
        storeUrl: 'https://www.katsmerch.com', // single page 
    },
];

// add more copy this 
// {
//     channelId: '',
//     channelName: '',
//     storeUrl: '', 
// },

// comedyPodcasts.forEach(youtuber => {
//     db.query(
//         'INSERT INTO Youtubers (channel_id, channel_name, store_url) VALUES (?, ?, ?)',
//         [youtuber.channelId, youtuber.channelName, youtuber.storeUrl],(err, result) => {
//             if (err) {
//                 console.log(err);
//             }
//         }
//     )
// }); 

const app = express(); 

app.get('/', (req, res) => {
    res.json('Welcome to my Youtuber Merch Api');
});

app.get('/comedy-podcasts', (req, res) => {
    res.json(comedyPodcasts); 
});

// // fetch data from merch stores 
// app.get('/ScissorBros/products', cors(), async (req, res) => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://shop.upstatemerch.com/scissorbros/shop/home'); 
    
//     const products = await page.evaluate(() => (
//         [...document.querySelectorAll('div[class="grid-x small-up-2 medium-up-1 product-card p-a-1 p-b-2 columns-3"]')].map(item => {

//             return {
//                 id: '', 
//                 channelId: 'UCGCXWfqaovf_vI05iW6pLdA', 
//                 name: item.querySelector('p[class="product-name m14"]').textContent,
//                 price: item.querySelector('p[class="product-price ng-star-inserted"]').textContent.replace(/[\s+\$]/g, ''),
//                 imgSrc: item.querySelector('img[class="product-art-image ng-star-inserted"]').src, 
//             }
//         })
//     ));
    
//     // Each product id property is assigned a random id
//     products.forEach(product => product.id = uuidv4());

//     // Iterate through products and insert property values into table
//     insertProductData(products); 

//     res.json(products);
//     browser.close();
// });

// // extracts products from multiple pages using recursion
// app.get('/TigerBelly/products', cors(), async (req, res) => {
//     const extractProducts = async (url) => {
//         const page = await browser.newPage();
//         await page.goto(url);
//         console.log(`scraping: ${url}`); 
//         const productsOnPage = await page.evaluate(() => (
//             [...document.querySelectorAll('div[class="grid__item large--one-quarter medium--one-half"]')].map(item => {
                
//                 return {
//                     id: '', 
//                     name: item.querySelector('span[class="product-grid-title"]').textContent,
//                     price: item.querySelector('p[class="price"]').textContent,  
//                     imgSrc: item.querySelector('div[class="grid__image"] > img').src, 
//                 }
//             })
//         ));

//         // Each product id property is assigned a random id
//         productsOnPage.forEach(product => {
//             const pattern = /[A-Za-z\s+\$]/g; 
//             product.price = product.price.replace(pattern, ''); 
            
//             if (product.price.length === 10) product.price = product.price.slice(0, -5);
    
//             product.id = uuidv4(); 
//         });

//         await page.close();

//         if (productsOnPage.length < 1) {
//             return productsOnPage
//         } else {
//             const nextPageNumber = parseInt(url.match(/page=(\d+)$/)[1], 10) + 1;
//             const nextUrl = `https://tigerbelly.myshopify.com/collections/all?page=${nextPageNumber}`; 
//             return productsOnPage.concat(await extractProducts(nextUrl));
//         }
//     }
//     const browser = await puppeteer.launch();
//     const url = 'https://tigerbelly.myshopify.com/collections/all?page=1'; 
//     const products = await extractProducts(url); 

//     // Iterate through products and insert property values into table
//     insertProductData(products); 

//     res.send(products);
//     browser.close();
// });

app.listen(PORT, () => console.log(`server running on port ${PORT}`));