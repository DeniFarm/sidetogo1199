const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const app = express();
const port = process.env.PORT || 3000;

puppeteer.use(StealthPlugin());

app.get('/take/screenshot', async (req, res) => {
  const url = req.query.url;
  const t = parseInt(req.query.t) || 0; // Get the delay time in seconds, default is 0 if not provided

  if (!url) {
    return res.status(400).send('URL is required');
  }

  if (isNaN(t) || t < 0) {
    return res.status(400).send('Invalid delay time');
  }

  try {
    const browser = await puppeteer.launch(
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    );
    const page = await browser.newPage();
    page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url);
    await page.waitForTimeout(t * 1000); // Wait for the specified time
    const screenshot = await page.screenshot({ encoding: 'base64' });
    await browser.close();
    res.send(`<img src="data:image/png;base64,${screenshot}" />`);
  } catch (error) {
    res.status(500).send('An error occurred while taking the screenshot');
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
