const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const controlPassword = 'TIQ6CRdnqyQrkooo55Y73tko003jD5';

app.get('/api/bypass', async (req, res) => {
  const { password, url } = req.query;

  console.log(`Received request with password: ${password} and url: ${url}`);

  if (password !== controlPassword) {
    console.log('Password did not match');
    return res.status(403).json({ s: false, r: 'Password did not match' });
  }

  if (!url || !url.startsWith('https://shrinkforearn.xyz')) {
    console.log('Invalid URL');
    return res.status(400).json({ s: false, r: 'Invalid URL' });
  }

  try {
    const shrinkFE = require('./shrinkFE');
    const result = await shrinkFE.processUrl(url);
    console.log('Processed URL successfully, result:', result);
    res.json({ s: true, r: result });
  } catch (error) {
    console.error('Error occurred while processing the URL:', error);
    res.status(500).json({ s: false, r: 'An error occurred while processing the URL' });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
