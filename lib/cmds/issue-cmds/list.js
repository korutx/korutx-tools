const _ = require('lodash')
const fs = require('fs')
const { Repository, Cred, Signature, Reference } = require("nodegit")
const { Bitbucket } = require('bitbucket')
const JiraClient = require("jira-connector")

const { 
    Configuration, 
    PROP_BITBUCKET_LOGIN, 
    PROP_GIT_PRIVATE_KEY, 
    PROP_GIT_PUBLIC_KEY,
    PROP_GIT_PRIVATE_PASSPHRASE,
    PROP_JIRA_LOGIN,
    PROP_JIRA_HOST,
    PROP_GIT_NAME,
    PROP_GIT_EMAIL,
    PROP_BITBUCKET_TEAM
} = require('../configuration')

exports.command = 'list'
exports.desc = 'Cerrar un issue y enviarlo a revisión'
exports.builder = yargs => yargs
    .positional('issueId', {
        describe: 'identificador del issue en Jira',
        type: 'string'   
    })
    
exports.handler = async ({ issueId }) => {
    try {
        console.log('Unimplemented')
        // console.log(JSON.stringify(await bitbucket.teams.getMembers({ username: 'teamdox' })))
        // console.log(`ISSUE ABIERTO. Para mantener sus cambios al dia use 'ktools issue push ${issueId}'`)
    }
    catch(err){
        
        if(err.name == `HTTPError`){
            console.log(err.error.error.message)
        }
        else {
            console.error(err)
        }
    }
}