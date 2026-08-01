require('dotenv').config({path: '.env.local'});
fetch(`https://feed.linkmydeals.com/getOffers/?API_KEY=${process.env.LINKMYDEALS_API_KEY}&format=json`)
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d.offers?.slice(0, 2) || d.Offers?.slice(0, 2), null, 2)));
