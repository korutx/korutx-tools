const _ = require('lodash')
const fs = require('fs')
const { Bitbucket } = require('bitbucket')

const { Configuration, PROP_BITBUCKET_LOGIN, PROP_BITBUCKET_TEAM } = require('../../configuration')

exports.command = 'create [name]'
exports.desc = 'Crear un proyecto'
exports.builder = {}
exports.handler = ({ name }) => {
    console.log(`create bb project ${name}`)
    
    const conf = new Configuration
    const [ username, password ] = conf.getConfig(PROP_BITBUCKET_LOGIN).split(':')
    const team = conf.getConfig(PROP_BITBUCKET_TEAM)
    
    const bitbucket = new Bitbucket({ auth: { username, password }, notice: false })
}