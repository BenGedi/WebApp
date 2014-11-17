/* global UTILS */
window.onload = (function() {
    var TabsCollection = document.querySelectorAll('.tabs a'),
        TabsContentCollection = document.querySelectorAll('.tab'),
        inputTypeText = qsa('input[type="text"]'),
        inputTypeUrl = qsa('inputTypeUrl'),
        notification = UTILS.qs('.notifications');


        notification.classList.add('hidden');

    var tabActive = function(tabs){
                    for(var i = 0; i< tabs.length ;i++){
                        if (tabs[i].classList.contains('tab-active')){
                            return tabs[i];
                        }
                    }
                };

    var tabActiveContent = function(tabsContent){
            for (var i = 0; i < tabsContent.length; i++) {
                if(tabsContent[i].classList.contains('hidden')){
                    continue;
                }
                else{
                    return tabsContent[i];
                }
            }
        };

    var getAtagByHash = function(hash){
            for (var i = 0; i < TabsCollection.length; i++) {
                if (TabsCollection[i].hash === ("#"+hash)){
                    return TabsCollection[i];
                }
            }
        };
    var settingsBtnCheck = function(e){
        var target = e ? e.target : window.event.srcElement;
        var hasActive = UTILS.hasClass(target,'active');
        var setting = document.getElementById('settings');
        if(hasActive){
            target.classList.remove('active');
            setting.classList.add('hidden');
        }
        else {
            target.classList.add('active');
            setting.classList.remove('hidden');
        }
    };

    var urlJumpFix = function (tab){
        var  urlTarget = tab.getAttribute('href');
        window.location.hash = 'panel-' + urlTarget.replace('#','');
    };

    var formValidation = function(){
        for (var i = 0; i < inputTypeText.length; i++) {
            if(inputTypeText[i].value !== "" && inputTypeUrl[i].value === ""){
                UTILS.addClass(inputTypeText[i],"noValid");
            }
            else if (inputTypeText[i].value === "" && inputTypeUrl[i].value !== "") {
                UTILS.addClass(inputTypeUrl[i],"noValid");
            }
        }
    };

    /*
    * checkHash function is adding and removing classes
    * for activate "a" tabs and relevant divs
    *
    * There is 2 ways that checkHash is running:
    * 1. addEventListener('click' , checkHash)
    * 2. addEventListener('hashchange' , checkHash)
    */
    var checkHash = function(e){
        if (e.path.length !== 0 || e.newURL !== undefined){
           e.preventDefault();
           // variable "that" checking if "e" is a window event
           // yes: that gets window new url.
           // no: that gets the targeted a tab element.
           var that = e.newURL ? e.newURL : e.currentTarget.href;
           var thatHashIndex = that.indexOf('#')+1;
           var thatHash = that.slice(thatHashIndex);
           var targetHashIndex = currentTab.href.indexOf('#')+1;
           var targetHash = 'panel-' + currentTab.href.slice(targetHashIndex);
           // checking if user press on an active tab or refreshed the same url + #id
           if ((currentTab === that || that === currentTab.href)||(thatHash === targetHash)){
               return false;
           }

           // remove class active form current tab
           currentTab.classList.remove('tab-active');
           // add class hidden to current tab content
           currentTabContent.classList.add('hidden');

           if (that.indexOf("#") !== -1) {
                var clickedHREF = that,
                clickedView = clickedHREF.split("#"),
                showTabContent = document.getElementById(clickedView[1]),
                // aTag is the tab target
                aTag = getAtagByHash(clickedView[1]);
                location.hash = 'panel-' + clickedView[1];
                // activate target tab
                aTag.classList.add('tab-active');
                showTabContent.classList.remove('hidden');
                currentTab = aTag; // initialize current tab
                currentTabContent = showTabContent; // initialize current tab
            }
        }
        else{
            return false;
        }
    };
    var dispatchEvt = function(){
                window.dispatchEvent(new Event("hashchange"));
            };

    var currentTabContent = tabActiveContent(TabsContentCollection),
        currentTab = tabActive(TabsCollection),
        currentHash = location.hash;
    UTILS.addEvent(document.getElementById('btn-settings'),'click',settingsBtnCheck);
    UTILS.addEvent(window,'hashchange',checkHash);
    // window.addEventListener('load' ,function(){
    //     window.dispatchEvent(new Event("hashchange"));
    // });
    // UTILS.addEvent(window,'load',dispatchEvt);
    for (var i = 0; i < TabsCollection.length; i++) {
        UTILS.addEvent(TabsCollection[i],'click',checkHash);
    }
    UTILS.ajax('../data/notification.txt', {
        done: function(response) {
            notification.classList.remove('hidden');
            notification.innerHTML = response;
        },
        fail: function(err){
            console.log(err);
        }
    });
})();

