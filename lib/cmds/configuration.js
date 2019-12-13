const _ = require('lodash')
const homedir = require('os').homedir()
const fs = require('fs')

const PROP_BITBUCKET_TEAM = 'bitbucket.team'
const PROP_BITBUCKET_LOGIN = 'bitbucket.login'
const PROP_BITBUCKET_PROJECT = 'bitbucket.project'
const PROP_ELM_V19_REPO_SRC = 'elm.v19.repo.src'
const PROP_ELM_V19_REPO_KIND = 'elm.v19.repo.kind'
const PROP_CONTEXT = 'context'

const ALLOWED_PROPS = [
    PROP_BITBUCKET_TEAM,
    PROP_BITBUCKET_LOGIN,
    PROP_BITBUCKET_PROJECT,
    PROP_ELM_V19_REPO_SRC,
    PROP_ELM_V19_REPO_KIND,
    PROP_CONTEXT
]

const FILENAME = `${homedir}/.ktx/config.json`

const checkAllowedProps = property => {
    if(ALLOWED_PROPS.indexOf(property) < 0){
        console.error(`unknown property ${property}`)
        throw new Error(`unknown property ${property}`)
    }
}

const readConfig = () => fs.existsSync(FILENAME) ? JSON.parse(fs.readFileSync(FILENAME)) : {}
const writeConfig = config => fs.writeFileSync(FILENAME, JSON.stringify(config, null, 2), 'utf-8')

const getConfig = property => {
    try {
        checkAllowedProps(property)
        const config = readConfig()
        const currentContext = config.currentContext || 'default'
        return _.get(config, `context.${currentContext}.${property}`, '')
    }
    catch(err){}
}

const setConfig = property => {
    try {
        const [ key, value ] = property.split('=')
        checkAllowedProps(key)
        let config = readConfig()
        const currentContext = config.currentContext || 'default'
        _.set(config, `context.${currentContext}.${key}`, value)
        writeConfig(config)
    }
    catch(err){}
}

const createContext = async name => {
    try {
        let config = readConfig()
        if(_.get(config, `context.${name}`)){
            console.error(`context ${name} already exists`)
        }
        else {
            _.set(config, `context.${name}`, {})
            writeConfig(config)
        }
    }
    catch(err){}
}

const getCurrentContext = () => _.get(readConfig(), `currentContext`, 'there is not current context defined')
    
const setCurrentContext = name => {
    let config = readConfig()
    if(!_.get(config, `context.${name}`)){
        console.error(`context ${name} does not exists`)
    }
    else {
        _.set(config, `currentContext`, name)
        writeConfig(config)
    }
}
    
module.exports = {
    PROP_BITBUCKET_TEAM,
    PROP_BITBUCKET_LOGIN,
    PROP_BITBUCKET_PROJECT,
    PROP_ELM_V19_REPO_SRC,
    PROP_ELM_V19_REPO_KIND,
    PROP_CONTEXT,
    ALLOWED_PROPS,
    readConfig,
    getConfig,
    setConfig,
    createContext,
    getCurrentContext,
    setCurrentContext
}