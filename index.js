const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const controlPassword = 'TIQ6CRdnqyQrkooo55Y73tko003jD5';

app.use(bodyParser.json());

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
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForTimeout(t * 1000); // Wait for the specified time
    const screenshot = await page.screenshot({ encoding: 'base64' });
    await browser.close();
    res.send(`<img src="data:image/png;base64,${screenshot}" />`);
  } catch (error) {
    res.status(500).send('An error occurred while taking the screenshot');
  }
});

app.get('/control', async (req, res) => {
  const password = req.query.pass;
  if (password !== controlPassword) {
    return res.status(403).send('Password did not match');
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.google.com');

    // Use WebSocket to enable DevTools and remote debugging
    const browserWSEndpoint = browser.wsEndpoint();
    const devtoolsURL = `https://chrome-devtools-frontend.appspot.com/serve_file/@e73b499c06e4bc55f909d14353f7f30f8d58e28b/inspector.html?ws=${browserWSEndpoint.split('//')[1]}`;

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Browser Control</title>
      </head>
      <body>
        <h1>Browser Control</h1>
        <iframe id="browser" src="${devtoolsURL}" width="100%" height="800"></iframe>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send('An error occurred while launching the browser');
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
