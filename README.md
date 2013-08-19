Mapify
======

This project aims to overlay a map with useful information on sites such as **Kijiji** which have poor listing navigation implementations.

Craigslist recently (2012/10) implemented [map view](http://thenextweb.com/insider/2012/10/04/craigslist-rolls-out-new-map-view-feature-for-apartment-searches/). Craigslist also utilizes [Leaflet](http://leafletjs.com/).

If you have a suggestion or feature you would like to see implemented, visit http://mapify.io/suggest/ (coming soon - 2013/08/25) or [submit an issue](https://github.com/mlakhia/mapify.io/issues)


## Kijiji Mapify

This extension's icon ![Alt text](/chromext/images/icon38.png "Kijiji Mapify") will appear on **Kijiji listing pages**. When clicked a map will be presented with all listings on the current page.


## Attributions:

* The PasswordBox Team

* Spin.JS - 		http://fgnass.github.io/spin.js/

* easyModal - 	http://flaviusmatis.github.io/easyModal.js/

* Leaflet JS - 	https://github.com/Leaflet/Leaflet http://leafletjs.com/


### Notes

Initially [gmaps.js](http://hpneo.github.io/gmaps/) was used, but due to Google Maps and their API the map wouldn't display. After 3 hours of struggling to get GMaps to work in an extension and sequentially in a popup, I turned to [Leaflet](http://leafletjs.com/) and in < 10 minutes everything was working.
