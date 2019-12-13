const _ = require('lodash')
const { Bitbucket } = require('bitbucket')
const { getConfig, PROP_BITBUCKET_LOGIN, PROP_BITBUCKET_TEAM, PROP_ELM_V19_REPO_SRC } = require('../configuration')

exports.command = 'module <action>'
exports.desc = 'Gestiona modulos de la aplicacion'
exports.builder = {
    action: { 
        type: 'string', 
        describe: '<list>|<install>|<remove>|<upgrade>' 
    }
}

exports.handler = ({ action }) => {
    try {
        if(['list', 'install', 'remove', 'upgrade'].indexOf(action) < 0) {
            console.error(`Unsupported action ${action}`)
            return
        }
        
        actions[action]()
        
    }
    catch(err){}
}

const list = async () => {
    try {
        const [ username, password ] = getConfig(PROP_BITBUCKET_LOGIN).split(':')
        const team = getConfig(PROP_BITBUCKET_TEAM)
        const moduleSrc = getConfig(PROP_ELM_V19_REPO_SRC)
        
        const bitbucket = new Bitbucket({ auth: { username, password }, notice: false })
        let { data, headers } = await bitbucket.repositories.list({ 
            q: `project.key="${moduleSrc}"`, username: team 
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

const actions = { list }


