const { Configuration } = require('../configuration')

exports.command = 'set-context <name>'
exports.desc = 'Configura la aplicacion con el contexto de configuracion deseado'
exports.builder = { name: { type: 'string', describe: 'nombre a establecer' }}
exports.handler = async ({ name }) => (new Configuration).setCurrentContext(name)