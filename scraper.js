// we declare two vars, one to hold the WebPage object
// which loads the URL and the other one is to hold the URL.
var page = new WebPage(), address;

// we attached a function to the onConsoleMessage event of a WebPage
// object so whenever we invoke console.log inside our page,
// we can see it through the console where we run PhantomJS.
page.onConsoleMessage = function (msg, line, source) {
    console.log('console> ' + msg + ' @ line: ' + line);
};

// classic argument checking
if (phantom.args.length != 1) {
    console.log('Usage: scraper.js URL');
    phantom.exit();
} else {
    address = phantom.args[0];

    // page.open is a method to open a URL which accepts a URL and a
    // callback function to execute when the URL is opened.
    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
        } else {

            // inject jquery to make sure we can use its power!
            if (page.injectJs("jquery.min.js")) {
                console.log("jQuery loaded...");
            }

            // run our js code inside the headless browser.
            // page.evaluate is a method to execute client side,
            // js code on our page object. Don't be confused since 
            // both PhantomJS and our browser uses js syntax.
            var latest_release = page.evaluate(function () {
                // everything inside this function is executed inside our
                // headless browser, not PhantomJS.
                var links = $("ul.freshmanga a");
                var releases = {};
                for (var i=0; i<links.length; i++) {
                    releases[links[i].innerHTML] = links[i].getAttribute("href");
                }

                // its important to take note that page.evaluate needs
                // to return simple object, meaning DOM elements won't work.
                return JSON.stringify(releases);
            });

            console.log(latest_release);
            phantom.exit();

        }
    });

}