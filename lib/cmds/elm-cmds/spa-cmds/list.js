const _ = require('lodash')
const { Bitbucket } = require('bitbucket')
const { Configuration, PROP_BITBUCKET_LOGIN, PROP_BITBUCKET_TEAM, PROP_ELM_V19_REPO_SPA } = require('../../configuration')

exports.command = 'list [args]'
exports.desc = 'Listar repositorios'
exports.builder = yargs => yargs
    .option('username', {
        describe: 'username target para búsqueda, por defecto usará el la configuración de contexto bitbucket.team',
        type: 'string'   
    })
    .option('filter', {
        describe: 'valor para reducir la lista de repositorios por nombre',
        type: 'string'   
    })
    

exports.handler = async (params) => {
    try {
        const conf = new Configuration()
        const [ username, password ] = conf.getConfig(PROP_BITBUCKET_LOGIN).split(':')
        const team = conf.getConfig(PROP_BITBUCKET_TEAM)
        const moduleSrc = conf.getConfig(PROP_ELM_V19_REPO_SPA)
        
        const bitbucket = new Bitbucket({ auth: { username, password }, notice: false })
        let { data, headers } = await bitbucket.repositories.list({ 
            q: `project.key="${moduleSrc}"`, username: team, pagelen: 100
        })
        
        const tags = await Promise.all(data.values.map(repo => bitbucket.repositories.listTags({ 
            repo_slug: repo.slug,
            username: team
        })))
        
        data.values.forEach((repo, index) => {
            console.log(`${repo.name}\t${tags[index].data.values.map(tag => tag.name).join('\t')}`)
        })
    }
    catch(err){
        console.log(err)
    }
}