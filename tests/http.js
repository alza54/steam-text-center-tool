const http = require('http');

const app = new http.Server();

app.on('request', (req, res) => {
  console.log("pwned!: " + req.connection.remoteAddress);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Hello World');
  res.end('\n');
});

app.listen(1337, () => {
  console.log(`listening`);
});
