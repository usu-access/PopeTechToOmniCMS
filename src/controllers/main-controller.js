const axios = require('axios');

const headers = {
  'Authorization': `Bearer ${process.env.API_KEY}`,
};

async function getGroupDetails(groupName) {
  try {
    const response = await axios.get(`https://api.pope.tech/organizations/usu/groups?mode=select&search=${groupName}`, { headers });
    const sites = response.data;
    return sites.data[0].public_id;
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

    if(groups.length === 0){
      return [];
    }

    const sites = [];
    const websiteScan = [];

    for (const group of groups) {
      // if(group.name.toLowerCase() === "usu"){
      //   continue;
      // }
      const groupFilter = await getGroupDetails(group.name);
      sites.push(...await getWebsites(groupFilter));
    }

    for (const website of sites) {
      const scanResult = await getScanResults(website.public_id);
      // console.log(website);
      websiteScan.push({
        'website_name': website.name,
        'full_url': website.full_url,
        'result': scanResult
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