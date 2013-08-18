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

var date1 = new Date(2013, 6, 27),
	date2 = new Date(2013, 7, 27),
	date3 = new Date(2013, 7, 20)


server.listen(13373, "127.0.0.1");
console.log('Server running at http://127.0.0.1:13373/');
function getTrackInfoJson() {
    if (path == "options")
        return { "dates": [{'bounds':{"min":date1, "max":date2}, 'selected':{'min':date3, 'max':date2}}], "devices": [{"value":"iPad3", "selected": false}, {"value":"iPad4", "selected": true}, {"value":"iPad2", "selected": true}]};
    else if (path == "dau")
        return {"dau": [{"key": {"date": date1, "device":"iPad3"}, "val": 400}, {"key": {"date": date2, "device":"iPad4"}, "val": 1000}, {"key": {"date": date2, "device":"iPad3"}, "val": 2000}]};
    else if (path == "dnu")
        return {"dnu": [{"key": {"date": date1, "device":"iPad3"}, "val": 200}, {"key": {"date": date2, "device":"iPad4"}, "val": 400}, {"key": {"date": date2, "device":"iPad3"}, "val": 100}]};
}