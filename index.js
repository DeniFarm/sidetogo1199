const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const controlPassword = 'TIQ6CRdnqyQrkooo55Y73tko003jD5';

app.get('/api/bypass', async (req, res) => {
  const { password, url } = req.query;

  if (password !== controlPassword) {
    return res.status(403).json({ s: false, r: 'Password did not match' });
  }

  if (!url) {
    return res.status(400).json({ s: false, r: 'URL is required' });
  }

  try {
    let result;
    if (url.startsWith('https://shrinkforearn.xyz')) {
      const shrinkFE = require('./shrinkFE');
      result = await shrinkFE.processUrl(url);
    } else if (url.startsWith('https://link.evolinks.in')) {
      const evo = require('./evo');
      result = await evo.processUrl(url);
    } else  {
      throw error
    }
    res.json({ s: true, r: result });
  } catch (error) {
    res.status(500).json({ s: false, r: `An error occurred while processing the URL: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
