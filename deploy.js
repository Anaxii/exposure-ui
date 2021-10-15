let express = require('express');
let app = express();

// Middleware for serving '/dist' directory
const staticFileMiddleware = express.static('dist');

app.use(staticFileMiddleware);

app.listen(3001, function () {
    console.log('Example app listening on port 3000!');
});