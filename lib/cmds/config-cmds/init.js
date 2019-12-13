const { init } = require('../configuration')

exports.command = 'init [template]'
exports.desc = 'Inicializa el ambiente ktools'
exports.builder = { template: { type: 'string', describe: 'nombre de un template para inicializacion' }}
exports.handler = ({ template }) => console.log(init(template))