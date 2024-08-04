const puppeteer = require('puppeteer');

async function processUrl(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url);

    // Function to click a button every second
    const clickBtn6 = setInterval(async () => {
      try {
        await page.click('#btn6');
      } catch (e) {
        console.log('Error clicking #btn6:', e);
      }
    }, 1000);

    // Function to click a button every 5 seconds
    const clickGtelinkbtn = setInterval(async () => {
      try {
        await page.click('#gtelinkbtn');
      } catch (e) {
        console.log('Error clicking #gtelinkbtn:', e);
      }
    }, 5000);

    // Function to check the URL every 3 seconds
    const checkUrl = setInterval(async () => {
      const currentUrl = page.url();
      if (!currentUrl.startsWith('https://jaatremix.in')) {
        clearInterval(clickBtn6);
        clearInterval(clickGtelinkbtn);
        clearInterval(checkUrl);
        await browser.close();
        return currentUrl; // Return the non-matching URL
      }
    }, 3000);

    // Keep the browser running to allow intervals to work
    await new Promise((resolve) => {
      setTimeout(() => {
        clearInterval(clickBtn6);
        clearInterval(clickGtelinkbtn);
        clearInterval(checkUrl);
        resolve();
      }, 60000); // Adjust the duration as needed
    });

    await browser.close();
    return 'URL matched, process completed';
  } catch (error) {
    await browser.close();
    throw new Error(`Error processing URL: ${error.message}`);
  }
}

module.exports = { processUrl };
