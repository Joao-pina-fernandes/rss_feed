'use strict';

/**
 * Created by João Paulo on 17/09/2015.
 */

var win = window;


win.onload = function(){

    rssReader.getFromSource("fliplet");
    rssReader.getFromSource("demonNet");
    rssReader.getFromSource("bbci");

};