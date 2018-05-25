({
    handleShowPopoverIntent : function(component, event, helper) {
        var rawPredictions = component.get("v.IntentRawResultJSON");
        var selectedItemCss = event.getSource().get("v.title");
        console.log("rawPredictions");console.log(rawPredictions);
        var str = "";
        str += "."+selectedItemCss.replace(/\s/g,'');
        console.log('str: '+str);
        var modalBody; 
        $A.createComponent("c:NotificationPopover", {"rawPredictions":rawPredictions},
                           function(content, status) {
                               if (status === "SUCCESS") {
                                   modalBody = content;
                                   component.find('overlayLib').showCustomPopover({
                                       header: "Probabilities",
                                       body: modalBody,
                                       referenceSelector: str,
                                       cssClass: "mymodal",
                                   }).then(function (overlay) {
                                       setTimeout(function(){ 
                                           //close the popover after 3 seconds
                                           overlay.close(); 
                                       }, 3000);
                                   });
                               }
                           });   
/*
        component.find('overlayLib').showCustomPopover({
            body: component.get('v.IntentRawResultJSON'),
            referenceSelector: str,
            cssClass: "slds-nubbin_left,slds-popover_walkthrough,no-pointer,popoverclass,cnotificationConsoleWithHub"
        }).then(function (overlay) {
            setTimeout(function(){ 
                //close the popover after 3 seconds
                overlay.close(); 
            }, 3000);
        });*/
    },
    handleShowPopoverSentiment : function(component, event, helper) {
        var rawPredictions = component.get("v.SentimentRawResultJSON");
        var selectedItemCss = event.getSource().get("v.title");
        console.log("getSource");
        console.log(event.getSource());
        var str = "";
        str += "."+selectedItemCss;
        console.log('str: '+str);
        var modalBody;
        
        $A.createComponent("c:NotificationPopover", {"rawPredictions":rawPredictions},
                           function(content, status) {
                               if (status === "SUCCESS") {
                                   modalBody = content;
                                   component.find('overlayLib').showCustomPopover({
                                       header: "Probabilities",
                                       body: modalBody,
                                       referenceSelector: str,
                                       cssClass: "mymodal",
                                   }).then(function (overlay) {
                                       setTimeout(function(){ 
                                           //close the popover after 3 seconds
                                           overlay.close(); 
                                       }, 3000);
                                   });
                               }
                           });  
    },
/*        component.find('overlayLib').showCustomPopover({
            body: component.get('v.SentimentRawResultJSON'),
            referenceSelector: str,
            cssClass: "slds-nubbin_left,slds-popover_walkthrough,no-pointer,popoverclass,cnotificationConsoleWithHub"
        }).then(function (overlay) {
            setTimeout(function(){ 
                //close the popover after 3 seconds
                overlay.close(); 
            }, 3000);
        });
    }, */   
    /*
        handleShowPopover : function(component, event, helper) {
        var selectedItem = event.getSource().get("v.name");
        var selectedItemCss = event.getSource().get("v.value");
        var str = "";
        str += "."+selectedItemCss ;
        component.find('overlayLib').showCustomPopover({
            body: selectedItem,
            referenceSelector: str,
            cssClass: "popoverclass"
        }).then(function (overlay) {
            setTimeout(function(){
                //close the popover after 1 seconds
                overlay.close();
            }, 1000);
        });
    }  
     */ 
    onInit : function(component, event, helper) {
		var categoryFilter = component.get('v.CategoryFilter');
        var newCategoryFilter = categoryFilter==undefined ? 'Not categorized event' : categoryFilter;
        component.set('v.CategoryFilter', newCategoryFilter);
        var myEventHub = component.find('myHub');        
        myEventHub.subscribe(
            component, 
            'Notification__e', 
            $A.getCallback(function(component, platformEvent) {
                helper.onTestEvent(component, platformEvent);
            })
        );      
    },
    onClear : function(component, event, helper) {
        component.set('v.notifications', []);
    },
    onToggleMute : function(component, event, helper) {
        var isMuted = component.get('v.isMuted');
        component.set('v.isMuted', !isMuted);
        helper.displayToast(component, 'success', 'Notifications '+ ((!isMuted) ? 'muted' : 'unmuted') +'.');
    }
})

    /*onCometdLoaded : function(component, event, helper) {
        var cometd = new org.cometd.CometD();
        component.set('v.cometd', cometd);
        if (component.get('v.sessionId') != null)
            helper.connectCometd(component);
    }, */  
    //<c:EinsteinGenericPlaygroundComponent dataType="text-intent" iconName="utility:signpost" allModelsByType="{! v.modelsByType }" />
    /*handleShowPopover : function (component, event, helper) {
        var selectedItem = event.getSource().get("v.name");
        var selectedItemCss = event.getSource().get("v.value");
        var str = "";
        str += "."+selectedItemCss ;
        console.log('str: '+str);
        //var myName= component.get("v.myVal");
        var rawPredictions = '['+
        '{'+
         '   "label": "Neutral",'+
         '  "probability": 0.4415715'+
        '},'+
        '{'+
        '    "label": "Negative",'+
        '    "probability": 0.3237354'+
        '},'+
        '{'+
        '    "label": "Positive",'+
        '    "probability": 0.18284538'+
        '},'+
        '{'+
        '    "label": "Very Negative",'+
        '    "probability": 0.03272001'+
        '},'+
        '{'+
        '    "label": "Very Positive",'+
        '    "probability": 0.019127678'+
        '}'+
    ']';
        var modalBody;
        $A.createComponent("c:notificationLanguageResponse", {"rawPredictions":rawPredictions},
                           function(content, status) {
                               if (status === "SUCCESS") {
                                   modalBody = content;
                                   component.find('overlayLib').showCustomPopover({
                                       header: "Probabilities",
                                       body: modalBody,
                                       referenceSelector: str,
                                       cssClass: "mymodal",
                                   })
                               }
                           });
    }*/