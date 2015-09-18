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
        submitButton = dom.getElementById("searchButton"),
        form = dom.getElementById("form");

    submitButton.addEventListener("click", function(e){

        var input = dom.getElementById("rssValue");
        var inputParent = dom.getElementById("rssValueParent");

        if(!form.checkValidity()) {

            inputParent.classList.add("has-error");

            alert("Invalid feed");

            return;
        }

        //forces the form input to no error "state " when the input value is correct
        inputParent.classList.remove("has-error");

        e.preventDefault();
        submitButton.disabled = true;
        input.disabled = true;

        rssReader.getFromUrl(input.value);

    });

};