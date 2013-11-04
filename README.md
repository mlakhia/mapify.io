Mapify.io
=========

Mapify.io is a **Chrome Extension** project which improves **Kijiji** by adding a Map, Ads/Listing Infinite-Scroll, and other various features.

## Download Mapify Kijiji

You can download the Kijiji Mapify Chrome Extension directly from the Chrome Web Store using this link <a href="http://mapify.io/download">http://mapify.io/download</a>, this one <a href="https://chrome.google.com/webstore/detail/mapify-kijiji/fbnaanoejnafapkejgmjpadlfidlgjkc">https://chrome.google.com/webstore/detail/mapify-kijiji/fbnaanoejnafapkejgmjpadlfidlgjkc</a> or by clicking the button below:

[![Kijiji Mapify available in the chrome web store](https://developers.google.com/chrome/web-store/images/branding/ChromeWebStore_BadgeWBorder_v2_340x96.png "Kijiji Mapify available in the chrome web store")](http://mapify.io/download)


## Using Mapify Kijiji

### Omnibox Search - *mk*

You can easily search **Kijiji** by using the **[M]**apify **[K]**ijiji keyword **mk** proceeded by a space and you should see something like this:

![MapifyKijiji - omnibox keyword: mk](https://raw.github.com/mlakhia/mapify.io/master/assets/omnibox_mk_example1.png "MapifyKijiji - omnibox keyword: mk")


### PageAction Icon

When the extension is enabled, these are the use cases where you will see the Mapify Kijiji icon appear in the omnibox (url bar):

1. ![MapifyKijiji - Valid Kijiji Listing Page](https://raw.github.com/mlakhia/mapify.io/master/src/images/icon38.png "Kijiji Mapify (active)") (active) will appear on **Kijiji Listing Pages**
2. ![MapifyKijiji - Kijiji Page](https://raw.github.com/mlakhia/mapify.io/master/src/images/icon38_grey.png "Kijiji Mapify (inactive)") (inactive) will appear on **All Kijiji Pages** 

---

1. Mapify's features are automatic. The infinity scroll by default is active and the map load will refresh on every new automatic load.
2. You are on another Kijiji page and the automatic features are disabled.

---

## Misc Notes (2013-08-17)

Initially [gmaps.js](http://hpneo.github.io/gmaps/) was used, but due to Google Maps and their API the map wouldn't display. After 3 hours of struggling to get GMaps to work in an extension and sequentially in a popup, I turned to [Leaflet](http://leafletjs.com/) and in < 10 minutes everything was working.

Craigslist recently (2012/10) implemented [map view](http://thenextweb.com/insider/2012/10/04/craigslist-rolls-out-new-map-view-feature-for-apartment-searches/). Craigslist also utilizes [Leaflet](http://leafletjs.com/).


## Attributions:

* The [PasswordBox Team](https://www.passwordbox.com/about)

* Leaflet JS - 	https://github.com/Leaflet/Leaflet http://leafletjs.com/


#### No Longer In Project

* Spin.JS - 	http://fgnass.github.io/spin.js/

* easyModal - 	http://flaviusmatis.github.io/easyModal.js/

## Project Details

This Chrome Extension was created during [#hackmtl](http://hackmtl.eventbrite.com/) on August 17, 2013 on top of the Olympic Stadium in Montreal, Canada. It won the "Best Google Chrome Web Extension". 

If you'd like to contribute, please do so and submit a pull request. If contributing is new to you, you can read more on [Fork A Repo - GitHub Help](https://help.github.com/articles/fork-a-repo).

If you have a suggestion or feature you would like to see implemented, visit http://mapify.io/suggest/ or [submit an issue](https://github.com/mlakhia/mapify.io/issues).

## News Articles:

* [Marmalad.es - HackMTL 2013 in the Olympic Tower](http://blog.marmalad.es/2013/08/19/hackmtl-2013-in-the-olympic-tower/)
* [MTLStartupTalent - #hackmtl showcases the best talent in Montreal](http://mtlstartuptalent.com/post/58602114770/hackmtl-showcases-the-best-talent-in-montreal)
* [Montreal Tech Watch - #hackmtl : 140 developers, 36 projects, 24 hours hackathon at the olympic stadium](http://montrealtechwatch.com/2013/08/19/hackmtl-140-developers-36-projects-24-hours-hackathon-at-the-olympic-stadium/)
* [iWeb at HackMTL 2013 – Javascript edition](http://blog.iweb.com/en/2013/08/hackmtl-2013-javascript-edition/12478.html)

## Changelog

#### 0.1 (2013-08-17)

* Project submitted for judging
* When icon clicked on a kijiji listing page presented with: popup and map with listings plotted

#### 0.2 (2013-08-25)

* Cleaned up codebase
* Polish (icons, readme, github page)
* Better bg & cs messaging

#### 0.3 (2013-11-??)

* TBD

* Geolocation
* Infinite-Scroll
* In-page map
* Better listings
* Removes annoying ads (sponsored & adsense)

