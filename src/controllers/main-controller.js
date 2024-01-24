const axios = require('axios');

const headers = {
  'Authorization': `Bearer ${process.env.API_KEY}`,
};

async function getGroupDetails(groupName) {
  try {
    const url = groupName === 'USU' ? `https://api.pope.tech/organizations/usu/groups`: `https://api.pope.tech/organizations/usu/groups?mode=select&search=${groupName}`;
  
    const response = await axios.get(url, { headers });
    const sites = response.data;
    return groupName === 'USU' ? sites.data.tree[0].public_id : sites.data[0].public_id;
  }
  catch(error){
    console.log(error)
    return '';
  }
}

async function getUserDetails(userId) {
  try{
    const response = await axios.get(`https://api.pope.tech/organizations/usu/users?search=${userId}`, { headers });
    const sites = response.data;
    return sites.data.length > 0 ? sites.data[0].groups:[];
  }
  catch(error){
    console.log(error)
    return []
  }
}


async function getScanResults(websiteFilter) {
  try {
    console.log(websiteFilter)
    var page_next = true
    var page = 1
    var total = 0
    var errors = 0

    while(page_next){
      console.log(page)
      let response = await axios.get(`https://api.pope.tech/organizations/usu/reports/explore?group_filter=${websiteFilter}&page=${page}&limit=50`, { headers });
      response = response.data;

      var pages = response['data']

      pages.forEach(page => {
        total += page['pages']
        errors += page['errors']
      });

      page_next = response['meta']['pagination']['links']['next']
      page += 1
    }

    return {
      pages: total,
      errors: errors
    };
  }
  catch(error){
    console.log(error);

    return {
      pages: 0,
      errors: 0
    };
  }
}

async function getFinalResults(userId) {
  try {
    const groups = await getUserDetails(userId);
    console.log(groups);
    if(groups.length === 0){
      return [];
    }

    const sites = [];
    const websiteScan = [];

    for (const group of groups) {
      const groupFilter = await getGroupDetails(group.name);
      
      const scanResult = await getScanResults(groupFilter);

      websiteScan.push({
        'website_name': group.name,
        'full_url': `https://app.pope.tech/organization/usu/dashboard?group_filter=${group.public_id}`,
        'result': {
          pages : scanResult['pages'],
          errors : scanResult['errors']
        }
      });

    }

    return websiteScan;
  }
  catch(error){
    console.log(error);
  }
}


module.exports = {
    getFinalResults
}