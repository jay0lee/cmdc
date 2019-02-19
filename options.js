document.getElementById('add_history_textbox').addEventListener('click', add_history_textbox);
document.getElementById('add_cookie_pattern').addEventListener('click', add_cookie_pattern);
document.getElementById('dlpolicy').addEventListener('click', gen_policy);

function gen_policy() {
    policy = {};
    if (general_enabled.checked) {
      policy.clear_general_data = {'Value': true};
      var remove_newer_than = parseInt(document.getElementById('general_data_remove_newer_than').value);
      if (! remove_newer_than) {
        alert('Error: you need to choose a date/time to clear general data.');
        return;
      }
      remove_newer_than = remove_newer_than * 1000;
      policy.general_data_remove_newer_than = {'Value': remove_newer_than.toString()};
      general_types = getElementsStartsWithId('general_type_');
      gen_types_enabled = [];
      for (var i = 0; i < general_types.length; i++) {
        if (general_types[i].checked == true) {
          gen_types_enabled.push(general_types[i].id.substring(13));
	}
      }
      policy.general_data_to_clear = {'Value': gen_types_enabled};
    }
    if (cookies_enabled.checked) {
      policy.clear_cookies = {'Value': true};
      policy.cookie_patterns_to_clear = {'Value': []}
      for (var i = 1; true; i++) {
        var url = document.getElementById('cookies_URL_'+i);
        var name = document.getElementById('cookies_Name_'+i);
        var domain = document.getElementById('cookies_Domain_'+i);
        var path = document.getElementById('cookies_Path_'+i);
        if (! url && ! name && ! domain && ! path) {
          break;
	}
        var cookie_pattern = {};
        if (url && url.value) {
          cookie_pattern.url = url.value;
	}
        if (name && name.value) {
          cookie_pattern.name = name.value;
	}
        if (domain && domain.value) {
          cookie_pattern.domain = domain.value;
        }
        if (path && path.value) {
          cookie_pattern.path = path.value;
        }
        policy.cookie_patterns_to_clear.Value.push(cookie_pattern);
      }
    }
    if (history_enabled.checked) {
      policy.clear_history = {'Value': true};
      policy.history_searches_to_clear = {'Value': []};
      for (var i = 1; true; i++) {
        var search = document.getElementById('history_textbox_'+i);
        if (search && search.value) {
          policy.history_searches_to_clear.Value.push(search.value);
	} else {
          break;
	}
      }
    }
    policy_str = JSON.stringify(policy, null, 2);
    download(policy_str, 'cmdc-policy.json', 'application/json');
}

function download(data, filename, type) { // thanks to https://stackoverflow.com/a/30832210
  var file = new Blob([data], {type: type});
  var a = document.createElement("a"),
    url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
  setTimeout(function() {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}

var general_enabled = document.getElementById('clear_general_data');
general_enabled.onchange = function () {
  console.log('gen settings changed');
  var general_enabled = document.getElementById('clear_general_data');
  gen_elements = getElementsStartsWithId('general_');
  if (general_enabled.checked == true) {
    var newVal = false;
  } else {
    var newVal = true;
  }
  for (var i = 0, len = gen_elements.length; i < len; i++) {
    gen_elements[i].disabled = newVal;
  }
}

cookies_enabled = document.getElementById('clear_cookies');
cookies_enabled.onchange = function () {
  var cookies_enabled = document.getElementById('clear_cookies');
  var cookie_elements = getElementsStartsWithId('cookies_');
  cookie_elements.push(document.getElementById('add_cookie_pattern'));
  if (cookies_enabled.checked == true) {
    var newVal = false;
  } else {
    var newVal = true;
  }
  for (var i =0, len = cookie_elements.length; i < len; i++) {
    cookie_elements[i].disabled = newVal;
  }
}

history_enabled = document.getElementById('clear_history');
history_enabled.onchange = function () {
  var history_elements = getElementsStartsWithId('history_');
  history_elements.push(document.getElementById('add_history_textbox'));
  if (history_enabled.checked == true) {
    var newVal = false;
  } else {
    var newVal = true;
  }
  for (var i = 0, len = history_elements.length; i < len; i++) {
    history_elements[i].disabled = newVal;
  }
}

function getElementsStartsWithId( id ) {
	  var children = document.body.getElementsByTagName('*');
	  var elements = [], child;
	  for (var i = 0, length = children.length; i < length; i++) {
		      child = children[i];
		      if (child.id.substr(0, id.length) == id)
			        elements.push(child);
		    }
	  return elements;
}

var history_count = 1;
var cookie_count = 1;

function add_history_textbox() {
	history_count++;
        console.log('adding history '+history_count);
	var lb = document.createElement('br');
	var element = document.createElement("input");
	element.setAttribute("type", "textbox");
	element.setAttribute("id", "history_textbox_"+history_count);
	var foo = document.getElementById("history_textboxen");
	foo.appendChild(element);
	foo.appendChild(lb);
	}

function add_cookie_pattern() {
	cookie_count++;
	console.log('adding cookie '+cookie_count);
	var boxtypes = ['URL', 'Name', 'Domain', 'Path'];
        var foo = document.getElementById("cookies_patterns");
	for (var i = 0, len = boxtypes.length; i < len; i++) {
          var mytext = document.createTextNode(boxtypes[i]+': ');
	  foo.appendChild(mytext);
	  var element = document.createElement("input");
	  element.setAttribute("type", "textbox");
	  element.setAttribute("id", "cookies_"+boxtypes[i]+"_"+cookie_count);
	  foo.appendChild(element);
	  var lb = document.createElement('br');
	  foo.appendChild(lb);
	  }
	var lb = document.createElement('br');
	foo.appendChild(lb);
        } 
