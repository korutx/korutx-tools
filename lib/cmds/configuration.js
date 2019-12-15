const _ = require('lodash')
const homedir = require('os').homedir()
const fs = require('fs')
const shell= require('shelljs')

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

const initTemplates = {
    'dox-1.0.0' : {
        "context": {
            "default": {
              "bitbucket": {
                "team": "teamdox",
              },
              "elm": {
                "v19": {
                  "repo": {
                    "src": "ELM_019X"
                  }
                }
              }
            }
        },
        "currentContext": "default"
    }
}



const checkAllowedProps = property => {
    if(ALLOWED_PROPS.indexOf(property) < 0){
        console.error(`unknown property ${property}`)
        throw new Error(`unknown property ${property}`)
    }
}

class Configuration {
    
    constructor(props){
        this.config = this.readConfig()
    }
    
    readConfig(){ 
        return fs.existsSync(FILENAME) ? JSON.parse(fs.readFileSync(FILENAME)) : {}
    }
    
    writeConfig(config){
        fs.writeFileSync(FILENAME, JSON.stringify(config, null, 2), 'utf-8')
        this.config = config
    }
    
    init(template) {
        if(!fs.existsSync(FILENAME)){
            shell.mkdir('-p', `${homedir}/.ktx`)
            let config = initTemplates[template] || {}
            this.writeConfig(config)
            return 'ktools has been initialized sucessfully'
        }
        else {
            return 'ktools cant\'t be initialized because configuration already exists!'
        }
    }
    
    getConfig(property){
        try {
            checkAllowedProps(property)
            const currentContext = this.config.currentContext || 'default'
            return _.get(this.config, `context.${currentContext}.${property}`, '')
        }
        catch(err){}
    }
    
    setConfig(property) {
        try {
            const [ key, value ] = property.split('=')
            checkAllowedProps(key)
            const currentContext = this.config.currentContext || 'default'
            _.set(this.config, `context.${currentContext}.${key}`, value)
            this.writeConfig(this.config)
        }
        catch(err){}
    }
    
    async createContext(name) {
        try {
            if(_.get(this.config, `context.${name}`)){
                console.error(`context ${name} already exists`)
            }
            else {
                _.set(this.config, `context.${name}`, {})
                this.writeConfig(this.config)
            }
        }
        catch(err){}
    }
    
    getCurrentContext() {
        return _.get(this.config, `currentContext`, 'there is not current context defined')
    }
    
    setCurrentContext(name){
        if(!_.get(this.config, `context.${name}`)){
            console.error(`context ${name} does not exists`)
        }
        else {
            _.set(this.config, `currentContext`, name)
            this.writeConfig(this.config)
        }
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
    Configuration
}