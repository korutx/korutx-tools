#!/usr/bin/env node

const chalk = require('chalk')
// const boxen = require('boxen')
const yargs = require('yargs')
const fetch = require("node-fetch")

if(!process.env.BB_AUTH){
   throw new Error('BB_AUTH environment variable is missing, please export it!')
}

if(!process.env.BB_TEAM){
   throw new Error('BB_TEAM environment variable is missing, please export it!')
}

const BB_AUTH = process.env.BB_AUTH
const [ BB_USER, BB_PWD ] = process.env.BB_AUTH.split(/:/)
const BB_TEAM = process.env.BB_TEAM
const BB_BASE_URL = 'https://api.bitbucket.org'
const BBWEB_BASE_URL = 'https://bitbucket.org'
const TEMPLATE_PROJECT_NAME = 'elm-alicia-template'

const endpoints = {
   tags: () => `${BB_BASE_URL}/2.0/repositories/${BB_TEAM}/${TEMPLATE_PROJECT_NAME}/refs/tags?sort=-name`,
   download: name => `${BBWEB_BASE_URL}/${BB_TEAM}/${TEMPLATE_PROJECT_NAME}/get/${name}.zip`
}


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

const elmApp = async argv => {
   // korutx elm-app sample-app
   
   try {
      const Authorization = `Basic ${Buffer.from(BB_AUTH).toString('base64')}`
      const headers = { Authorization }
      const { values: [ { name: tagName } ]} = await json(endpoints.tags(), { headers })
      
      
      const homedir = require('os').homedir()
      const shell= require('shelljs')
      const fs = require('fs')
      const unzip = require('unzip')
      
      const cacheDir = `${homedir}/.ktx/cache/${TEMPLATE_PROJECT_NAME}/${tagName}`
      
      shell.mkdir('-p', `${cacheDir}`)
      const content = await buffer(endpoints.download(tagName), { headers })
      fs.writeFileSync(`${cacheDir}/${tagName}.zip`, Buffer.from(content))
      
   
      fs.createReadStream(`${cacheDir}/${tagName}.zip`)
         .pipe(unzip.Extract({ path: cacheDir })
            .on('finish', () => setTimeout(async () => {
               const { length, [ length - 1 ]: currentDir } = shell.ls(`${cacheDir}`)
               shell.mv( `${cacheDir}/${currentDir}`, `${cacheDir}/${tagName}`)
               shell.mv(`${cacheDir}/${tagName}`, argv.name)
               console.log(`Tu proyecto está listo, ejecuta: cd ${argv.name} && elm-app start`)
               
               
               
            }, 100))
         )
         
      
      
   } 
   catch (err) {
      console.error(err)
   }
  // const json = await resp.json()
   // 1. download template.zip
   // 2. mkdir sample-app
   // 3. unzip template.zip sample-app
   // 3. create-repository bitbucket named sample-app
   // 4. git init
   // 5. git add .
   // 6. git commit -m "initial"
   // 7. git push origin master
   // 8. git checkout -b development
   // 9. git push origin development
   // 10. elm-app start
}

yargs
   .scriptName("korutx")
   .usage('$0 <cmd> [args]')
   .command('elm-app <name>', 'Crear un proyecto elm-app', yargs => {
      yargs.positional('name', { type: 'string', describe: 'nombre del proyecto' })
   }, elmApp)
   .help()
   .argv

// const options = yargs
// 	.usage('Usage: $0 --web <name>')
// 	.option('n', { alias: 'name', describe: 'Your name', type: 'string', demandOption: true })
// 	.argv

// const greeting = chalk.white.bold(`Hello, ${options.name}!`)

// const boxenOptions = {
//    padding: 1,
//    margin: 1,
//    borderStyle: "round",
//    borderColor: "green",
//    backgroundColor: "#555555"
// }

// const msgBox = boxen( greeting, boxenOptions)
// console.log(msgBox)
