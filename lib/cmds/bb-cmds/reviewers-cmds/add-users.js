const _ = require('lodash')
const fs = require('fs')
const { Bitbucket } = require('bitbucket')
const { Clone, Cred } = require('nodegit')
const homedir = require('os').homedir()

const { Configuration, PROP_BITBUCKET_LOGIN, PROP_BITBUCKET_TEAM, PROP_ELM_V19_REPO_SRC } = require('../../configuration')

exports.command = 'add-user <userId>'
exports.desc = 'Clonar un repositorio a partir de su nombre'
exports.builder = yargs => yargs
    .option('kind', {
        describe: 'estable el tipo de revision que se quiere agregar al pool-request',
        type: 'string',
        required: true
    })
    .positional('userId', {
        describe: 'Id de usuario bitbucket que se quiere agregar al pool',
        type: 'string'   
    })
    
exports.handler = async ({ kind, userId }) => {
    try {
        const conf = new Configuration
        conf.addReviewers({ kind, user: userId })
    }
    catch(err){
        console.error(err)
    }
}