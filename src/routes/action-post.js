const action = require('../controllers/main-controller');

module.exports = function(router, cors, corsOptionsDelegate){
    router.post('/getData', cors(corsOptionsDelegate), async (req, res) => {
        var ids = req.rawBody.split(",");
        // var ids = ["Levi.Sanchez@usu.edu"]
        console.log(ids);
        var final_results = []
        // const userId = "garth.mikesell@usu.edu";
        console.log(ids);
        for(var idx = 0; idx < ids.length; idx++){
            if(ids[idx] === ''){
                continue;
            }

            var response = await action.getFinalResults(ids[idx]);
            final_results = [...final_results, ...response];
        }

        console.log(final_results);
        res.send(JSON.stringify(final_results));
    });
};