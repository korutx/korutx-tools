#!/usr/bin/env node

const chalk = require('chalk')
// const boxen = require('boxen')
const yargs = require('yargs')
const fetch = require("node-fetch")
const homedir = require('os').homedir()
const shell= require('shelljs')
const fs = require('fs')
const unzip = require('unzip')

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
   download: name => `${BBWEB_BASE_URL}/${BB_TEAM}/${TEMPLATE_PROJECT_NAME}/get/${name}.zip`,
   projects: () => `${BB_BASE_URL}/2.0/teams/${BB_TEAM}/projects/?pagelen=100`,
   repositories: (team, name) => `${BB_BASE_URL}/2.0/repositories/${team}/${name}`,
}

const Authorization = `Basic ${Buffer.from(BB_AUTH).toString('base64')}`
const headers = { Authorization }

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
   try {
      
      const configPath = `${homedir}/.ktx/config.json`
      let config = {}
      
      if(fs.existsSync(configPath)){
         config = JSON.parse(fs.readFileSync(configPath))
      }
      
      const { values: [ { name: tagName } ]} = await json(endpoints.tags(), { headers })
      
      const cacheDir = `${homedir}/.ktx/cache/${TEMPLATE_PROJECT_NAME}/${tagName}`
      
      shell.mkdir('-p', `${cacheDir}`)
      const content = await buffer(endpoints.download(tagName), { headers })
      fs.writeFileSync(`${cacheDir}/${tagName}.zip`, Buffer.from(content))
   
      fs.createReadStream(`${cacheDir}/${tagName}.zip`)
         .pipe(unzip.Extract({ path: cacheDir })
            .on('finish', () => setTimeout(async () => {
               try {
                  const { length, [ length - 1 ]: currentDir } = shell.ls(`${cacheDir}`)
                  shell.mv( `${cacheDir}/${currentDir}`, `${cacheDir}/${tagName}`)
                  shell.mv(`${cacheDir}/${tagName}`, argv.name)
                  console.log('creando repositorio en bitbucket!', endpoints.repositories(config.bitbucket.team, argv.name))
                  const repo = await json(endpoints.repositories(config.bitbucket.team, argv.name), { 
                     method: 'POST',
                     headers: { ...headers, 'Content-Type': 'application/json' },
                     body: JSON.stringify({
                        scm: "git", 
                        project: { key: config.bitbucket.project }, 
                        is_private: true
                     })
                  })
                  console.log('repositorio en bitbucket ha sido creado')
                  shell.cd(argv.name)
                  console.log('iniciando git ...')
                  shell.exec('git init && git add . && git commit -m "initial commit"')
                  shell.exec(`git remote add origin git@bitbucket.org:teamdox/${argv.name}.git`)
                  shell.exec(`git push -u origin master`)
                  console.log(`Tu proyecto está listo, ejecuta: cd ${argv.name} && elm-app start`)
               } catch (err){
                  console.log(err)
               }
               
            }, 100))
         )
      
      
      
   } 
   catch (err) {
      console.error(err)
   }
  // const json = await resp.json()
   // 1. download template.zip ok
   // 2. mkdir sample-app ok
   // 3. unzip template.zip sample-app ok
   // 3. create-repository bitbucket named sample-app ok
   // 4. git init
   // 5. git add .
   // 6. git commit -m "initial"
   // 7. git push origin master
   // 8. git checkout -b development
   // 9. git push origin development
   // 10. elm-app start
}

const bbProjectList = async yargs => {
   try {
      const resp  = await json(endpoints.projects(), { headers })
      console.log('KEY\tName\tCreated')
      resp.values.forEach(p => {
         console.log([p.key,p.name,p.created_on].join('\t'))
      })
   }
   catch (err) {
      console.log(err)
   }
   console.log('list bitbucket projects')
}

const setConfigProp = ({ property }) => {
   const configPath = `${homedir}/.ktx/config.json`
   let config = {}
   
   if(fs.existsSync(configPath)){
      config = JSON.parse(fs.readFileSync(configPath))
   }
   
   const [ key, value ] = property.split('=')
   switch(key){
      case 'bitbucket.team': 
         config.bitbucket = config.bitbucket || {}
         config.bitbucket.team = value
         break;
      case 'bitbucket.login':
         config.bitbucket = config.bitbucket || {}
         config.bitbucket.login = value
         break;
      case 'bitbucket.project':
         config.bitbucket = config.bitbucket || {}
         config.bitbucket.project = value
         break;
      default:
         console.log(`unknown key ${key}`)
         return 1;
   }
   
   fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8')
}

yargs
   .scriptName("korutx")
   .usage('$0 <cmd> [args]')
   .command('elm-app <name>', 'Crear un proyecto elm-app', yargs => {
      yargs.positional('name', { type: 'string', describe: 'nombre del proyecto' })
   }, elmApp)
   .command('bitbucket projects list', 'Lista los proyectos que tienes en bitbucket', bbProjectList)
   .command('config set <property>',  'establece una propiedad valor en archivo de configuracion', yargs => {
      yargs.positional('property', { type: 'string', describe: 'nombre de la propiedad que desea configurar' })
      yargs.positional('value', { type: 'string', describe: 'valor de la propiedad que desea configurar' })
   }, setConfigProp)
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
