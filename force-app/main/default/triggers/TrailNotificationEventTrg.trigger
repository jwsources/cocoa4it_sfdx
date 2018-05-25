trigger TrailNotificationEventTrg on Notification__e (after insert) {

    List<Notification__e> nEventList = new List<Notification__e>();
    for (Notification__e nEvent : Trigger.New){
        System.debug(nEvent);
        if (nEvent.SenderId__c == 'HerokuTrailApp'){
            Map<String, String> inputMap = new Map<String, String>();
            //Map<String, Notification__e> inputMap = new Map<String, Notification__e>();
            //inputMap.put('InputMessage', 'My Message');
            inputMap.put('TrailEventMessage', nEvent.Message__c);
            inputMap.put('TrailEventReplayId', nEvent.ReplayId);
            //Flow.Interview myFlow = Flow.Interview.createInterview('TrailFlowEventDispatcher', inputMap);
            Flow.Interview myFlow = Flow.Interview.createInterview('TrailEventDispatcherFlow', inputMap);
  			myFlow.start();
            //nEventList.add(new Notification__e(Message__c = nEvent.Message__c, SenderId__c = 'TrailTriggerDispatcher'));   
        }   
    }
    
}
    
    /*
    // Call method to publish events
    List<Database.SaveResult> results = EventBus.publish(nEventList);
    // Inspect publishing result for each event
    for (Database.SaveResult sr : results) {
        if (sr.isSuccess()) {
            System.debug('Successfully published event.');
        } else {
            for(Database.Error err : sr.getErrors()) {
                System.debug('Error returned: ' +
                             err.getStatusCode() +
                             ' - ' +
                             err.getMessage());
            }
        }
    }*/
//}