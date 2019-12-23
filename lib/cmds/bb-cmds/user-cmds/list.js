const _ = require('lodash')
const fs = require('fs')
const { Bitbucket } = require('bitbucket')
const { Clone, Cred } = require('nodegit')
const homedir = require('os').homedir()

const { Configuration, PROP_BITBUCKET_LOGIN, PROP_BITBUCKET_TEAM, PROP_ELM_V19_REPO_SRC } = require('../../configuration')

exports.command = 'list'
exports.desc = 'Clonar un repositorio a partir de su nombre'
exports.builder = yargs => yargs
    // .option('filter', {
    //     describe: 'valor para reducir la lista de repositorios por nombre',
    //     type: 'string'
    // })
    
exports.handler = async (/*{ filter }*/) => {
    try {
        const conf = new Configuration
        const [ username, password ] = conf.getConfig(PROP_BITBUCKET_LOGIN).split(':')
        const team = conf.getConfig(PROP_BITBUCKET_TEAM)
        
        let args = { username: team, pagelen: 100 }
        // if(filter){
        //     args.q = `nickname~"${filter}"`
        // }
        
        const bitbucket = new Bitbucket({ auth: { username, password }, notice: false })
        
        const oldLog = console.log
        console.log = () => {}
        const { data, headers } = await bitbucket.teams.getMembers(args)
        console.log = oldLog
        const colLen = 30
        console.log(`${'NICKNAME'.padEnd(colLen, ' ')}\tUUID`)
        
        data.values.forEach((user, index) => {
            let nickname = user.nickname
            if(nickname.length > colLen){
                nickname = nickname.slice(0, colLen-3) + '...'
            }
            else {
                nickname = nickname.padEnd(colLen, ' ')
            }
            console.log(`${nickname}\t${user.uuid}`)
        })
    }
    catch(err){
        console.log(err)
    }
}