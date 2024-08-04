const puppeteer = require('puppeteer');

async function processUrl(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url);

    // Function to click the #btn6 button every second
    const clickBtn6 = async () => {
      await page.evaluate(() => {
        const btn = document.querySelector("#btn6");
        if (btn) btn.click();
      });
    };

    // Function to click the #gtelinkbtn button every 5 seconds
    const clickGteLinkBtn = async () => {
      await page.evaluate(() => {
        const gteLinkBtn = document.querySelector("#gtelinkbtn");
        if (gteLinkBtn) gteLinkBtn.click();
      });
    };

    // Function to check the URL every 3 seconds
    const checkUrl = async () => {
      const currentUrl = page.url();
      if (!currentUrl.startsWith("https://jaatremix.in")) {
        return currentUrl;
      }
      return null;
    };

    let resultUrl = null;
    const interval1 = setInterval(clickBtn6, 1000);
    const interval2 = setInterval(clickGteLinkBtn, 5000);
    const interval3 = setInterval(async () => {
      resultUrl = await checkUrl();
      if (resultUrl) {
        clearInterval(interval1);
        clearInterval(interval2);
        clearInterval(interval3);
        await browser.close();
        return resultUrl;
      }
    }, 3000);

    await new Promise((resolve) => {
      const checkCompletion = setInterval(() => {
        if (resultUrl) {
          clearInterval(checkCompletion);
          resolve();
        }
      }, 1000);
    });

    return resultUrl;
  } catch (error) {
    await browser.close();
    throw error;
  }
}

module.exports = { processUrl };
