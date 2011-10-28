var page = new WebPage(), address;

page.onConsoleMessage = function (msg, line, source) {
    console.log('console> ' + msg + ' @ line: ' + line);
};

if (phantom.args.length != 1) {
    console.log('Usage: scraper.js URL');
    phantom.exit();
} else {
    address = phantom.args[0];

    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
        } else {

            // inject jquery to make sure we can use its power!
            if (page.injectJs("jquery.min.js")) {
                console.log("jQuery loaded...");
            }

            // run our js code inside the headless browser
            var latest_release = page.evaluate(function () {
                var links = $("ul.freshmanga a");
                var releases = {};
                for (var i=0; i<links.length; i++) {
                    releases[links[i].innerHTML] = links[i].getAttribute("href");
                }
                return JSON.stringify(releases);
            });
            console.log(latest_release);
            phantom.exit();

        }
    });

}