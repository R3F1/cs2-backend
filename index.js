const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('<h1>Serwer CS2 REFITV Dziala!</h1>');
});

app.get('/auth/steam', (req, res) => {
  const appReturnUrl = req.query.appUrl; 
  const host = req.get('host'); // Tu bedzie Twoja domena refitv.pl
  const serverReturnUrl = `https://${host}/auth/steam/return?appUrl=${encodeURIComponent(appReturnUrl)}`;

  const steamLoginUrl = `https://steamcommunity.com/openid/login?openid.ns=http://specs.openid.net/auth/2.0&openid.mode=checkid_setup&openid.return_to=${encodeURIComponent(serverReturnUrl)}&openid.realm=${encodeURIComponent(`https://${host}`)}&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select`;

  res.redirect(steamLoginUrl);
});

app.get('/auth/steam/return', (req, res) => {
  const claimedId = req.query['openid.claimed_id'];
  const appReturnUrl = req.query.appUrl;

  if (claimedId && appReturnUrl) {
    const steamId = claimedId.split('/').pop();
    const finalRedirectUrl = `${appReturnUrl}?steamid=${steamId}`;
    res.redirect(finalRedirectUrl);
  } else {
    res.send('Blad: Brak danych ze Steam.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer biega na porcie ${PORT}`);
});
