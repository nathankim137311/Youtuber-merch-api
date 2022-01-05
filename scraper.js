const puppeteer = require('puppeteer');
const { comedyPodcasts } = require('./comedyPodcasts'); 
const { db } = require('./database');
const { v4: uuidv4 } = require('uuid');

function insertComedyPodcasts() {
    comedyPodcasts.forEach(channel => {
        db.query(
            'INSERT INTO ComedyPodcasts (channel_id, channel_name, store_url) VALUES (?, ?, ?)',
            [channel.channelId, channel.channelName, channel.storeUrl],(err, result) => {
                if (err) {
                    console.log(err);
                }
            }
        )
    }); 
}

// insert data into table Merch
function insertProductData(products) {
    products.forEach(product => {
        db.query(
            'INSERT INTO Products (product_id, channel_id, channel_name, title, price, img_url) VALUES (?, ?, ?, ?, ?, ?)',
            [product.id, product.channelId, product.channelName, product.title, product.price, product.imgSrc],(err, result) => {
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
                    channelName: 'TigerBelly',
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

async function YourMomsHousePodcast() {
    const extractProducts = async (url) => {
        const page = await browser.newPage();
        await page.goto(url);
        console.log(`scraping: ${url}`);
        
        const productsOnPage = await page.evaluate(() => {
            return [...document.querySelectorAll('figure.product-grid-item--center')].map(element => {
                return {
                    id: '',
                    channelId: 'UCYIgiXwJck_Pb5Nj-wIrsqg',
                    channelName: 'YourMomsHousePodcast',
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
    insertProductData(products); 

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
                    channelId: 'UCzQUP1qoWDoEbmsQxvdjxgQ', 
                    channelName: 'PowerfulJRE',
                    title: element.querySelector('div.product-card__name').textContent,
                    price: element.querySelector('div.product-card__price').textContent.replace(/[From\n\s+\$]/g, ''),
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

    // Iterate through products and insert property values into table
    insertProductData(products); 

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
                    channelId: 'UCTeIxzkL9QZ2noyLVUNfXJg',
                    channelName: 'ChrisDelia',
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

    // Iterate through products and insert property values into table
    insertProductData(products); 
    
    console.log(products);
    console.log(products.length);

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
        return [...document.querySelectorAll('div.grid-x.small-up-2.medium-up-1.product-card.p-a-1.p-b-2.columns-3')].map(element => {
            return {
                id: '',
                channelId: 'UCGCXWfqaovf_vI05iW6pLdA',
                channelName: 'ScissorBros', 
                title: element.querySelector('p.product-name').textContent,
                price: element.querySelector('p.product-price').textContent.replace(/[\$\s+]/g,''),
                imgSrc: element.querySelector('div.product-image-wrap > img').src,
            }
        });
    });; 

    products.forEach(product => product.id = uuidv4());

    insertProductData(products);

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
                channelId: 'UC5AQEUAwCh1sGDvkQtkDWUQ', 
                channelName: 'TheoVon',
                title: element.querySelector('h2.ProductItem__Title > a').textContent,
                price: element.querySelector('span.ProductItem__Price').textContent.replace(/\$/g, ''),
                imgSrc: element.querySelectorAll('img.ProductItem__Image')[0].currentSrc,
            }
        });
    });

    products.forEach(product => product.id = uuidv4());

    insertProductData(products);

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
                channelId: 'UC6AbsTfBMQ_dHjtipwh3bZg',
                channelName: 'TheFighterandTheKid', 
                title: element.querySelector('div.product-block__title').textContent,
                price: element.querySelector('span.product-price__item').textContent.replace(/\$/g, ''),
                imgSrc: element.querySelector('img.rimage__image').currentSrc,
            }
        });
    });; 

    products.forEach(product => product.id = uuidv4());

    insertProductData(products);

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
                channelId: 'UC5tigjL4SYA_nWP-E8-eiBw', 
                channelName: 'TrashTuesday',
                title: element.querySelector('p.product-item__title').textContent,
                price: element.querySelector('p.product-item__price-wrapper').textContent.replace(/[A-Za-z\n\s+\$]/g, ''),
                imgSrc: element.querySelector('img.product-item__image').currentSrc,
            }
        });
    });; 

    products.forEach(product => product.id = uuidv4());

    insertProductData(products);

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
                channelId: 'UCZa3lYPi8caXYxl5DeIzJgg', 
                channelName: 'WhitneyCummings',
                title: element.querySelector('p.h5--accent.strong.name_wrapper').textContent.trim(),
                price: element.querySelector('span.money').textContent.replace(/\$/g, ''),
                imgSrc: element.querySelector('img.fade-in.lazyautosizes.lazyloaded').currentSrc,
            }
        });
    });; 

    products.forEach(product => product.id = uuidv4());

    insertProductData(products);

    console.log(products); 
    console.log(products.length); 

    browser.close(); 
}

async function AndrewSantino() {
    const browser = await puppeteer.launch();
    const url = 'https://www.andrewsantinostore.com/';
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

        return [...document.querySelectorAll('div.product-list-item')].map(element => {
            return {
                id: '',
                channelId: 'UCNGbPFX8UOm7qk6kvnHKr0w', 
                channelName: 'AndrewSantino',
                title: element.querySelector('h4.product-list-item-title').textContent,
                price: element.querySelector('p.product-list-item-price > span') === null ? '' : element.querySelector('p.product-list-item-price > span').textContent.replace(/\$/g, ''),
                imgSrc: element.querySelector('a img').src,
            }
        });
    });; 

    products.forEach(product => product.id = uuidv4());

    insertProductData(products);

    console.log(products); 
    console.log(products.length); 

    browser.close();
}

async function AndrewSchulz() {
    const browser = await puppeteer.launch();
    const url = 'https://fashun.shop/collections/season-03';
    const page = await browser.newPage();
    await page.goto(url);
    console.log(`scraping: ${url}`);

    const products = await page.evaluate(() => {
        return [...document.querySelectorAll('div.grid__item.small--one-whole.medium--one-half.large--one-quarter.wow.fadeInUp')].map(element => {
            return {
                id: '',
                channelId: 'UCLZc32yrTEMxH1ZO-6fKOzA',
                channelName: 'TheAndrewSchulz',
                title: element.querySelector('div.product-grid--title > a').textContent,
                price: element.querySelector('span.money').textContent.replace(/\$/g, ''),
                imgSrc: element.querySelector('div.lazyload-wrapper > img').src,
            }
        });
    });; 

    products.forEach(product => product.id = uuidv4());

    insertProductData(products);

    console.log(products); 
    console.log(products.length); 

    browser.close();    
}

// multi page and scroll to load images
async function Kats() {
    const extractProducts = async (url) => {
        const page = await browser.newPage();
        await page.goto(url);
        console.log(`scraping: ${url}`); 
        const productsOnPage = await page.evaluate(async () => {
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
                    channelId: 'UCmUsedCabQ7ylB8mL38NYXw', 
                    channelName: 'KingandtheSting',
                    title: element.querySelector('h2.ProductItem__Title.Heading > a').textContent,
                    price: element.querySelector('div.ProductItem__PriceList.Heading > span').textContent.replace(/\$/g, ''),
                    imgSrc: element.querySelectorAll('div.AspectRatio.AspectRatio--withFallback > img')[0].dataset.src,
                }
            })
        });

        // Each product id property is assigned a random id
        productsOnPage.forEach(product => product.id = uuidv4());

        await page.close();

        if (productsOnPage.length < 1) {
            return productsOnPage
        } else {
            const nextPageNumber = parseInt(url.match(/page=(\d+)$/)[1], 10) + 1;
            const nextUrl = `https://www.katsmerch.com/collections/shop-all?page=${nextPageNumber}`; 
            return productsOnPage.concat(await extractProducts(nextUrl));
        }
    }
    const browser = await puppeteer.launch();
    const url = 'https://www.katsmerch.com/collections/shop-all?page=1'; 
    const products = await extractProducts(url); 

    console.log(products);
    console.log(products.length);

    // Iterate through products and insert property values into table
    insertProductData(products); 

    browser.close();
}

function insertAllChannels() {
    tigerBelly(); 
    YourMomsHousePodcast();
    PowerfulJRE();
    ChrisDelia();
    ScissorBros();
    TheoVon();
    Tfatk();
    TrashTuesday();
    WhitneyCummings();
    AndrewSantino(); 
    AndrewSchulz();
    Kats();
}

// insertComedyPodcasts();
// insertAllChannels();