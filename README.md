<a target="_blank" href="https://chrome.google.com/webstore/detail/chrome-managed-data-clean/anfhmiaflneaeffhlmbcedfjakdlpleg"><img alt="Try it now" src="https://github.com/jay0lee/cros-info/raw/master/cws.png" title="Click here to install this sample from the Chrome Web Store"></img></a>

# Chrome Managed Data Cleanup
  Chrome Managed Data Cleanup (CMDC) is a Chrome extension which aids admins in bulk user Chrome data cleanup. How often have you told users to "delete your cache and cookies" in order to resolve browser issues? CMDC automates the cleanup process for your users.

# How it works
  CMDC is meant to be force installed for managed Chrome users. You can force install extensions from the [Google admin console](https://support.google.com/chrome/a/answer/2657289#preinstall) or from managed [Windows](https://support.google.com/chrome/a/answer/7532015), [Macos](https://support.google.com/chrome/a/answer/7517624) and [Linux](https://support.google.com/chrome/a/answer/7517525) devices. CMDC does not work if it wasn't force installed.

  After force installing the extension, you need to set policy for the extension. The policy tells the extension what data you wish to cleanup. It's recommended that you figure out the *minimal* amount of data that needs to be cleaned up. For example, the extension could fix your user's problem by deleting all of their cookies but losing all their web settings and logins will annoy your users, you can also fix the problem by only deleting the specific problematic cookie from one website. It's best to try deleting browser data for a few test users interactively to determine exactly what data you need to cleanup to solve the issue.
  
  The extension will clear user data based on current policy settings on extension install and then again any time it detects the extension policy has been updated / changed. Outside of these times, the extension should be inactive and not using any system resources. This also means the extension will only clear user data once after each extension policy change.

# Policy config file format
Currently the policy has the following options. Note that JSON policy files do not allow comments, remove any # lines in the file before setting the policy. You may also want to use an online JSON format validator like https://jsonlint.com/ to make sure you didn't mess up the syntax.

```
{
  # should general data be cleared for the user.
  "clear_general_data": {
    "Value": true|false
  },

  # should specified cookies be cleared for the user
  "clear_cookies": {
    "Value": true|false
  },
  
  # should specified history be cleared for the user
  "clear_history": {
    "Value": true|false
  },
  
  # when removing general data, only remove data newer than this date. Dates are specified as milliseconds
  # since the Unix epoch (1970). If you have trouble counting that high, use https://currentmillis.com/
  # to figure out a date. Noe that this setting does not apply when clearing cache. All cache will always
  # be removed. Some samples dates:
  # 1535817600000 - Sept 1, 2018
  # 1145718000000 - Apr 22, 2006
  "general_data_remove_newer_than": {
    "Value": "1537637539446"
  },
  
  # The types of general data to clear. See descriptions at
  # https://developer.chrome.com/extensions/browsingData#type-DataTypeSet
  "general_data_to_clear": {
    "Value": ["appcache", "cache", "cookies", "downloads", "fileSystems", "formData",
    "history", "indexedDB", "localStorage", "serverBoundCertificates", "passwords",
    "pluginData", "serviceWorkers", "webSQL"]
  },
  
  # Cookies that will be removed. The extension will search for cookies that match each pattern and
  # remove them. See pattern details at https://developer.chrome.com/extensions/cookies#method-getAll
  "cookie_patterns_to_clear": {
    "Value":
      [
        # remove all cookies associated to *.google.com domains
        {
          "domain": "google.com"
        },
        # remove all cookies for accounts.google.com with name LSID
        {
          "domain": "accounts.google.com",
          "name": "LSID"
        }
      ]
  },
  
  # Search user browsing history and remove any matching history entries. Note that this is a free form
  # search that searches both the URL and the web page title.
  "history_searches_to_clear": {
    "Value":
      [
        # remove any cnn.com URLs from history
        "cnn.com",
        
        # remove any entries that had "widgets" in the URL or title from history
        "widgets"
      ]
  }
}
```
# Example config files
This example completely clears a users cache. Note that `general_data_remove_newer_than` does not apply to cache, all cache will be cleared no matter what the `general_data_remove_newer_than` value is.
```
{
  "clear_general_data": {
    "Value": true
  },
  "general_data_remove_newer_than": {
    "Value": "0"
  },
  "general_data_to_clear": {
    "Value": ["cache"]
  }
}
```

This example clears a user's Facebook cookies
```
{
  "clear_cookies": {
    "Value": true
  },
  "cookie_patterns_to_clear": {
    "Value":
      [
        {
          "domain": "facebook.com"
        }
      ]
  }
}
```
