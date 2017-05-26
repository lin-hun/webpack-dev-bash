var self = this

/**
 * 通用
 */
module.exports = {
  appCollectLog:function (event, args) {
    var me = this
    var params = {};
    params.event = event;
    if (args) {
      params.args = decodeURIComponent(args);
    }
    params.user_id = me.getCookie('user_id')||window.user_id ;
    params.device_id = me.getCookie('device_id')||window.device_id||'none' ;
    params.channel = me.getCookie('channel')||window.channel||'none';
    params.version = 'vue-game'
    console.log(params);
    $.ajax({
      url: 'http://api.xintiaotime.com/game/stat/event',
      data: params,
      type: 'POST',
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      beforeSend: function (xhr) {
        if(!window.webkit){
          xhr.setRequestHeader('Cookie', document.cookie);
        }
      },
      success: function (result) {

      }
    })
  },
  collectLog: function (event, args) {
    var self = this
    if (self.getArgs('game_id')) {
      return
    }
    var params = {};
    var getArgs = self.getArgs
    params.event = event;
    if (args) {
      params.args = args;
    }
    if (getArgs('ref')) {
      params.ref = getArgs('ref');
    }
    if(getArgs('cooperation')){
      params.cooperation = getArgs('cooperation');
    }
    // console.log(params);
    $.ajax({
      url: '/demo/stat/event',
      data: params,
      type: 'POST',
      xhrFields: {
        withCredentials: true
      },
      success: function (result) {

      }
    });
  },
  //生成用户随机user_id
  regUser: function (code) {
    var me = this
    var self = this
    var user_ABC = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm']
    var user_id = parseInt(new Date() / 1000);
    for (var i = 0; i < 10; i++) {
      user_id += ('' + user_ABC[parseInt(Math.random() * 26)])
    }
    if (localStorage.getItem('uuid') == null) {
      self.setCookie('uuid', user_id)
      localStorage.setItem('uuid', user_id)
    } else {
      self.setCookie('uuid', localStorage.getItem('uuid'))
    }
    self.collectLog('COVER', code)
  },
  getCookie: function (c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
      x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
      y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
      x = x.replace(/^\s+|\s+$/g, "");
      if (x == c_name) {
        return unescape(y);
      }
    }
    return null;
  },
  request: function (config) {
    var self = this
    var type;
    type = config.type == 'get' ? 'get' : 'post'
    // android、old ios、ios with webkit&get
    if (config.url.indexOf('/game') >= 0 &&(location.href.indexOf('http') < 0 || (window.webkit&&config.type=='get')) &&(location.href.indexOf('ssss')<0)) {
      // url solve for app
      config.url = 'http://api.xintiaotime.com' + config.url
    }
    var reqConfig = {
      url: config.url,
      type: type,
      data: config.data,
      dataType: 'json',
      beforeSend: function (xhr) {
        if (location.href.indexOf('http') < 0) {
          xhr.setRequestHeader('Cookie', document.cookie);
        }
      },
      success: function (res) {

        if (typeof res == 'string') {
          res = JSON.parse(res)
        }
        if (config.check == false) {
        }
        else {
          if (res.result != 0) {
            self.message(res.msg)
            return
          }
        }
        if (typeof config.callback === "function") {
          config.callback(res)
        }
      }
    }

    // exceptt qcloud hbstory req
    if (config.url.indexOf('hbstory') < 0 &&(window.JsCallA||location.href.indexOf('http') < 0 || (window.webkit&&type=='get')))  {

      reqConfig.xhrFields =  {
        withCredentials: true
      }
      reqConfig.crossDomain = true
    }
    $.ajax(reqConfig)
  },
  message: function (value) {
    if (process.env.NODE_ENV == 'prod') {
      return
    }
    var msg = $('.msg-animate')
    msg.text(value).removeClass('fade').addClass('in')
    if (window.message) {
      clearTimeout(window.message)
    }
    window.message = setTimeout(function () {
      msg.removeClass('in').addClass('fade')
    }, 2000)
  },
  log: function (str) {
    if (process.env.NODE_ENV !== 'prod') {
      console.log(JSON.stringify(str))
    }
  },
  warn: function (str) {
    if (process.env.NODE_ENV !== 'prod') {
      console.warn(JSON.stringify(str))
    }
  },
  setSize: function () {
    var d = window, a = document.documentElement, e;
    c();
    a.setAttribute("data-dpr", d.devicePixelRatio);
    d.addEventListener("resize", b, false);
    d.addEventListener("pageshow", function (f) {
      f.persisted && b()
    }, false);
    function b() {
      clearTimeout(e);
      e = setTimeout(c, 300)
    }

    function c() {
      var f = a.getBoundingClientRect().height;
      if (f <= 960) {
        d.rem = a.getBoundingClientRect().height / 10
      } else {
        d.rem = 96;
      }
      a.style.fontSize = d.rem + "px"
    }

    if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
      $('#container').addClass('ios')
    }
  },

  is_ios: function () {
    if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
      return true;
    }
    return false;
  },
  setCookie: function (c_name, value) {
    var exdays = 360;
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value + "; path=/";
  },
  getArgs: function (strParam) {
    var args = new Object();
    var query;
    if (arguments.length == 2)
      query = arguments[1];
    else
      query = location.search.substring(1);

    var pairs = query.split("&");
    for (var i = 0; i < pairs.length; i++) {
      var pos = pairs[i].indexOf('=');
      if (pos == -1) continue;
      var argname = pairs[i].substring(0, pos);
      var value = pairs[i].substring(pos + 1);
      value = decodeURIComponent(value);
      args[argname] = value;
    }
    return args[strParam];
  },
  getNextUpdateTime: function () {
    var week = new Date().getDay();
    var dayCount = 7 - week;
    var n = 0;
    if (week == 2 || week == 3 || week == 4) {
      n = 5 - week
    } else if (week == 1 || week == 5 || week == 6 || week == 7) {
      if (week == 1) {
        n = 1
      }
      if (week == 6) {
        n = 3
      }
      if (week == 7) {
        n = 2
      }
      if (week == 5) {
        n = 4
      }
    }
    var n = -n;
    var d = new Date();
    var year = d.getFullYear();
    var mon = d.getMonth() + 1;
    var day = d.getDate();
    if (day <= n) {
      if (mon > 1) {
        mon = mon - 1;
      }
      else {
        year = year - 1;
        mon = 12;
      }
    }
    d.setDate(d.getDate() - n);
    year = d.getFullYear();
    mon = d.getMonth() + 1;
    day = d.getDate();
    //s = year+"-"+(mon<10?('0'+mon):mon)+"-"+(day<10?('0'+day):day);
    s = "下一话" + mon + "月" + day + "日更新";
    return s;
  }
}


