({
    doInit : function(component, event, helper) {
        component.set("v.iconName", "utility:knowledge_base");
        var rawPredictions = component.get("v.rawPredictions"); 
        var jsonObjs = JSON.parse(rawPredictions);

        var predictions = [];
		console.log(jsonObjs);
        for (var i = 0; i < jsonObjs.length; i++) {
            predictions.push({
                label: jsonObjs[i].label,
                formattedProbability:
                "" + Math.round(jsonObjs[i].probability * 100) + "%"
            });
        }
        console.log('predictions:');console.log(predictions);
        component.set("v.predictions", predictions);       
    }
})

       /*  var rawPredictions = '['+
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
        component.set("v.rawPredictions", rawPredictions);*/