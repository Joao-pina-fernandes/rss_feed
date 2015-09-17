'use strict';

/**
 * Created by João Paulo on 17/09/2015.
 */

var win = window;


win.onload = function(){

    //rssReader.getFromSource("fliplet");
    //rssReader.getFromSource("demonNet");
    //rssReader.getFromSource("bbci");

    var dom = document,
        submitButton = dom.getElementById("searchButton");

    submitButton.addEventListener("click", function(e){

        e.preventDefault();
        submitButton.disabled = true;
        var input = dom.getElementById("rssValue");
        input.disabled = true;

        rssReader.getFromUrl(input.value);

    });

};