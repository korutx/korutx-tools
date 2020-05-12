const _ = require('lodash')
const fs = require('fs')
const { Repository, Cred } = require("nodegit")
const JiraClient = require("jira-connector")

const { 
    Configuration, 
    PROP_BITBUCKET_LOGIN, 
    PROP_GIT_PRIVATE_KEY, 
    PROP_GIT_PUBLIC_KEY,
    PROP_GIT_PRIVATE_PASSPHRASE,
    PROP_JIRA_LOGIN,
    PROP_JIRA_HOST
} = require('../configuration')

exports.command = 'open <issueId>'
exports.desc = 'Abrir un issue para desarrollo'
exports.builder = yargs => yargs
    .positional('issueId', {
        describe: 'identificador del issue en Jira',
        type: 'string'   
    })
    
exports.handler = async ({ issueId }) => {
    try {
        const conf = new Configuration
        const [ email, api_token ] = conf.getConfig(PROP_JIRA_LOGIN).split(':')
        const jiraHost = conf.getConfig(PROP_JIRA_HOST)
        const jira = new JiraClient({
            host: jiraHost,
            strictSSL: true,
            basic_auth: { email, api_token }
        })
        
        // git init, git add && git commit
        const repo = await Repository.open('.git')
        const commit = await repo.getHeadCommit()
        await repo.createBranch(`feature-${issueId}`, commit, 0)
        const remote = await repo.getRemote('origin')
        const publickey = fs.readFileSync(conf.getConfig(PROP_GIT_PUBLIC_KEY)).toString()
        const privatekey = fs.readFileSync(conf.getConfig(PROP_GIT_PRIVATE_KEY)).toString()
        const passphrase = conf.getConfig(PROP_GIT_PRIVATE_PASSPHRASE)
        const credentials = await Cred.sshKeyMemoryNew('git', publickey, privatekey, passphrase)
        await remote.push(
            [`refs/heads/feature-${issueId}:refs/heads/feature-${issueId}`],
            { callbacks: { credentials: () => credentials } }
        )
        const ref = await repo.getBranch(`refs/heads/feature-${issueId}`)
        await repo.checkoutRef(ref)
        
        const { transitions } = await jira.issue.getTransitions({ issueId })
        // const transitionFrom = transitions.find(t => t.name.toUpperCase() == 'POR HACER')
        const transitionTo = transitions.find(t => t.name.toUpperCase() == 'EN CURSO' || t.name.toUpperCase() == 'TO DO')
        await jira.issue.transitionIssue({ issueId, transition: { id: transitionTo.id }})
        await jira.issue.addComment({ 
            issueId, 
            body: `${issueId}` 
        })
        console.log(`ISSUE ABIERTO. Para mantener sus cambios al dia use 'ktools issue done ${issueId}'`)
    }
    catch(err){
        console.error(err)
    }
}