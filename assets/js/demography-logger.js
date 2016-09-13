;(function () {
    function logger(output, msg) {
        var d = new Date(),
            formattedDate;

        formattedDate = [d.getFullYear(), d.getMonth(), d.getDate()].join("/");
        formattedDate += " " + [d.getHours(), d.getMinutes(), d.getMinutes()].join(":");

        output.value += formattedDate + ": " + msg + "\n";
        output.scrollTop = output.scrollHeight;
    }

    function getData(cb) {
        var xhr = new XMLHttpRequest();
        var LOD_API_URL = "http://api.lod-misis.ru/testassignment";

        xhr.addEventListener("load", function() {
            cb(undefined, xhr.responseText);
        });

        xhr.addEventListener("error", function() {
            cb(xhr.status, xhr.responseText);
        });

        xhr.open("GET", LOD_API_URL, true);
        xhr.send();
    }

    function parseData(data, cb) {
        var pieces = data.replace(/"/g, "").split(";");

        for (var i = pieces.length - 1; i >= 0; i--) {
            cb(pieces[i].split(":"));
        }
    }

    var box = document.querySelector(".output-box"),
        menCount = box.querySelector(".output-men"),
        womenCount = box.querySelector(".output-women"),
        output = box.querySelector(".output-logger");

    // Init
    logger(output, "Initiated a program.");

    menCount.value = 0;
    logger(output, "Initial men count: " + menCount.value + ".");

    womenCount.value = 0;
    logger(output, "Initial women count: " + womenCount.value + ".");

    // Update data every minute
    function upd() {
        logger(output, "Requesting data...");

        getData(function (err, data) {
            parseData(data, function(info) {
                var shift = info[1] === "Born" ? 1 : -1;

                switch (info[0]) {
                    case "Male":
                        menCount.value = parseInt(menCount.value) + shift;
                        logger(output, info.join(":"));
                        break;

                    case "Female":
                        womenCount.value = parseInt(womenCount.value) + shift;
                        logger(output, info.join(":"));
                        break;

                    default:
                        logger(output, "Invalid data:" + JSON.parse(info));
                }
            });
        });
    }

    upd();
    setInterval(upd, 60 * 1000);
})();