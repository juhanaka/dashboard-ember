var http = require('http');
var sys = require('sys');
var server = http.createServer(function(req, res) {

if(req.url) {
var urli = req.url;
//callBack = urli.split("?")[1].slice(6);
//console.log(callBack);
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
return { "values": [{"value":1, "selected": false}, {"value":3, "selected": true}, {"value":7, "selected": true}, {"value":14, "selected": true}, {"value":30, "selected": true}]};
}