const _ = require('lodash')
const fs = require('fs')
const homedir = require('os').homedir()
const shell = require('shelljs')
const AdmZip = require('adm-zip')
const { downloadVersion } = require('../../../api')
const { Configuration, PROP_BITBUCKET_LOGIN, PROP_BITBUCKET_TEAM, PROP_ELM_V19_REPO_SRC } = require('../../configuration')

exports.command = 'install'
exports.desc = 'Instalar certificados de alberto'
exports.builder = yargs => yargs
    // .option('filter', {
    //     describe: 'valor para reducir la lista de repositorios por nombre',
    //     type: 'string'
    // })
    
exports.handler = async () => {
    try {
        const conf = new Configuration
        const authorization = conf.getConfig(PROP_BITBUCKET_LOGIN)
        const team = conf.getConfig(PROP_BITBUCKET_TEAM)
        
        //descargar el sample-module
        const slug = 'alb-certs'
        const name = 'master'
        const cacheDir = `${homedir}/.ktx/cache/${slug}`
        const destName = `${homedir}/.ktx/alb/certs`
        
        shell.mkdir('-p', `${cacheDir}`)
        shell.mkdir('-p', `${destName}`)
        const content = await downloadVersion({ username: team, project_slug: slug, name }, authorization)
        fs.writeFileSync(`${cacheDir}/${name}.zip`, Buffer.from(content))

        // unzip sample-module
        console.log(`${cacheDir}/${name}.zip`)
		const zip = new AdmZip(`${cacheDir}/${name}.zip`)
		zip.extractAllTo(`${cacheDir}`, true)
		const path = zip.getEntries()[0].entryName.slice(0,-1)
        shell.cp(`-r`, `${cacheDir}/${path}/*`, `${destName}`)
        console.log(`cert have been installed successfully!`)
    }
    catch(err){
        console.error(err)
    }
}