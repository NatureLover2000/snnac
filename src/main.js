const blob = require("./blob.js");

import freighterApi from "@stellar/freighter-api";

window.testwebpack = function (hello) {

    blob.testwebpack(hello);
};

window.send = function (destinationId, amount) {
    // console.log('hello');
    // return;
    blob.send(destinationId, amount);
};

window.freighterApi = freighterApi;
