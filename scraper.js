var page = new WebPage(), address;

page.onConsoleMessage = function (msg, line, source) {
    console.log('console> ' + msg + ' @ line: ' + line);
};

if (phantom.args.length != 1) {
    console.log('Usage: scraper.js URL');
    phantom.exit();
} else {
    address = phantom.args[0];
    var paging = [], chapter_images = [], subpages = {}, ci_url;

    console.log("fetching pagers...");
    (function(callback) {
        page.open(address, function (status) {
            console.log("opened...");
            if (status !== 'success') {
                console.log('Unable to load the address!');
            } else {
                if (page.injectJs("jquery.min.js")) {
                    console.log("jQuery loaded...");
                }
                paging = page.evaluate(function () {
                    var pager_urls = [], paging = $("#controls a"), l;
                    for (var i=0; i<paging.length; i++) {
                        l = paging[i].getAttribute("href");
                        if (!isNaN(parseInt(paging[i].innerHTML))) {
                            pager_urls.push(l);
                        }
                    }
                    return pager_urls;
                });
                callback();
            }
        });
    })(fetchChapterImages);

    function fetchChapterImage(index, url) {
        console.log("Opening: " + url);
        (function() {
            page.open(url, function (status) {
                if (status !== 'success') {
                    console.log('Unable to load chapter image: ' + (index + 1) + ' Status: ' + status);
                } else {
                    if (page.injectJs("jquery.min.js")) {
                        console.log("jQuery loaded...");
                    }

                    var chapter_img = page.evaluate(function () {
                        var $ = jQuery.noConflict();
                        return $("img#p").getAttribute("src");
                    });
                    console.log("got: " + chapter_img);
                    chapter_images.push(chapter_img);
                }
            });
        })();
    }

    function fetchChapterImages() {
        if (paging.length > 0) {
            console.log("fetching chapter images...");
            var base_url = address.substring(0, address.indexOf(paging[0]));
            for (var i=0; i<1; i++) {
                ci_url = base_url + paging[i];
                fetchChapterImage(i, ci_url);
            }
        }
        console.log(chapter_images);
        phantom.exit();
    }

}