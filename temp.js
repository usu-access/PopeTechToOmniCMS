var response = await getRequest(API_HOST, API_TOKEN, '/users/groups', '&user=dkotte');
console.log("res 1");
console.log(response);
var groups = response["groups"];
var final_emails = [];
for(var idx = 0; idx < groups.length; idx++){
    var response = await getRequest(API_HOST, API_TOKEN, '/groups/view', '&group=' + groups[idx]);
    console.log("res 2");
    console.log(response);
    var members = response.members;
    for(var idx_1 = 0; idx_1 < members.length; idx_1++){
        var response = await getRequest(API_HOST, API_TOKEN, '/users/view', '&user=' + members[idx_1].username);
        console.log("res 3");
        console.log(response);
        final_emails.push(response.email)
    }	
}
console.log("final_emails");
console.log(final_emails);

var final_results = await postRequest("https://226f-144-39-247-54.ngrok-free.app/getData", [...new Set(final_emails)]);
console.log(typeof final_results);
updateTable(JSON.parse(final_results));