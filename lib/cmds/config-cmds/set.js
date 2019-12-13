const _ = require('lodash')
const { setConfig } = require('../configuration')

exports.command = 'set <property>'
exports.desc = 'Establece una propiedad valor en archivo de configuracion'
exports.builder = { property: { type: 'string', describe: '<propname>=<propvalue>' }}
exports.handler = ({ property }) => setConfig(property)