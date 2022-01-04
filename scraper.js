const puppeteer = require('puppeteer');
// const { db } = require('./database');
const { v4: uuidv4 } = require('uuid');

// insert data into table Merch
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

// multiple pages 
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
    // insertProductData(products); 

    browser.close();
}

async function YourMomsHousePodcast() {
    const extractProducts = async (url) => {
        const page = await browser.newPage();
        await page.goto(url);
        console.log(`scraping: ${url}`);
        
        const productsOnPage = await page.evaluate(() => {
            return [...document.querySelectorAll('figure.product-grid-item--center')].map(element => {
                return {
                    id: '',
                    title: element.querySelector('figcaption a').textContent,
                    price: element.querySelector('figcaption span.money').textContent.replace(/\$/g, ''), 
                    imgSrc: element.querySelector('img.product_card__image') === null ? '' : element.querySelector('img.product_card__image').getAttribute('data-fallback'), 
                }
            });
        });
            
        productsOnPage.forEach(product => product.id = uuidv4());

        await page.close();

        if (productsOnPage.length < 1) {
            return productsOnPage
        } else {
            const nextPageNumber = parseInt(url.match(/page=(\d+)$/)[1], 10) + 1;
            const nextUrl = `https://store.ymhstudios.com/collections/all-products?page=${nextPageNumber}`; 
            return productsOnPage.concat(await extractProducts(nextUrl));
        }
    }
    const browser = await puppeteer.launch();
    const url = 'https://store.ymhstudios.com/collections/all-products?page=1';
    const products = await extractProducts(url); 

    // Iterate through products and insert property values into table
    // insertProductData(products); 

    console.log(products.length);

    browser.close();
}

async function PowerfulJRE() {
    const extractProducts = async (url) => {
        const page = await browser.newPage();
        await page.goto(url);
        console.log(`scraping: ${url}`);
        
        const productsOnPage = await page.evaluate(() => {
            return [...document.querySelectorAll('a.product-card')].map(element => {
                return {
                    id: '',
                    title: element.querySelector('div.product-card__name').textContent,
                    price: element.querySelector('div.product-card__price').textContent.replace(/[\n\s+\$]/g, ''),
                    imgSrc: element.querySelector('img.product-card__image').src, 
                }
            });
        });
            
        productsOnPage.forEach(product => product.id = uuidv4());

        await page.close();

        if (productsOnPage.length < 1) {
            return productsOnPage
        } else {
            const nextPageNumber = parseInt(url.match(/page=(\d+)$/)[1], 10) + 1;
            console.log(nextPageNumber);
            const nextUrl = `https://www.higherprimate.com/collections/all-products?page=${nextPageNumber}`; 
            return productsOnPage.concat(await extractProducts(nextUrl));
        }
    }
    const browser = await puppeteer.launch();
    const url = 'https://www.higherprimate.com/collections/all-products?page=1';
    const products = await extractProducts(url); 

    console.log(products); 
    console.log(products.length); 

    browser.close(); 
}

async function ChrisDelia() {
    const extractProducts = async (url) => {
        const page = await browser.newPage();
        await page.goto(url);
        console.log(`scraping: ${url}`); 
        const productsOnPage = await page.evaluate(() => (
            [...document.querySelectorAll('div.grid_wrapper.product-loop > div')].map(item => {
                
                return {
                    id: '', 
                    title: item.querySelector('a.js-product-details-link > h3').textContent,
                    price: item.querySelector('span.price-item.price-item--regular').textContent.replace(/[\n\$]/g, ''),
                    imgSrc: item.querySelector('div.box-ratio > img').getAttribute('data-original'), 
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
            const nextUrl = `https://store.chrisdelia.com/collections/shop-all?page=${nextPageNumber}`; 
            return productsOnPage.concat(await extractProducts(nextUrl));
        }
    }
    const browser = await puppeteer.launch();
    const url = 'https://store.chrisdelia.com/collections/shop-all?page=1'; 
    const products = await extractProducts(url); 
    
    console.log(products);
    console.log(products.length);
    // Iterate through products and insert property values into table
    // insertProductData(products); 

    browser.close();
}

// single page
async function ScissorBros() {
    const browser = await puppeteer.launch();
    const url = 'https://shop.upstatemerch.com/scissorbros/shop/home?page=1';
    const page = await browser.newPage();
    await page.goto(url);
    console.log(`scraping: ${url}`);

    const products = await page.evaluate(() => {
        return [...document.querySelectorAll('div[class="grid-x small-up-2 medium-up-1 product-card p-a-1 p-b-2 columns-3"]')].map(element => {
            return {
                id: '',
                title: element.querySelector('p.product-name').textContent,
                price: element.querySelector('p.product-price').textContent.replace(/[\$\s+]/g,''),
                imgSrc: element.querySelector('div.product-image-wrap > img').src,
            }
        });
    });; 

    products.forEach(product => product.id = uuidv4());

    console.log(products); 
    console.log(products.length); 

    browser.close(); 
}

// single page, need to scroll to load more images
async function TheoVon() {
    const browser = await puppeteer.launch({
        headless: false, // different behaviors if true or false, why? 
    });
    const url = 'https://www.theovonstore.com/collections/shop-all?page=1';
    const page = await browser.newPage();
    await page.goto(url);

    console.log(`scraping: ${url}`);

    const products = await page.evaluate(async () => {
        // scroll to the bottom of the page
        const distance = 300;
        const delay = 100;
        while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
            document.scrollingElement.scrollBy(0, distance);
            await new Promise(resolve => { setTimeout(resolve, delay); });
        }

        return [...document.querySelectorAll('div.ProductItem')].map(element => {

            return {
                id: '',
                title: element.querySelector('h2.ProductItem__Title > a').textContent,
                price: element.querySelector('span.ProductItem__Price').textContent.replace(/\$/g, ''),
                imgSrc: element.querySelectorAll('img.ProductItem__Image')[0].currentSrc,
            }
        });
    });

    products.forEach(product => product.id = uuidv4());

    console.log(products); 
    console.log(products.length); 

    browser.close();
}

async function Tfatk() {
    const browser = await puppeteer.launch({
        headless: true,
    });
    const url = 'https://thefighterandthekidshop.com/collections/sale-home-page';
    const page = await browser.newPage();
    await page.goto(url);
    console.log(`scraping: ${url}`);

    const products = await page.evaluate(async () => {
        // scroll to the bottom of the page
        const distance = 300;
        const delay = 100;
        while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
            document.scrollingElement.scrollBy(0, distance);
            await new Promise(resolve => { setTimeout(resolve, delay); });
        }

        return [...document.querySelectorAll('div.product-block')].map(element => {
            return {
                id: '',
                title: element.querySelector('div.product-block__title').textContent,
                price: element.querySelector('span.product-price__item').textContent.replace(/\$/g, ''),
                imgSrc: element.querySelector('img.rimage__image').currentSrc,
            }
        });
    });; 

    products.forEach(product => product.id = uuidv4());

    console.log(products); 
    console.log(products.length); 

    browser.close();
}

async function TrashTuesday() {
    const browser = await puppeteer.launch();
    const url = 'https://trash-tuesday.myshopify.com';
    const page = await browser.newPage();
    await page.goto(url);
    console.log(`scraping: ${url}`);

    const products = await page.evaluate(async () => {
        // scroll to the bottom of the page
        const distance = 300;
        const delay = 100;
        while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
            document.scrollingElement.scrollBy(0, distance);
            await new Promise(resolve => { setTimeout(resolve, delay); });
        }

        return [...document.querySelectorAll('div.product-item')].map(element => {
            return {
                id: '',
                title: element.querySelector('p.product-item__title').textContent,
                price: element.querySelector('p.product-item__price-wrapper').textContent.replace(/[A-Za-z\n\s+\$]/g, ''),
                imgSrc: element.querySelector('img.product-item__image').currentSrc,
            }
        });
    });; 

    products.forEach(product => product.id = uuidv4());

    console.log(products); 
    console.log(products.length); 

    browser.close();
}

async function WhitneyCummings() {
    const browser = await puppeteer.launch();
    const url = 'https://store.whitneycummings.com/collections/shop-all';
    const page = await browser.newPage();
    await page.goto(url);
    console.log(`scraping: ${url}`);

    const products = await page.evaluate(async () => {
        // scroll to the bottom of the page
        const distance = 300;
        const delay = 100;
        while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
            document.scrollingElement.scrollBy(0, distance);
            await new Promise(resolve => { setTimeout(resolve, delay); });
        }

        return [...document.querySelectorAll('div.grid__item.small--one-half.medium--one-half.large--one-third.product-grid-item')].map(element => {
            return {
                id: '',
                title: element.querySelector('p.h5--accent.strong.name_wrapper').textContent.trim(),
                price: element.querySelector('span.money').textContent.replace(/\$/g, ''),
                imgSrc: element.querySelector('img.fade-in.lazyautosizes.lazyloaded').currentSrc,
            }
        });
    });; 

    products.forEach(product => product.id = uuidv4());

    console.log(products); 
    console.log(products.length); 

    browser.close(); 
}

WhitneyCummings();

// multi page function template 
// async function name() {
//     const extractProducts = async (url) => {
//         const page = await browser.newPage();
//         await page.goto(url);
//         console.log(`scraping: ${url}`); 
//         const productsOnPage = await page.evaluate(() => (
//             [...document.querySelectorAll('')].map(item => {
                
//                 return {
//                     id: '', 
//                     title: '',
//                     price: '',
//                     imgSrc: '',
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
//             const nextUrl = `url?page=${nextPageNumber}`; 
//             return productsOnPage.concat(await extractProducts(nextUrl));
//         }
//     }
//     const browser = await puppeteer.launch();
//     const url = 'url'; 
//     const products = await extractProducts(url); 

//     // Iterate through products and insert property values into table
//     // insertProductData(products); 

//     browser.close();
// }


// single page function template 
// async function name() {
//     const browser = await puppeteer.launch();
//     const url = 'url';
//     const page = await browser.newPage();
//     await page.goto(url);
//     console.log(`scraping: ${url}`);

//     const products = await page.evaluate(() => {
//         return [...document.querySelectorAll('')].map(element => {
//             return {
//                 id: '',
//                 title: element.querySelector('').textContent,
//                 price: element.querySelector('').textContent,
//                 imgSrc: element.querySelector('').src,
//             }
//         });
//     });; 

//     products.forEach(product => product.id = uuidv4());

//     console.log(products); 
//     console.log(products.length); 

//     browser.close();
// }

