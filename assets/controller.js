'use strict';

/**
 * Created by João Paulo on 17/09/2015.
 */

google.load("feeds", "1");

/**
 *
 * @param {Object} config -  possible configurations given to the RSSReader
 *
 * @constructor stores sources configurations
 */
var RSSReader = function(config){
    var controller = this,
        constructor = function(config){
            console.log("initializing rssReader", config);
            controller.sources = config.sources;
        };

    constructor(config);

};

/**
 *
 * @type {{getFromSource: Function, getFromUrl: Function, request: Function}}
 * getFromSource @source {String} - based on a String selects one source. Use the source url to request it's rss feed;
 *
 * getFromUrl @url {String} - based on a Url request it's rss feed;
 *
 * request @url [String} - method that uses the google rss api to get a rss feed based on a url.
 *
 * updateData @entry - based on a rss entry feed creates and append articles to the dom.
 *
 */
RSSReader.prototype = {

    getFromSource : function(source){

        if(!source) throw new Error("Source is not defined!");

        this.request(this.sources[source]);

    }, getFromUrl : function (url){

        this.request(url);

    }, request : function (url) {

        var controller = this,
            feed = new google.feeds.Feed(url);

        feed.load(function(result) {
            if (!result.error) {
                for (var i = 0; i < result.feed.entries.length; i++) {
                    var entry = result.feed.entries[i];
                    controller.updateData(entry);
                    console.log("--- new entry from ", url, "------------");
                    console.log("content -", entry.contentSnippet);
                    console.log("title -", entry.title);
                    console.log("link -", entry.link);
                    console.log("----------------------------------------");
                }
            }
        });

    }, updateData: function(entry) {

        var dom = document,
            content = dom.getElementById("content"),
            article = dom.createElement("article"),
            image   = dom.createElement("img"),
            heading = dom.createElement("h2"),
            paragraph = dom.createElement("p"),
            a = dom.createElement("a");

        image.src = "http://placehold.it/150x150";
        image.classList.add("image","col-md-3");
        heading.innerHTML = entry.title;
        heading.classList.add("heading","col-xs-12","col-md-9");
        paragraph.innerHTML = entry.contentSnippet;
        paragraph.classList.add("paragraph","col-xs-12","col-md-9","center-text");

        article.classList.add("article","row","row-margin");

        a.setAttribute("href", entry.link);
        a.setAttribute("target", "_blank");
        article.appendChild(image);
        a.appendChild(heading);
        article.appendChild(a);
        article.appendChild(paragraph);

        content.appendChild(article);
    }

};

var rssReader = new RSSReader(
    {
        sources: {
            fliplet: "http://fliplet.net/feed",
            demonNet: "http://demon.net/feed",
            bbci: "http://feeds.bbci.co.uk/news/rss.xml"
        }
    }
);

