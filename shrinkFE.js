const puppeteer = require('puppeteer');

async function processUrl(url) {
  const LID = url.replace('https://shrinkforearn.xyz/', '');
  console.log(`Processing LID: ${LID}`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(`https://shrinkforearn.xyz/${LID}`);
    console.log('Navigated to initial URL');
    await page.waitForTimeout(4000);

    // Send ajaxCallMaker("step_1");
    await page.evaluate(() => {
      window.ajaxCallMaker('step_1');
    });
    console.log('Executed ajaxCallMaker("step_1")');

    // Get SID function
    const getSID = () => {
      const value = `: ${document.cookie}`;
      const parts = value.split(': sid=');
      if (parts.length === 2) return parts.pop().split(':').shift();
      return null;
    };

    let SID = await page.evaluate(getSID);
    console.log(`Initial SID: ${SID}`);

    if (!SID) {
      console.log('SID not found, reloading page');
      await page.reload();
      await page.waitForTimeout(4000);
      SID = await page.evaluate(getSID);
      console.log(`Reloaded SID: ${SID}`);
    }

    if (!SID) {
      throw new Error('SID not found');
    }

    // Redirect using window.location.href
    await page.evaluate((LID, SID) => {
      window.location.href = `https://shrinkforearn.in/${LID}/?sid=${SID}`;
    }, LID, SID);
    console.log(`Redirected to https://shrinkforearn.in/${LID}/?sid=${SID}`);
    await page.waitForTimeout(7000);

    let BPLink = await page.evaluate(() => {
      const element = document.querySelector("body > div.container > div > div > div.box-main > ol > div:nth-child(13)");
      return element ? element.querySelector('a')?.href : null;
    });
    console.log(`Initial BPLink: ${BPLink}`);

    if (!BPLink) {
      await page.waitForTimeout(2000);
      BPLink = await page.evaluate(() => {
        const element = document.querySelector("body > div.container > div > div > div.box-main > ol > div:nth-child(13)");
        return element ? element.querySelector('a')?.href : element.innerHTML;
      });
      console.log(`Retry BPLink: ${BPLink}`);
    }

    await browser.close();
    return BPLink;
  } catch (error) {
    console.error('Error in shrinkFE process:', error);
    await browser.close();
    throw error;
  }
}

module.exports = { processUrl };
