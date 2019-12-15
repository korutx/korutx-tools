const { Configuration } = require('../configuration')

exports.command = 'create-context <name>'
exports.desc = 'Crea un nuevo contexto en la configuracion'
exports.builder = { name: { type: 'string', describe: 'nombre del contexto a crear' }}
exports.handler = async ({ name }) => (new Configuration).createContext(name)