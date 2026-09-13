const fs = require('fs');

const raw = fs.readFileSync('scratch/monstros_page.html', 'utf8');

// Look for monster json objects or table/card markup
console.log('HTML preview around aboleth:');
const abolethIdx = raw.indexOf('aboleth');
if (abolethIdx !== -1) {
  console.log(raw.substring(abolethIdx - 100, abolethIdx + 500));
}

// Let's check flight data
const flight = fs.readFileSync('scratch/flight_data.txt', 'utf8');
const sampleIdx = flight.indexOf('Aboleth');
if (sampleIdx !== -1) {
  console.log('\nFlight preview around Aboleth:');
  console.log(flight.substring(sampleIdx - 100, sampleIdx + 500));
}
