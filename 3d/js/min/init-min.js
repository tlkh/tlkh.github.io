!function(e){skel.init({reset:"full",breakpoints:{global:{range:"*",href:"css/style.css",containers:1400,grid:{gutters:40},viewport:{scalable:!1}},wide:{range:"961-1880",href:"css/style-wide.css",containers:1200,grid:{gutters:40}},normal:{range:"961-1620",href:"css/style-normal.css",containers:960,grid:{gutters:40}},narrow:{range:"961-1320",href:"css/style-narrow.css",containers:"100%",grid:{gutters:20}},narrower:{range:"-960",href:"css/style-narrower.css",containers:"100%",grid:{gutters:20}},mobile:{range:"-736",href:"css/style-mobile.css",containers:"100%!",grid:{collapse:!0}}},plugins:{layers:{sidePanel:{hidden:!0,breakpoints:"narrower",position:"top-left",side:"left",animation:"pushX",width:240,height:"100%",clickToHide:!0,html:'<div data-action="moveElement" data-args="header"></div>',orientation:"vertical"},sidePanelToggle:{breakpoints:"narrower",position:"top-left",side:"top",height:"4em",width:"5em",html:'<div data-action="toggleLayer" data-args="sidePanel" class="toggle"></div>'}}}}),e(function(){var a=e(window),t=e("body");t.addClass("is-loading"),a.on("load",function(){t.removeClass("is-loading")}),skel.vars.IEVersion<9&&e(":last-child").addClass("last-child");var r=e("form");r.length>0&&(r.find(".form-button-submit").on("click",function(){return e(this).parents("form").submit(),!1}),skel.vars.IEVersion<10&&(e.fn.n33_formerize=function(){var a=new Array,t=e(this);return t.find("input[type=text],textarea").each(function(){var a=e(this);(""==a.val()||a.val()==a.attr("placeholder"))&&(a.addClass("formerize-placeholder"),a.val(a.attr("placeholder")))}).blur(function(){var a=e(this);a.attr("name").match(/_fakeformerizefield$/)||""==a.val()&&(a.addClass("formerize-placeholder"),a.val(a.attr("placeholder")))}).focus(function(){var a=e(this);a.attr("name").match(/_fakeformerizefield$/)||a.val()==a.attr("placeholder")&&(a.removeClass("formerize-placeholder"),a.val(""))}),t.find("input[type=password]").each(function(){var a=e(this),t=e(e("<div>").append(a.clone()).remove().html().replace(/type="password"/i,'type="text"').replace(/type=password/i,"type=text"));""!=a.attr("id")&&t.attr("id",a.attr("id")+"_fakeformerizefield"),""!=a.attr("name")&&t.attr("name",a.attr("name")+"_fakeformerizefield"),t.addClass("formerize-placeholder").val(t.attr("placeholder")).insertAfter(a),""==a.val()?a.hide():t.hide(),a.blur(function(a){a.preventDefault();var t=e(this),r=t.parent().find("input[name="+t.attr("name")+"_fakeformerizefield]");""==t.val()&&(t.hide(),r.show())}),t.focus(function(a){a.preventDefault();var t=e(this),r=t.parent().find("input[name="+t.attr("name").replace("_fakeformerizefield","")+"]");t.hide(),r.show().focus()}),t.keypress(function(e){e.preventDefault(),t.val("")})}),t.submit(function(){e(this).find("input[type=text],input[type=password],textarea").each(function(a){var t=e(this);t.attr("name").match(/_fakeformerizefield$/)&&t.attr("name",""),t.val()==t.attr("placeholder")&&(t.removeClass("formerize-placeholder"),t.val(""))})}).bind("reset",function(t){t.preventDefault(),e(this).find("select").val(e("option:first").val()),e(this).find("input,textarea").each(function(){var a=e(this),t;switch(a.removeClass("formerize-placeholder"),this.type){case"submit":case"reset":break;case"password":a.val(a.attr("defaultValue")),t=a.parent().find("input[name="+a.attr("name")+"_fakeformerizefield]"),""==a.val()?(a.hide(),t.show()):(a.show(),t.hide());break;case"checkbox":case"radio":a.attr("checked",a.attr("defaultValue"));break;case"text":case"textarea":a.val(a.attr("defaultValue")),""==a.val()&&(a.addClass("formerize-placeholder"),a.val(a.attr("placeholder")));break;default:a.val(a.attr("defaultValue"))}}),window.setTimeout(function(){for(x in a)a[x].trigger("formerize_sync")},10)}),t},r.n33_formerize())),e(".scrolly").scrolly();var i=e("#nav a");i.scrolly().on("click",function(a){var t=e(this),r=t.attr("href");"#"==r[0]&&(a.preventDefault(),i.removeClass("active").addClass("scrollzer-locked"),t.addClass("active"))});var s=[];i.each(function(){var a=e(this).attr("href");"#"==a[0]&&s.push(a.substring(1))}),e.scrollzer(s,{pad:200,lastHack:!0})})}(jQuery);