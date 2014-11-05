window.onload = (function() {
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
        };
    };
    var getAtagByHash = function(hash){
        for (var i = 0; i < myLinksCollection.length; i++) {
            if (myLinksCollection[i].hash === ("#"+hash)){
                return myLinksCollection[i];
            }
        };
    };

    /*
    * checkHash function is adding and removing classes
    * for activate "a" tabs and relevant divs
    *
    * There is 2 ways that checkHash is running:
    * 1. by the addEventListener.
    * 2. by refresh url + #id
    */
    var checkHash = function(e){
        // variable "that" checking if "e" has an event (from addEventListener)
        // yes: that gets the event currentTarget
        // no: that get the window.location
        var that = (e !== undefined) ? e.currentTarget : location;

        // checking if user press on an active tab or refreshed the same url + #id
        if (currentTab === that || that.href === currentTab.href){
            return false;
        }

        // remove class active form current tab
        currentTab.classList.remove('tab-active');
        // add class hidden to current tab content
        currentTabContent.classList.add('hidden');


        if (that.href.indexOf("#") !== -1) {
            var clickedHREF = that.href,
                clickedView = clickedHREF.split("#"),
                showTabContent = document.getElementById(clickedView[1]),
                // aTag is the tab target
                aTag = e !== undefined ? e.target :getAtagByHash(clickedView[1]);

            // activate target tab
            aTag.classList.add('tab-active');
            showTabContent.classList.remove('hidden');
            currentTab = aTag; // initialize current tab
            currentTabContent = showTabContent; // initialize current tab
            location.hash = clickedView[1];
        }
    };
    var myLinksCollection = document.querySelectorAll('.tabs a');
    var myTabsContentCollection = document.querySelectorAll('.tab');
    var currentTabContent = tabActiveContent(myTabsContentCollection);
    var currentTab = tabActive(myLinksCollection);
    var currentHash = location.hash;
    if (currentHash !=="") {
        checkHash();
    }
    for (i=0;i<myLinksCollection.length;i++) {
        myLinksCollection[i].addEventListener('click',checkHash);
    }
})();


document.getElementById('btn-settings').addEventListener('click',function(e){
	var target = e ? e.target : window.event.srcElement;
	var hasActive = target.classList.contains('active');
	var setting = document.getElementById('settings');
	if(hasActive){
		target.classList.remove('active');
		setting.classList.add('hidden');
	}
	else {
		target.classList.add('active');
		setting.classList.remove('hidden');
	}
});
