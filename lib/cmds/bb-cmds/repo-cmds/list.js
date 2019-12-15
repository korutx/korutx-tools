const _ = require('lodash')
const { Bitbucket } = require('bitbucket')
const { Configuration, PROP_BITBUCKET_LOGIN, PROP_BITBUCKET_TEAM } = require('../../configuration')

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
    

exports.handler = async ({ action, ...params }) => {
    try {
        const conf = new Configuration
        const [ username, password ] = conf.getConfig(PROP_BITBUCKET_LOGIN).split(':')
        const team = conf.getConfig(PROP_BITBUCKET_TEAM)
        
        let args = { username: team, pagelen: 100 }
        if(params.filter){
            args.q = `name~"${params.filter}"`
        }
        
        const bitbucket = new Bitbucket({ auth: { username, password }, notice: false })
        let { data, headers } = await bitbucket.repositories.list(args)
        data.values.forEach((repo, index) => {
            console.log(`${repo.name}`)
        })
    }
    catch(err){
        console.log(err)
    }
}