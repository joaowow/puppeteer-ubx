/**
 * @fileoverview Search taylorfrancis.com for "Engineer" and
 * display total result count and scrape results.
 */

const puppeteer = require('puppeteer');

(async() => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Go to taylorfrancis.com
    await page.goto('https://taylorfrancis.com/');

    // Wait for search bar to load and click it.
    await page.waitForSelector('.jumbotron > .text-center > .search-bar > .form-group > #searchTerm');
    await page.click('.jumbotron > .text-center > .search-bar > .form-group > #searchTerm');
    // Type 'Engineer' into the search bar and click the search button.
    await page.keyboard.type('Engineer');
    await page.click('.jumbotron > .text-center > .search-bar > .text-left > a > #searchButton');

    // Grab result-count from Results page
    await page.waitForSelector('span.result-count');
    const resultCount = await page.$eval('span.result-count', e => e.innerHTML);
    // and display resultCount.
    console.log('Number of results: ' + resultCount);

    // Wait for first search result to load, display title.
    const resultTitle = await page.$eval('.product-banner-title', e => e.innerHTML);
    console.log('First title: ' + resultTitle);

    // Click on Load More results.
    const loadMore = '.search-result-container > search-results-container > div > .button-center > .btn-primary';
    await page.waitForSelector(loadMore);
    await page.click(loadMore);
    // Load More is not working...

    // Wait for the results to load.
    const resultsSelector = 'a.product-banner-title';
    await page.waitForSelector(resultsSelector);

    // Get number of Anchors.
    const anchorsLength = await page.evaluate(resultsSelector => {
        const anchors = Array.from(document.querySelectorAll(resultsSelector));
        const halfAnchors = anchors.splice(0, Math.floor(anchors.length / 2));
        return halfAnchors.length;
    }, resultsSelector);
    console.log('Anchor count: ' + anchorsLength);

    // Extract the results from the page.
    const links = await page.evaluate(resultsSelector => {
        const anchors = Array.from(document.querySelectorAll(resultsSelector));
        const halfAnchors = anchors.splice(0, Math.floor(anchors.length / 2));
        return halfAnchors.map(anchor => {
            const title = anchor.textContent.split('|')[0].trim();
            return `${title} - ${anchor.href}`;
        });
    }, resultsSelector);
    console.log('Title - Link \n');
    console.log(links.join('\n'));

    await browser.close();

})();