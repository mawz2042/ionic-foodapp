cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.ionic.keyboard/www/keyboard.js",
        "id": "com.ionic.keyboard.keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/plugin.http.request/www/http-request.js",
        "id": "plugin.http.request.phonegap-http-requst",
        "clobbers": [
            "cordova.plugins.http-request"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.ionic.keyboard": "1.0.3",
    "org.apache.cordova.console": "0.2.11",
    "org.apache.cordova.device": "0.2.12",
    "org.apache.cordova.geolocation": "0.3.10",
    "plugin.http.request": "1.0.0"
}
// BOTTOM OF METADATA
});