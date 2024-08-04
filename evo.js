const puppeteer = require('puppeteer');

async function processUrl(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url);

    // Function to click the #btn6 button every second
    const clickBtn6 = () => page.evaluate(() => {
      const btn = document.querySelector("#btn6");
      if (btn) btn.click();
    });

    // Function to click the #gtelinkbtn button every 5 seconds
    const clickGteLinkBtn = () => page.evaluate(() => {
      const btn = document.querySelector("#gtelinkbtn");
      if (btn) btn.click();
    });

    // Function to check the URL every 3 seconds
    const checkUrl = async () => {
      const currentUrl = page.url();
      if (!currentUrl.startsWith('https://jaatremix.in')) {
        return currentUrl;
      }
      return null;
    };

    // Start interval functions
    const btn6Interval = setInterval(clickBtn6, 1000);
    const gteLinkBtnInterval = setInterval(clickGteLinkBtn, 5000);
    const urlCheckInterval = setInterval(async () => {
      const newUrl = await checkUrl();
      if (newUrl) {
        clearInterval(btn6Interval);
        clearInterval(gteLinkBtnInterval);
        clearInterval(urlCheckInterval);
        await browser.close();
        return newUrl;
      }
    }, 3000);

    // Wait until the urlCheckInterval finds a new URL or process is manually stopped
    const finalUrl = await new Promise((resolve) => {
      const checkResult = setInterval(async () => {
        const newUrl = await checkUrl();
        if (newUrl) {
          clearInterval(checkResult);
          resolve(newUrl);
        }
      }, 1000);
    });

    return finalUrl;
  } catch (error) {
    await browser.close();
    throw error;
  }
}

module.exports = { processUrl };
