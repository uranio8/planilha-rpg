const https = require('https');
const fs = require('fs');

async function testFetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: data });
      });
    }).on('error', reject);
  });
}

async function run() {
  const res = await testFetch('https://pocketdm.com.br/monstros');
  fs.writeFileSync('scratch/monstros_page.html', res.body, 'utf8');
  console.log('Saved page, length:', res.body.length);
  
  // Look for self.__next_f.push or similar flight data in Next.js app router
  const flightMatches = res.body.match(/self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g);
  console.log('Flight matches count:', flightMatches ? flightMatches.length : 0);
  
  if (flightMatches) {
    let combined = '';
    flightMatches.forEach(fm => combined += fm);
    fs.writeFileSync('scratch/flight_data.txt', combined, 'utf8');
    console.log('Saved flight data, length:', combined.length);
  }
}

run();
