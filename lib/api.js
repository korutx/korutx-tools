const fetch = require("node-fetch")

const json = async (url, config) => {
   const resp = await fetch(url, config)
   if(resp.status > 200){
      const message = await resp.text()
      return Promise.reject({ message, status: resp.status })
   }
   else {
      return resp.json()
   }
}

const buffer = async (url, config) => {
   const resp = await fetch(url, config)
   if(resp.status > 200){
      const message = await resp.text()
      return Promise.reject({ message, status: resp.status })
   }
   else {
      return resp.arrayBuffer()
   }
}

const endpoints = {
   tags: () => `${BB_BASE_URL}/2.0/repositories/${BB_TEAM}/${TEMPLATE_PROJECT_NAME}/refs/tags?sort=-name`,
   download: name => `${BBWEB_BASE_URL}/${BB_TEAM}/${TEMPLATE_PROJECT_NAME}/get/${name}.zip`,
   projects: () => `${BB_BASE_URL}/2.0/teams/${BB_TEAM}/projects/?pagelen=100`,
   repositories: (team, name) => `${BB_BASE_URL}/2.0/repositories/${team}/${name}`,
}

module.exports = { json, buffer, endpoints }