({
    doInit : function(component, event, helper) {
         var rawPredictions = '['+
        '{'+
         '   "label": "Neutral",'+
         '  "probability": 0.5015715'+
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
        component.set("v.rawPredictions", rawPredictions);
        //var rawPredictions = component.get("v.rawPredictions"); 
        console.log('doInit: rawPredictions:');console.log(rawPredictions);
        console.log(rawPredictions.length);
        console.log(JSON.parse(rawPredictions));
        var jsonObjs = JSON.parse(rawPredictions);
        console.log('jsonObjs:');console.log(jsonObjs);
        var predictions = [];
		/*
        for (var i = 0; i < jsonObjs.length; i++) {
            predictions.push({
                label: jsonObjs[i].label,
                formattedProbability:
                "" + Math.round(jsonObjs[i].probability * 100) + "%"
            });
        }
        component.set("v.predictions", predictions);*/
        console.log('I was here!');
    }
})