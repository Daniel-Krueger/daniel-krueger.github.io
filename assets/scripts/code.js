window.ccls = window.ccls || {};
window.ccls.measureCreator = ccls.measureCreator || {};
window.ccls.measureCreator.measureSelectorFieldId = "#{FLD:75}#";
// Define the observer ones
window.ccls.measureCreator.Observer = new MutationObserver(function (mutations_list) {
    let element = document.querySelector(".picker-search__input");
    if (new URLSearchParams(document.location.search).get("debug") == 1) {
        function logKey(e) {
            debugger;
        }
        element.addEventListener('keydown', logKey);
        debugger;
    }
    element.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        charCode: 0,
        code: "Enter",
        composed: true,
        cancelable: true,
        keyCode: 13,
        which: 13
    }));

    $("picker-search__search-button").click();
    ccls.measureCreator.Observer.disconnect();
});

window.ccls.measureCreator.watchDOMChanges = function () {
    // Try to define query which is as limited as possible.
    ccls.measureCreator.Observer.observe(document.querySelector("#Modals"), { subtree: true, childList: true });
}
window.ccls.measureCreator.newMeasure = function () {
    // Attach the observer 
    ccls.measureCreator.watchDOMChanges();
    let measureSelector = document.getElementById(ccls.measureCreator.measureSelectorFieldId);
    $(".picker-search-button", $(measureSelector)).click();
}

window.ccls.measureCreator.Timeout = 0;
window.ccls.measureCreator.TimeoutMax  = 4;

window.ccls.measureCreator.execute = function (){
    // Start debugger, if debug parameter is set and dev tools are started.
    if (new URLSearchParams(document.location.search).get("debug") == 1) {
        debugger;
    }
	window.ccls.measureCreator.Timeout++;
    var item = document.getElementById(ccls.measureCreator.measureSelectorFieldId);
    // verify that the attachment element exists
    if (item == null  ){
        if (window.ccls.measureCreator.Timeout<= ccls.measureCreator.TimeoutMax){
			setTimeout(function (){ccls.measureCreator.execute();},333)
        }
        return;
    }
	// item exists, implement the required action
    item.style["display"] = "none";
}

window.ccls.measureCreator.execute();
