#!/usr/bin/env node

require('yargs')
  .commandDir('../lib/cmds')
  .demandCommand()
  //.completion('completion', require('../lib/completion'))
  .help()
  .argv

// // const chalk = require('chalk')
// // const boxen = require('boxen')
// const yargs = require('yargs')
// // const shell= require('shelljs')
// // const unzip = require('unzip')
// // const readline = require('readline-promise')

// // const bbAuth = require('../lib/bitbucket-login')
// const completion = require('../lib/completion')
// // const elmApp = require('../lib/elm-app')
// // const { setConfigProp, getConfigProp } = require('../lib/config')

// // if(!process.env.BB_AUTH){
// //    throw new Error('BB_AUTH environment variable is missing, please export it!')
// // }

// // if(!process.env.BB_TEAM){
// //    throw new Error('BB_TEAM environment variable is missing, please export it!')
// // }

// // const BB_AUTH = process.env.BB_AUTH
// // const [ BB_USER, BB_PWD ] = process.env.BB_AUTH.split(/:/)
// // const BB_TEAM = process.env.BB_TEAM
// // const BB_BASE_URL = 'https://api.bitbucket.org'
// // const BBWEB_BASE_URL = 'https://bitbucket.org'
// // const TEMPLATE_PROJECT_NAME = 'elm-alicia-template'

// // const Authorization = `Basic ${Buffer.from(BB_AUTH).toString('base64')}`
// // const headers = { Authorization }

// // const bbProjectList = async yargs => {
// //    try {
// //       const resp  = await json(endpoints.projects(), { headers })
// //       console.log('KEY\tName\tCreated')
// //       resp.values.forEach(p => {
// //          console.log([p.key,p.name,p.created_on].join('\t'))
// //       })
// //    }
// //    catch (err) {
// //       console.log(err)
// //    }
// //    console.log('list bitbucket projects')
// // }

// require('yargs')
  

// yargs
//    .scriptName("ktools")
//    // .usage('$0 <cmd> [args]')
//    .commandDir('cmds')
//    .demandCommand()
//    // .completion('completion', completion)
//    .help()
//    .argv
   
// // [ 
// // //  require('../lib/bitbucket-login'),
// // //  require('../lib/elm-app'),
// //    getConfigProp,
// //    setConfigProp
// // ].forEach(command => yargs.command(command.template, command.desc, command.help, command.impl))  
   
//    // .command('elm-app <name>', 'Crear un proyecto elm-app', yargs => {
//    //    yargs.positional('name', { type: 'string', describe: 'nombre del proyecto' })
//    // }, elmApp)
//    // .command('bitbucket projects list', 'Lista los proyectos que tienes en bitbucket', bbProjectList)
//    // .command('bitbucket auth', 'Autenticar al usuario en bitbucket', bbAuth)
//    // .command('config create-context <name>', 'crea un contexto de configuracion', yargs => {
//    //    yargs.positional('name', { type: 'string', describe: 'nombre del nuevo contexto de configuracion' })
//    // }, createContext)
// // yargs   
// //    .completion('completion', completion)
// //    .help()
// //    .argv

// // const options = yargs
// // 	.usage('Usage: $0 --web <name>')
// // 	.option('n', { alias: 'name', describe: 'Your name', type: 'string', demandOption: true })
// // 	.argv

// // const greeting = chalk.white.bold(`Hello, ${options.name}!`)

// // const boxenOptions = {
// //    padding: 1,
// //    margin: 1,
// //    borderStyle: "round",
// //    borderColor: "green",
// //    backgroundColor: "#555555"
// // }

// // const msgBox = boxen( greeting, boxenOptions)
// // console.log(msgBox)
