const express = require('express');
const axios = require('axios'); 
const app = express();

// Twój klucz API
const STEAM_API_KEY = '531A9DA59816EE4D594BD29F82EEEDE5';

app.get('/', (req, res) => res.send('API REFITV ONLINE - Gotowe na zapytania!');

// 1. LOGOWANIE STEAM
app.get('/auth/steam', (req, res) => {
  const appReturnUrl = req.query.appUrl; 
  const host = req.get('host');
  const serverReturnUrl = `https://${host}/auth/steam/return?appUrl=${encodeURIComponent(appReturnUrl)}`;
  const steamLoginUrl = `https://steamcommunity.com/openid/login?openid.ns=http://specs.openid.net/auth/2.0&openid.mode=checkid_setup&openid.return_to=${encodeURIComponent(serverReturnUrl)}&openid.realm=${encodeURIComponent(`https://${host}`)}&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select`;
  res.redirect(steamLoginUrl);
});

app.get('/auth/steam/return', (req, res) => {
  const claimedId = req.query['openid.claimed_id'];
  const appReturnUrl = req.query.appUrl;
  if (claimedId && appReturnUrl) {
    const steamId = claimedId.split('/').pop();
    res.redirect(`${appReturnUrl}?steamid=${steamId}`);
  } else {
    res.send('Blad logowania');
  }
});

// 2. WYSZUKIWARKA GRACZY (Pobiera PRAWDZIWE dane z Valve)
app.get('/api/player/:id', async (req, res) => {
  try {
    const response = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${req.params.id}`);
    const playerData = response.data.response.players[0];
    
    if (playerData) {
      res.json(playerData); // Odsyłamy dane z powrotem do telefonu
    } else {
      res.status(404).json({ error: 'Nie znaleziono gracza' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Blad polaczenia z serwerami Valve' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serwer startuje na porcie ${PORT}`));
