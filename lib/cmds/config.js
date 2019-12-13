exports.command = 'config <command>'
exports.desc = 'Gestiona la configuracion de la herramienta'
exports.builder = yargs => yargs.commandDir('config-cmds')
exports.handler = argv => {}

// const FILENAME = `${homedir}/.ktx/config.json`

// const readConfig = () => fs.existsSync(FILENAME) ? JSON.parse(fs.readFileSync(FILENAME)) : {}
// const writeConfig = config => fs.writeFileSync(FILENAME, JSON.stringify(config, null, 2), 'utf-8')

// const ALLOWED_PROPS = [
//     'bitbucket.team',
//     'bitbucket.login',
//     'bitbucket.project',
//     'context'
// ]

// const checkAllowedProps = property => {
//     if(ALLOWED_PROPS.indexOf(property) < 0){
//         console.error(`unknown property ${property}`)
//         return Promise.reject()
//     }
//     return Promise.resolve()
// }

// const get_ =  {
//     template: 'config get <property>',
//     desc: 'Muestra el valor de una propiedad en archivo de configuracion',
//     help: yargs => {
//       yargs.positional('property', { type: 'string', describe: 'Nombre de la propiedad que desea leer' })
//     },
//     impl: ({ property }) => {
//         try {
//             checkAllowedProps(property)
//             console.log('get_', readConfig())
//             console.log(_.get(readConfig(), property, ''))
//         }
//         catch(err){}
//     }
// }

// const set_ = {
    
//     template: 'config-set <property>',
//     desc: 'Establece una propiedad valor en archivo de configuracion',
//     help: yargs => {
//       yargs.positional('property', { type: 'string', describe: 'nombre de la propiedad que desea configurar' })
//     },
//     impl: ({ property }) => {
//         const config = readConfig()
//         const [ key, value ] = property.split('=')
//         _.set(config, key, value)
//         console.log('set_', config)
//         writeConfig(config)
//     }
// }

// module.exports = { setConfigProp: set_, getConfigProp: get_ }