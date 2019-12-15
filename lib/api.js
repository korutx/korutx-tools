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

const downloadVersion = async (params, authorization) => 
   buffer(endpoints.download(params), {
      headers: { Authorization: `Basic ${Buffer.from(authorization).toString('base64')}` }
   })

const endpoints = {
   download: ({ username, project_slug, name }) => 
      `https://bitbucket.org/${username}/${project_slug}/get/${name}.zip`
}

module.exports = { json, buffer, endpoints, downloadVersion }