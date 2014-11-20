/* global UTILS */
window.onload = (function() {
    var TabsCollection = UTILS.qsa('.tabs a'),
        TabsContentCollection = UTILS.qsa('.tab'),
        inputTypeText = UTILS.qsa('.frmSettings input[type="text"]'),
        inputTypeUrl = UTILS.qsa('.frmSettings input[type="url"]'),
        notification = UTILS.qs('.notifications'),
        // iExpand
        bookmarks = UTILS.qsa('.bookmarks');
        UTILS.addClass(notification,'hidden');

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

    // not in use yet
    var urlJumpFix = function (tab){
        var  urlTarget = tab.getAttribute('href');
        window.location.hash = 'panel-' + urlTarget.replace('#','');
    };
    var addOptionToSelect = function(selectElement ,name,url){
        var option = document.createElement('OPTION');
        option.setAttribute('value',url);
        option.innerText = name;
        selectElement.appendChild(option);
    };
    // url validation will be added after regex
    var removeChildsElements = function(myNode){
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
    };
    var forms = UTILS.qsa('.frmSettings');
    var formValidation = function(e){
        console.log(e);
        e.preventDefault();
        var activeBookmark = e.path[3].id === "tab-quick-reports" ? 0 : 1 ;
        var arrInvalidFieldset =[];
        removeChildsElements(bookmarks[activeBookmark]);
        for (var i = 0; i < inputTypeText.length; i++) {
            if(inputTypeText[i].value !== "" && inputTypeUrl[i].value === ""){
                UTILS.addClass(inputTypeUrl[i],"invalid");
                arrInvalidFieldset.push(inputTypeUrl[i]);
                continue;
            }
            else if (inputTypeText[i].value === "" && inputTypeUrl[i].value !== "") {
                UTILS.addClass(inputTypeText[i],"invalid");
                arrInvalidFieldset.push(inputTypeText[i]);
                continue;
            }
            else if(inputTypeText[i].value !== "" && inputTypeUrl[i].value !== ""){
                addOptionToSelect(bookmarks[activeBookmark],inputTypeText[i].value,inputTypeUrl[i].value);
                if(UTILS.hasClass(bookmarks[activeBookmark],'hidden')){
                    UTILS.removeClass(bookmarks[activeBookmark],'hidden');
                }
            }

            if (UTILS.hasClass(inputTypeText[i],'invalid')){
                UTILS.removeClass(inputTypeText[i],'invalid');
            }
            if (UTILS.hasClass(inputTypeUrl[i],'invalid')){
                UTILS.removeClass(inputTypeUrl[i],'invalid');
            }
        }
        if(arrInvalidFieldset.length !==0){
            arrInvalidFieldset[0].focus();
            return false;
        }
        else{
            UTILS.emitEvent(document.getElementById('btn-settings'),'click',settingsBtnCheck);
            bookmarks[activeBookmark].focus();
            return true; //just for testing, after QA will be true
        }
    };

        UTILS.addEvent(forms[0],'submit',formValidation);



    /*
    * checkHash function is adding and removing classes
    * for activate "a" tabs and relevant divs
    *
    * There is 2 ways that checkHash is running:
    * 1. addEventListener('click' , checkHash)
    * 2. addEventListener('hashchange' , checkHash)
    */
    var checkHash = function(e){
        // if (e.path.length !== 0 || e.newURL !== undefined){
           e.preventDefault();
           // variable "that" checking if "e" is a window event
           // yes: that gets window new url.
           // no: that gets the targeted a tab element.
           var that = e.newURL ? e.newURL : e.currentTarget.href;
           var thatHashIndex = that.indexOf('#')+1;
           var thatHash = that.slice(thatHashIndex);
           var targetHashIndex = currentTab.href.indexOf('#')+1;
           var targetHash = currentTab.href.slice(targetHashIndex);
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
                showTabContent = document.getElementById('tab-'+clickedView[1]),
                // aTag is the tab target
                aTag = getAtagByHash(clickedView[1]);
                location.hash = clickedView[1];
                // activate target tab
                aTag.classList.add('tab-active');
                showTabContent.classList.remove('hidden');
                currentTab = aTag; // initialize current tab
                currentTabContent = showTabContent; // initialize current tab
            }
        // }
        else{
            return false;
        }
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
    // UTILS.emitEvent(window , 'load', new Event("hashchange"));
    for (var i = 0; i < TabsCollection.length; i++) {
        UTILS.addEvent(TabsCollection[i],'click',checkHash);
    }


    /*================================================
    AJAX NOTIFICATION.
    ================================================*/

    // Display an ajax notification using UTILS.ajax.
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

