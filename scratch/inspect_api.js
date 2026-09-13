const https = require('https');

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
  // Test if there are api routes or _next data
  const res = await testFetch('https://pocketdm.com.br/monstros');
  console.log('Status:', res.status);
  
  // Look for buildId or data script tags
  const buildIdMatch = res.body.match(/"buildId":"([^"]+)"/);
  console.log('Build ID:', buildIdMatch ? buildIdMatch[1] : 'not found');

  const jsonMatches = res.body.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (jsonMatches) {
    console.log('Found __NEXT_DATA__ length:', jsonMatches[1].length);
    const parsed = JSON.parse(jsonMatches[1]);
    console.log('Page Props keys:', Object.keys(parsed.props?.pageProps || {}));
    if (parsed.props?.pageProps?.monsters) {
      console.log('Monsters count in pageProps:', parsed.props.pageProps.monsters.length);
      console.log('Sample monster:', JSON.stringify(parsed.props.pageProps.monsters[0], null, 2));
    }
  } else {
    // Check if other scripts or data exist
    const scripts = res.body.match(/<script[^>]*src="([^"]+)"/g);
    console.log('Scripts:', scripts ? scripts.slice(0, 5) : 'none');
  }
}

run();
