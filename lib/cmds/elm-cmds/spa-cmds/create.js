const _ = require('lodash')
const fs = require('fs')
const { Bitbucket } = require('bitbucket')
const homedir = require('os').homedir()
const shell = require('shelljs')
const { Repository, Signature, Remote, Cred } = require("nodegit")
const AdmZip = require('adm-zip')

const { 
    Configuration, 
    PROP_BITBUCKET_LOGIN, 
    PROP_BITBUCKET_TEAM, 
    PROP_ELM_V19_REPO_SPA,
    PROP_GIT_NAME,
    PROP_GIT_EMAIL
} = require('../../configuration')
const { downloadVersion } = require('../../../api')

exports.command = 'create <name>'
exports.desc = 'Crear un modulo elm'
exports.builder = yargs => yargs
    .positional('name', {
        describe: 'nombre del modulo a crear',
        type: 'string'   
    })
    
exports.handler = async ({ name: destName }) => {
    try {
        const conf = new Configuration
        const authorization = conf.getConfig(PROP_BITBUCKET_LOGIN)
        const team = conf.getConfig(PROP_BITBUCKET_TEAM)
        const moduleSrc = conf.getConfig(PROP_ELM_V19_REPO_SPA)
        
        //descargar el sample-module
        const slug = 'elm-spa-template-0.19'
        const name = 'master'
        const cacheDir = `${homedir}/.ktx/cache/${slug}`
        
        shell.mkdir('-p', `${cacheDir}`)
        const content = await downloadVersion({ username: team, project_slug: slug, name }, authorization)
        fs.writeFileSync(`${cacheDir}/${name}.zip`, Buffer.from(content))

        // unzip sample-module
        console.log(`${cacheDir}/${name}.zip`)
		const zip = new AdmZip(`${cacheDir}/${name}.zip`)
		zip.extractAllTo(`${cacheDir}`, true)
		const path = zip.getEntries()[0].entryName.slice(0,-1)
        // cp sample-module elm-csf-core
        shell.cp(`-r`, `${cacheDir}/${path}`, `./${destName}`)
        // create bitbucket elm-csf-core
        console.log('creando repositorio en bitbucket!', `https://bitbucket.org/${team}/${destName}`)
        const [ username, password ] = authorization.split(/:/)
        const bitbucket = new Bitbucket({ auth: { username, password }, notice: false })
        
        const repoBb = await bitbucket.repositories.create({ repo_slug: destName, username: team, _body: {
            scm: "git",
            project: { key: moduleSrc },
            is_private: true
        }})
        
        // git init, git add && git commit
        
        const gitName = conf.getConfig(PROP_GIT_NAME)
        const gitEmail = conf.getConfig(PROP_GIT_EMAIL)
        
        const repo = await Repository.init(`./${destName}`, 0)
        const index = await repo.refreshIndex()
        await index.addAll()
        await index.write()
        const oid = await index.writeTree()
        const author = Signature.now(gitName, gitEmail);
        const committer = Signature.now(gitName, gitEmail)
        const commitId = await repo.createCommit("HEAD", author, committer, "Initial commit", oid, []);
        console.log(`New commit: ${commitId}`)
        const remote = await Remote.create(repo, "origin", `git@bitbucket.org:${team}/${destName}.git`)
        await repo.createBranch(`development`, commitId, 0)
        const publickey = fs.readFileSync(`${homedir}/.ssh/id_rsa.pub`).toString();
        const privatekey = fs.readFileSync(`${homedir}/.ssh/id_rsa`).toString();
        const credentials = await Cred.sshKeyMemoryNew('git', publickey, privatekey, '')
        await remote.push(
            [ "refs/heads/master:refs/heads/master",
              "refs/heads/development:refs/heads/development"
            ],
            { callbacks: { credentials: () => credentials } }
        )
        const ref = await repo.getBranch(`refs/heads/development`)
        await repo.checkoutRef(ref)
        console.log(`El proyecto ${destName} ha sido publicado en https://bitbucket.org/${team}/${destName}`)
        console.log(`Para comenzar a desarrollar su paquete ejecute: `)
        console.log(`cd ${destName} && elm-app start`)
    }
    catch(err){
        console.error(err)
    }
}