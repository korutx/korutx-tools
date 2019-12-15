const { Configuration } = require('../configuration')

exports.command = 'set <property>'
exports.desc = 'Establece una propiedad valor en archivo de configuracion'
exports.builder = { property: { type: 'string', describe: '<propname>=<propvalue>' }}
exports.handler = ({ property }) => (new Configuration).setConfig(property)