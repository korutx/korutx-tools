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

exports.command = 'done <issueId>'
exports.desc = 'Cerrar un issue y enviarlo a revisión'
exports.builder = yargs => yargs
    .positional('issueId', {
        describe: 'identificador del issue en Jira',
        type: 'string'   
    })
    
exports.handler = async ({ issueId }) => {
    try {
        const conf = new Configuration
        const [ email, api_token ] = conf.getConfig(PROP_JIRA_LOGIN).split(':')
        const gitName = conf.getConfig(PROP_GIT_NAME)
        const gitEmail = conf.getConfig(PROP_GIT_EMAIL)
        const jiraHost = conf.getConfig(PROP_JIRA_HOST)
        const jira = new JiraClient({
            host: jiraHost,
            strictSSL: true,
            basic_auth: { email, api_token }
        })
        
        // git init, git add && git commit
        const repo = await Repository.open('.git')
        
        const index = await repo.refreshIndex()
        await repo.getBranch(`feature-${issueId}`)
        await index.addAll()
        await index.write()
        const oid = await index.writeTree()
        const head = await Reference.nameToId(repo, "HEAD")
        const parent = await repo.getCommit(head)
        const author = Signature.now(gitName, gitEmail);
        const committer = Signature.now(gitName, gitEmail)
        const commitId = await repo.createCommit(
            "HEAD", 
            author, 
            committer, 
            `closing ${issueId} #code-review" #comment Ticket listo y enviado a Code Review`, 
            oid, 
            [ parent ]
        )
        console.log(`New commit: ${commitId}`)
        
        
        const remote = await repo.getRemote('origin')
        const publickey = fs.readFileSync(conf.getConfig(PROP_GIT_PUBLIC_KEY)).toString()
        const privatekey = fs.readFileSync(conf.getConfig(PROP_GIT_PRIVATE_KEY)).toString()
        const passphrase = conf.getConfig(PROP_GIT_PRIVATE_PASSPHRASE)
        const credentials = await Cred.sshKeyMemoryNew('git', publickey, privatekey, passphrase)
        await remote.push(
            [`refs/heads/feature-${issueId}:refs/heads/feature-${issueId}`],
            { callbacks: { credentials: () => credentials } }
        )
        
        /*Sin Smart Comment*/
        // const { transitions } = await jira.issue.getTransitions({ issueId })
        // const transitionTo = transitions.find(t => t.name.toUpperCase() == 'CODE REVIEW')
        // await jira.issue.transitionIssue({ issueId, transition: { id: transitionTo.id }})
        // await jira.issue.addComment({ 
        //     issueId, 
        //     body: `Ticket listo y enviado a Code Review` 
        // })
        
        const team = conf.getConfig(PROP_BITBUCKET_TEAM)
        const repo_slug = remote.url().match(/([A-Za-z0-9\-]+)\.git$/)[1]
        const [ username, password ] = conf.getConfig(PROP_BITBUCKET_LOGIN).split(':')
        const reviewers = conf.getBitbucketReviewers({ kind: "elm" })
        const bitbucket = new Bitbucket({ auth: { username, password }, notice: false })
        const { data, headers } = await bitbucket.pullrequests.create(
            { _body: {
                title: `Issue: https://${jiraHost}/browse/${issueId} ${issueId}`,
                source: { branch: { name: `feature-${issueId}` }},
                destination: { branch: { name: 'development' }},
                reviewers,
                description: `Solicitud de revisión del requerimiento https://${jiraHost}/browse/${issueId} a la rama development. Esta solicitud ha sido creada automáticamente por ktools`,
                close_source_branch: true
            }, repo_slug, username: team })
        
        console.log(`Issue ${issueId} ha sido enviado a CODE-REVIEW, revisores: ${data.reviewers.map(r => r.display_name).join()}`)
        // console.log(JSON.stringify(await bitbucket.teams.getMembers({ username: 'teamdox' })))
        // console.log(`ISSUE ABIERTO. Para mantener sus cambios al dia use 'ktools issue push ${issueId}'`)
    }
    catch(err){
        
        if(err.name == `HTTPError`){
            console.log(JSON.stringify(err.error))
        }
        else {
            console.error(err)
        }
    }
}