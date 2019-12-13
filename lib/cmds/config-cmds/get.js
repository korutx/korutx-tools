const { getConfig } = require('../configuration')

exports.command = 'get <property>'
exports.desc = 'Muestra el valor de una propiedad en archivo de configuracion'
exports.builder = { property: { type: 'string', describe: 'nombre de la propiedad que desea leer' }}
exports.handler = ({ property}) => console.log(getConfig(property))