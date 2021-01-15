const fs = require("fs");
const csv = require("csvtojson");
const { Parser } = require("json2csv");

(async() => {
    try {
        //Load the csv file
        const volunteers = await csv().fromFile("volunteer_attendance_data.csv");
        let result = [];
        //Use nested for loop to findout the duplicate shift of the volunteers
        for (var i = 0; i < volunteers.length; i++) { 
            for (var j = i + 1; j < volunteers.length; j++) {
                //mathcing date
                if (volunteers[i].date == volunteers[j].date) {
                    //matching shift
                    if (volunteers[i].shift == volunteers[j].shift) {
                        var obj = {
                            //node1 and node2 put into an object
                            node1: volunteers[i].volunteerName,
                            node2: volunteers[j].volunteerName
                        }
                        result.push(obj);
                    }
                }
            }
        }

        //counting duplicates in object array
        const finalResult = [...result.reduce( (mp, o)=>{
            const key = JSON.stringify([o.node1, o.node2]);
            if(!mp.has(key)) mp.set(key, { ...o, weight: 0})
            mp.get(key).weight++;
            return mp;
        }, new Map).values()];
        //write the final result into a new csv file
        const commonVolunteers = new Parser({ fileds: ["node1", "node2", "weight"] }).parse(finalResult)
        fs.writeFileSync("graph.csv", commonVolunteers);
    } catch (error) {
        console.log(error);
    }

})();