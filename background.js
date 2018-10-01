chrome.runtime.onInstalled.addListener(function (details) {
  if ( details.reason === 'installed' ) {
    console.log('detected extension installed, running data cleanup.');
    cleanData();
  } else {
    console.log('ignoring onInstalled reason ' + details.reason);
  }
});

chrome.storage.onChanged.addListener(function (changes, areaName) {
  console.log('detected new app policy, running data cleanup.');
  cleanData();
});

function cleanData() {
  chrome.storage.managed.get(null, function(storage_items) {
    console.log('managed settings: ');
    console.log(storage_items);
    if ( storage_items.clear_general_data ) {
      var RemovalTypes = {
        "since": parseInt(storage_items.general_data_remove_newer_than, 10),
        "originTypes": { "unprotectedWeb": true }
      };
      var DataTypeSet = {};
      for (var myindex in storage_items.general_data_to_clear) {
        element = storage_items.general_data_to_clear[myindex];
        DataTypeSet[element] = true;
      }
      console.log('RemovalTypes: ');
      console.log(RemovalTypes);
      console.log('DataTypeSet: ');
      console.log(DataTypeSet);
      chrome.browsingData.remove(RemovalTypes, DataTypeSet, function() {
        console.log("cleared general data!");
      });
    } else {
      console.log('general data clearing disabled');
    };
    if ( storage_items.clear_cookies ) {
      for (var mycp in storage_items.cookie_patterns_to_clear) {
        var pattern = storage_items.cookie_patterns_to_clear[mycp];
        console.log('pattern:');
        console.log(pattern);
        chrome.cookies.getAll(pattern, function (cookies) {
          for (myck in cookies) {
            var cookie = cookies[myck];
            var url = '';
            url += cookie.secure ? 'https://' : 'http://';
            url += cookie.domain.charAt(0) == '.' ? 'www' : '';
            url += cookie.domain;
            url += cookie.path;
            var details = {
                            "url": url,
                            "name": cookie.name,
                            "storeId": cookie.storieId
                          }
            console.log('deleting cookie: ');
            console.log(details);
            chrome.cookies.remove(details, function (dets) {
              console.log('removed cookie ' + dets.name + ' for ' + dets.url);
            });
          };
        });
      };
    } else {
      console.log('clearing cookies disabled');
    };
    if ( storage_items.clear_history ) {
      for ( var myhist in storage_items.history_searches_to_clear ) {
        search = storage_items.history_searches_to_clear[myhist];
        console.log('searching history for ' + search);
        chrome.history.search({"text": search}, function (historyItems) {
          for ( var myit in historyItems ) {
            historyItem = historyItems[myit];
            console.log('removing history url ' + historyItem.url);
            chrome.history.deleteUrl({"url": historyItem.url}, function () {
              if (chrome.runtime.lastError) {
                console.log('Oops! ' + chrome.runtime.lastError.message);
              }
            });
          };
        });
      };
    } else {
      console.log('clearing history disabled');
    };
  });
}
