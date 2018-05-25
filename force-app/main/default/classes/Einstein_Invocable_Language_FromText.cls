public with sharing class Einstein_Invocable_Language_FromText {

	@InvocableMethod(label='Have Einstein to analyze text (sentiment or intent) from text provided!')
	public static void AnalyzeLanguage(list<LanguageRequest> LRs) {
        
		//don't allow this run in future, batch, or queueable
		if (system.isFuture() || system.isBatch() || system.isQueueable()){
			throw new LanguageException('Not allowed to run in Future, Batch, or Queuable!');
		}

		list<string> singleBatch = new list<string>();
		list<list<string>> Batches = new list<list<string>>();

		Integer Batchsize = Limits.GetLimitCallouts()-1; //because we'll use a call to get a token for each batch

		//get the actual text
		list<LanguageRequest> deduped = dedupeLRs(LRs);
		/*list<ID> lrIDs = new list<ID>();
		list<string> fields = new list<string>();

		for (LanguageRequest LR:deduped){
			lrIDs.add(LR.recordId);
			fields.add(LR.FieldToAnalyze);
		}

		string objType = id.valueOf(deduped[0].recordId).getSObjectType().getDescribe().getName();
		string soql = 'select id, ' + string.join(fields, ', ') + ' from ' + objType +' where id in: lrIDs';
		system.debug(soql);

		list<sobject> records = database.query(soql);
		system.debug(records);

		map<id, sobject> recordMap = new map<id, sobject>();
		for (sobject so:records){
			recordMap.put((id)so.get('Id'), so);
		}

		system.debug(recordMap);

		for (LanguageRequest LR:deduped){
			LR.objectType = objType;
			LR.actualText = string.valueOf(recordMap.get(LR.recordId).get(LR.FieldToAnalyze));
			//batch is full, put it in the batch list, blank it for new adds
			if (singleBatch.size()==Batchsize){
				Batches.add(singleBatch);
				singleBatch = new list<string>();
			}
			singleBatch.add(JSON.serialize(LR));
		}

		Batches.add(singleBatch);
		for (list<string> batch:batches){
			getAnalysis(batch);
		}*/
        for (LanguageRequest LR:deduped){
            //batch is full, put it in the batch list, blank it for new adds
            if (singleBatch.size()==Batchsize){
                Batches.add(singleBatch);
                singleBatch = new list<string>();
            }
            singleBatch.add(JSON.serialize(LR));
        }
        
        Batches.add(singleBatch);
        for (list<string> batch:batches){
            getAnalysis(batch);
        }
	}

	@future(callout=true)
	public static void getAnalysis(list<string> input){
       List<LanguageRequest> LRList = new List<LanguageRequest>();
        
		for (string s:input){
			LRList.add((LanguageRequest)JSON.deserialize(s, LanguageRequest.class));
		}

        System.debug(LRList[0]);
        LanguageResponse LResponse = new LanguageResponse();
        
        if (LRList[0].GetIntent && LRList[0].IntentModelId != NULL){
            Einstein_PredictionService serviceInt = new Einstein_PredictionService(Einstein_PredictionService.Types.INTENT);
            LResponse.IntentResult = serviceInt.predictIntent(LRList[0].IntentModelId, LRList[0].Text, 0, '');
            LResponse.MaxIntent = LResponse.IntentResult.highest().label;
            LResponse.MaxIntentScore = LResponse.IntentResult.highest().probability;
            LResponse.IntentRawResultJSON  = JSON.serialize(LResponse.IntentResult);   
            System.debug('MaxIntent: ' + LResponse.MaxIntent);
        }
        
        if (LRList[0].GetSentiment && LRList[0].SentimentModelId != NULL){
            Einstein_PredictionService serviceSent = new Einstein_PredictionService(Einstein_PredictionService.Types.SENTIMENT); //StanfordSentimentCategorizedv1.csv XZ5MDIX2N3E37MW7RJJOAHTWD4
            LResponse.SentimentResult = serviceSent.predictSentiment(LRList[0].SentimentModelId, LRList[0].Text, 0, '');
            LResponse.MaxSentiment = LResponse.SentimentResult.highest().label;
            LResponse.MaxSentimentScore = LResponse.SentimentResult.highest().probability;
            LResponse.SentimentRawResultJSON = JSON.serialize( LResponse.SentimentResult);   
            System.debug('MaxSentiment: ' + LResponse.MaxSentiment);
        }
        System.debug(LResponse);        
        
        List<Einstein_Language_Event__e > langEventList = new List<Einstein_Language_Event__e >();
        Einstein_Language_Event__e langEvent = new Einstein_Language_Event__e(CallbackId__c = LRList[0].CallbackId, 
                                                                              IntentRawResultJSON__c = LResponse.IntentRawResultJSON, 
                                                                              SentimentRawResultJSON__c = LResponse.SentimentRawResultJSON,
                                                                              MaxIntent__c = LResponse.MaxIntent,
                                                                              MaxIntentScore__c = LResponse.MaxIntentScore,
                                                                              MaxSentiment__c = LResponse.MaxSentiment,
                                                                              MaxSentimentScore__c = LResponse.MaxSentimentScore); 
        
        // Call method to publish events
        Database.SaveResult result = EventBus.publish(langEvent);
        
        if (result.isSuccess()) {
            System.debug('Successfully published event.');
        } else {
            for(Database.Error err : result.getErrors()) {
                System.debug('Error returned: ' +
                             err.getStatusCode() +
                             ' - ' +
                             err.getMessage());
            }
        }      
        /*
		list<ID> lrIDs = new list<ID>();
		set<string> fields = new set<string>();

		list<LanguageRequest> LRs = new list<LanguageRequest>();

		for (string s:input){
			LRs.add((LanguageRequest)JSON.deserialize(s, LanguageRequest.class));
		}

		for (LanguageRequest LR:LRs){
			lrIDs.add(LR.recordId);

			fields.add(LR.LabelStoreField);
			if (LR.ProbabilityStoreField != null){
				fields.add(LR.ProbabilityStoreField);
			}
			if (LR.RawStoreField != null){
				fields.add(LR.RawStoreField);
			}
            if (LR.ModelType=='Sentiment'){
                Einstein_PredictionService service = new Einstein_PredictionService(Einstein_PredictionService.Types.SENTIMENT);
                LR.prediction = service.predictSentiment(LR.ModelId, LR.actualText, 0, '');
            } else if (LR.ModelType=='Intent'){
                Einstein_PredictionService service = new Einstein_PredictionService(Einstein_PredictionService.Types.INTENT);
                LR.prediction = service.predictIntent(LR.ModelId, LR.actualText, 0, '');
            } else if (LR.ModelId == null && (LR.ModelType=='Sentiment' || LR.ModelType==null)){
                //default this
                Einstein_PredictionService service = new Einstein_PredictionService(Einstein_PredictionService.Types.SENTIMENT);
                LR.prediction = service.predictSentiment('CommunitySentiment', LR.actualText, 0, '');
            }
			//LR.predictions = EinsteinLanguage.Predict(LR.actualText, LR.modelType, LR.modelId, token);
			system.debug(LR);
		}

		list<string> fieldNames = new list<string>(fields);

		string soql = 'select id, ' + string.join(fieldNames, ', ') + ' from ' + LRs[0].objectType +' where id in: lrIDs';
		system.debug(soql);

		list<sobject> records = database.query(soql);
		system.debug(records);

		map<id, sobject> recordMap = new map<id, sobject>();
		for (sobject so:records){
			recordMap.put((id)so.get('Id'), so);
		}

		system.debug(recordMap);
		//handle the predictions and update that record
		for (LanguageRequest LR:LRs){
			recordMap.get((id)LR.recordId).put(LR.LabelStoreField, LR.prediction.probabilities[0].label);
			//TODO: probability, raw, chatter
			if (LR.ProbabilityStoreField != null){
				try{
					recordMap.get((id)LR.recordId).put(LR.ProbabilityStoreField, LR.prediction.probabilities[0].probability);
				} catch (SObjectException e){
					//might be a text field instead of decimal?
						recordMap.get((id)LR.recordId).put(LR.ProbabilityStoreField, string.valueOf(LR.prediction.probabilities[0].probability));
				}
			}
			if (LR.RawStoreField != null){
                // we don't need the coordinates property for anything besides object detection!
				recordMap.get((id)LR.recordId).put(LR.RawStoreField, JSON.serialize(LR.prediction).remove(',"boundingBox":null'));
			}
		}

		list<sobject> output = recordMap.values();
		update output;*/

	}

	public class LanguageRequest {    
		@InvocableVariable (required=true label='If sentiment is requested' description='True or false')
		public boolean GetSentiment;

        @InvocableVariable (required=true label='If intent is requested' description='True or false')
		public boolean GetIntent;
        
        @InvocableVariable (required=true label='Callback Id for event callback' description='The prediction will return the result in a platform event, provide an Id for the Wait element')
		public string CallbackId;
        
		@InvocableVariable (label='Intent Model Id' description='Model Id from Einstein (not the Salesforce ID)')
		public string IntentModelId;

		@InvocableVariable (label='Sentiment Model Id' description='Model Id from Einstein (not the Salesforce ID)')
		public string SentimentModelId;        
        
        @InvocableVariable (label='Text for analysis' description='The text to be analysed by Einstein')
		public string Text;
	}
    
	public class LanguageResponse {
        public Einstein_PredictionResult IntentResult;
        public Einstein_PredictionResult SentimentResult;
		public String IntentRawResultJSON;
		public String SentimentRawResultJSON;
        Public String MaxIntent;
        Public String MaxSentiment;
        public Double MaxIntentScore;
        Public Double MaxSentimentScore;
        
	}    

	public static list<LanguageRequest> dedupeLRs(list<LanguageRequest> input){
		set<LanguageRequest> temp = new set<LanguageRequest>(input);
		return new list<LanguageRequest>(temp);
	}
    
    class LanguageException extends Exception {}


}