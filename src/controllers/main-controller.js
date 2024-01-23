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
  }
}

async function getWebsites(groupPublicId) {
  try {
    let page = 1;
    let pageLength = 10;
    const sites = [];

    while (page <= pageLength) {
      const response = await axios.get(`https://api.pope.tech/organizations/usu/websites?group_filter=${groupPublicId}&page=${page}`, { headers });
      const res = response.data;
      sites.push(...res.data);
      pageLength = res.meta.pagination.last_page;
      page += 1;
    }

    return sites;
  }
  catch(error){
    console.log(error);
  }
}

async function getScanResults(websiteFilter) {
  try {
    console.log(websiteFilter)
    const response1 = await axios.get(`https://api.pope.tech/organizations/usu/scans?website_filter=${websiteFilter}&limit=1&status=success`, { headers });
    const res1 = response1.data;
    const scanId = res1.data[0].public_id;

    const response2 = await axios.get(`https://api.pope.tech/organizations/usu/scans/${scanId}`, { headers });
    const res2 = response2.data;

    return res2.data.totals[0].totals;
  }
  catch(error){
    console.log(error);
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
      const websites = await getWebsites(groupFilter);

      var pages = 0;
      var errors = 0;

      for(var idx = 0; idx < websites.length; idx++){
        const scanResult = await getScanResults(websites[idx].public_id);
        pages += scanResult.pages;
        errors += scanResult.errors + scanResult.contrast;
        console.log(pages);
      }

      websiteScan.push({
        'website_name': group.name,
        'full_url': `https://app.pope.tech/organization/usu/dashboard?group_filter=${group.public_id}`,
        'result': {
          pages : pages,
          errors : errors
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