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
    PROP_BITBUCKET_TEAM,
    PROP_ELM_V19_REPO_SRC
} = require('../configuration')

exports.command = 'diff <id>'
exports.desc = 'Listar los pull request que tiene asociado la persona para un tipo de proyecto'
exports.builder = yargs => yargs
    .positional('id', {
        describe: 'muestra el diff del pullrequest',
        type: 'string'
    })
    
async function getModules(conf, team, bitbucket){
   
    
    const moduleSrc = conf.getConfig(PROP_ELM_V19_REPO_SRC)
    let { data, headers } = await bitbucket.repositories.list({ 
        q: `project.key="${moduleSrc}"`, username: team 
    })
    
    return data
}
    
exports.handler = async ({ id }) => {
    try {
        
        
        const conf = new Configuration
        const [ email, api_token ] = conf.getConfig(PROP_JIRA_LOGIN).split(':')
        
        const team = conf.getConfig(PROP_BITBUCKET_TEAM)
        const [ username, password ] = conf.getConfig(PROP_BITBUCKET_LOGIN).split(':')
        const bitbucket = new Bitbucket({ auth: { username, password }, notice: false })
        
        const gitName = conf.getConfig(PROP_GIT_NAME)
        const gitEmail = conf.getConfig(PROP_GIT_EMAIL)
        const jiraHost = conf.getConfig(PROP_JIRA_HOST)
        const jira = new JiraClient({
            host: jiraHost,
            strictSSL: true,
            basic_auth: { email, api_token }
        })
        
        const [ repo_slug, pull_request_id ] = id.split(/\//)
        
        let { data, headers } = await bitbucket.pullrequests.getDiff({ pull_request_id, repo_slug, username: team })
           
        console.log(data)
        
        
        // // git init, git add && git commit
        // const repo = await Repository.open('.git')
        
        
        // /*Sin Smart Comment*/
        // // const { transitions } = await jira.issue.getTransitions({ issueId })
        // // const transitionTo = transitions.find(t => t.name.toUpperCase() == 'CODE REVIEW')
        // // await jira.issue.transitionIssue({ issueId, transition: { id: transitionTo.id }})
        // // await jira.issue.addComment({ 
        // //     issueId, 
        // //     body: `Ticket listo y enviado a Code Review` 
        // // })
        
        // const team = conf.getConfig(PROP_BITBUCKET_TEAM)
        // const repo_slug = remote.url().match(/([A-Za-z0-9\-]+)\.git$/)[1]
        // const [ username, password ] = conf.getConfig(PROP_BITBUCKET_LOGIN).split(':')
        // const reviewers = conf.getBitbucketReviewers({ kind: "elm" })
        // const bitbucket = new Bitbucket({ auth: { username, password }, notice: false })
        // const { data, headers } = await bitbucket.pullrequests.create(
        //     { _body: {
        //         title: `Issue: https://${jiraHost}/browse/${issueId} ${issueId}`,
        //         source: { branch: { name: `feature-${issueId}` }},
        //         destination: { branch: { name: 'development' }},
        //         reviewers,
        //         description: `Solicitud de revisión del requerimiento https://${jiraHost}/browse/${issueId} a la rama development. Esta solicitud ha sido creada automáticamente por ktools`,
        //         close_source_branch: true
        //     }, repo_slug, username: team })
        
        // console.log(`Issue ${issueId} ha sido enviado a CODE-REVIEW, revisores: ${data.reviewers.map(r => r.display_name).join()}`)
        // // console.log(JSON.stringify(await bitbucket.teams.getMembers({ username: 'teamdox' })))
        // // console.log(`ISSUE ABIERTO. Para mantener sus cambios al dia use 'ktools issue push ${issueId}'`)
    }
    catch(err){
        console.error(err)
    }
}