window.onload = loadData();
var data;

function loadData() {
    $.getJSON("./rawdata.json", function(json) {
    data = json;
    });
}