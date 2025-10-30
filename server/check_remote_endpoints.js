const axios = require('axios');
const base = 'https://back-end-aura-hubb-production.up.railway.app/api';

async function check() {
  try {
    console.log('Checking remote', base);
    for (const path of ['health','test','usuarios']) {
      try {
        const res = await axios.get(`${base}/${path}`, { timeout: 10000 });
        console.log(`--- OK GET /${path} ---`);
        console.log(JSON.stringify(res.data, null, 2));
      } catch (err) {
        console.log(`--- ERROR GET /${path} ---`);
        if (err.response) {
          console.log('status:', err.response.status);
          console.log('data:', err.response.data);
        } else {
          console.log('error:', err.message);
        }
      }
    }
  } catch (e) {
    console.error('fatal', e);
  }
}

check();
