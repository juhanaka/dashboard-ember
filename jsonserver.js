var http = require('http');
var sys = require('sys');
var server = http.createServer(function(req, res) {

if(req.url) {

console.log(req.url);
path = req.url.split("/")[1];
console.log(path);
res.writeHead(200, {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*"
});
res.end(JSON.stringify(getTrackInfoJson()));
} 
});
server.listen(13373, "127.0.0.1");
console.log('Server running at http://127.0.0.1:13373/');
function getTrackInfoJson() {
    if (path == "options")
        return { "dates": [{"value":1, "selected": false}, {"value":3, "selected": true}, {"value":7, "selected": true}, {"value":14, "selected": true}, {"value":30, "selected": true}]};
    else if (path == "dau")
        return {"dau": [{"key": {"date": 1, "device":"iPad3"}, "val": 500}, {"key": {"date": 1, "device":"iPad4"}, "val": 1000}, {"key": {"date": 2, "device":"iPad3"}, "val": 2000}]};
    else if (path == "dnu")
        return {"dnu": [{"key": {"date": 1}, "val": 1000}]};
}