({
    onTestEvent : function(component, platformEvent) {
        console.log(platformEvent.data.payload.Message__c);
        console.log(platformEvent.data.payload.SenderId__c);
        console.log(platformEvent.data.payload.IntentRawResultJSON__c );
        console.log(platformEvent.data.payload.SentimentRawResultJSON__c );
        console.log(platformEvent.data.payload.IntentCategory__c);
        console.log(platformEvent.data.payload.MessageTone__c); 
        console.log(platformEvent.data.payload.OriginalReplayId__c); 
        var classtitle
        if (platformEvent.data.payload.IntentCategory__c != undefined && platformEvent.data.payload.OriginalReplayId__c != undefined){
            classtitle = platformEvent.data.payload.IntentCategory__c + platformEvent.data.payload.OriginalReplayId__c;
            classtitle = classtitle.replace(/\s/g,'');
            console.log(classtitle);            
        }else{
            classtitle = 'empty';            
        }
        console.log('classtitle: ' + classtitle);
        console.log('IntentCategory__c: ' + platformEvent.data.payload.IntentCategory__c);
        console.log('v.CategoryFilter: ' + component.get('v.CategoryFilter'));

        var helper = this;
        var newNotification;
        if (platformEvent.data.payload.IntentCategory__c == component.get('v.CategoryFilter')){          
            // Extract notification from platform event  
            newNotification = {
                classtitle : classtitle,
                classtitlesentiment : classtitle + platformEvent.data.payload.MessageTone__c.replace(/\s/g,''),
                time : $A.localizationService.formatDateTime(
                    platformEvent.data.payload.CreatedDate, 'HH:mm'),
                message : platformEvent.data.payload.Message__c,
                category : platformEvent.data.payload.IntentCategory__c,
                sentiment : platformEvent.data.payload.MessageTone__c
            };
            // Save notification in history
            var notifications = component.get('v.notifications');
            notifications.push(newNotification);
            
            var intentRawJSON = JSON.parse(platformEvent.data.payload.IntentRawResultJSON__c);
			var sentimentRawJSON = JSON.parse(platformEvent.data.payload.SentimentRawResultJSON__c);            

            component.set('v.IntentRawResultJSON', JSON.stringify(intentRawJSON.probabilities, null, 4));
            component.set('v.SentimentRawResultJSON', JSON.stringify(sentimentRawJSON.probabilities, null, 4));     
            component.set('v.notifications', notifications);
            // Display notification in a toast if not muted
            if (!component.get('v.isMuted'))
                helper.displayToast(component, 'info', newNotification.message);
            
        }else if ((platformEvent.data.payload.IntentCategory__c === null) && 
                 (component.get('v.CategoryFilter') == 'Not categorized')){
            console.log('null and not yet categorized');
            newNotification = {
                classtitle : classtitle,
                time : $A.localizationService.formatDateTime(
                    platformEvent.data.payload.CreatedDate, 'HH:mm'),
                message : platformEvent.data.payload.Message__c,
            };      
            // Save notification in history
            var notifications = component.get('v.notifications');
            notifications.push(newNotification);
            component.set('v.notifications', notifications);
            // Display notification in a toast if not muted
            if (!component.get('v.isMuted'))
                helper.displayToast(component, 'info', newNotification.message);
        }
    },

    displayToast : function(component, type, message) {
        var toastEvent = $A.get('e.force:showToast');
        toastEvent.setParams({
            type: type,
            message: message
        });
        toastEvent.fire();
    }    
})