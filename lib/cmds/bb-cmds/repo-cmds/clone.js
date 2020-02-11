const _ = require('lodash')
const fs = require('fs')
const { Bitbucket } = require('bitbucket')
const { Clone, Cred } = require('nodegit')
const homedir = require('os').homedir()

const { Configuration, PROP_BITBUCKET_LOGIN, PROP_BITBUCKET_TEAM, PROP_ELM_V19_REPO_SRC } = require('../../configuration')

exports.command = 'clone [name]'
exports.desc = 'Clonar un repositorio a partir de su nombre'
exports.builder = yargs => yargs
    .positional('name', {
        describe: 'username target para búsqueda, por defecto usará el la configuración de contexto bitbucket.team',
        type: 'string'   
    })
    
exports.handler = async ({ name }) => {
    try {
        if (!name){ // intentar leer el param desde el stdin
            name = fs.readFileSync(0).toString().trim()
        }
        
        if(!name){
            console.log('param name es requerido')
            return
        }
        
        
        const conf = new Configuration
        const [ username, password ] = conf.getConfig(PROP_BITBUCKET_LOGIN).split(':')
        const team = conf.getConfig(PROP_BITBUCKET_TEAM)
        console.log(name, `"${team}"`)
        const bitbucket = new Bitbucket({ auth: { username, password }, notice: false })
        const repo = await bitbucket.repositories.get({ repo_slug: name, username: team })
        console.log(repo)
        const publickey = fs.readFileSync(`${homedir}/.ssh/id_rsa.pub`).toString();
        const privatekey = fs.readFileSync(`${homedir}/.ssh/id_rsa`).toString();
        const credentials = await Cred.sshKeyMemoryNew('git', publickey, privatekey, '')
        await Clone(`git@bitbucket.org:${team}/${repo.data.slug}.git`, `./${repo.data.slug}`, { 
            fetchOpts: {
                callbacks: {
                    credentials: () => credentials
                }
            }
        })
        console.log(`${repo.data.slug} cloned sucessfully on .'/${repo.data.slug}'`)
    }
    catch(err){
        console.error(err)
    }
}