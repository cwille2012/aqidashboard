var RESULTS_URL = 'http://localhost:9600/data/results.json';
var TEXT_URL = 'http://localhost:9600/data/purchasing.json';

/*getJSON(TEXT_URL, function(err, data) {
    var textObj = JSON.parse(data);

    document.getElementById('purchase-2-h1').innerHTML = textObj['purchase-2']['purchase-2-h1'];
    document.getElementById('purchase-2-h1').innerHTML = textObj['purchase-2']['purchase-2-p'];

    document.getElementById('purchase-3-h1').innerHTML = textObj['purchase-3']['purchase-3-h1'];
    document.getElementById('purchase-3-h1').innerHTML = textObj['purchase-3']['purchase-3-p'];

    document.getElementById('purchase-4-h1').innerHTML = textObj['purchase-4']['purchase-4-h1'];
    document.getElementById('purchase-4-h1').innerHTML = textObj['purchase-4']['purchase-4-p'];
    
});*/
function loadResults(){
    loadResultsRepeat();
    setInterval(function() {
        loadResultsRepeat();
    }, 1 * 1000); //every 1s
}

function loadResultsRepeat(){
    $.getJSON(RESULTS_URL, function(data) {
        var RESULTS_OBJ = data;

        var purchasePage = !!document.getElementById('purchase-1');
        if (purchasePage == true) {

            document.getElementById('purchase-1-h1').innerHTML = "Alternative Products";
            document.getElementById('purchase-1-p').innerHTML = "Here is a list of cheaper alternatives based on your most recent search"

            document.getElementById('purchase-2').innerHTML = "";

            for (var key in RESULTS_OBJ) {
                var name = RESULTS_OBJ[key]['name'];
                var shop = RESULTS_OBJ[key]['shop'];
                var price = RESULTS_OBJ[key]['price'];
                var link = RESULTS_OBJ[key]['link'];

                var div = document.createElement("div");
                div.setAttribute("id", key);
                div.style.marginBottom = "15px";

                var h5 = document.createElement("h5");
                h5.innerHTML = name;
                h5.style.marginBottom = "0";
                div.appendChild(h5);

                var p1 = document.createElement("p");
                p1.innerHTML = 'Seller: ' + shop;
                p1.style.marginTop = "0";
                p1.style.marginBottom = "0";
                div.appendChild(p1);

                var p2 = document.createElement("p");
                p2.innerHTML = 'Price: $' + price;
                p2.style.marginTop = "0";
                p2.style.marginBottom = "0";
                div.appendChild(p2);

                var a = document.createElement("a");
                a.innerHTML = "Click here to purchase!";
                a.setAttribute("href", link);
                a.setAttribute("margin-bottom", '10px');
                div.appendChild(a);

                document.getElementById('purchase-2').appendChild(div);
            }
        }

    });
}

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};