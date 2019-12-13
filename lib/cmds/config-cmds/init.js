const { init } = require('../configuration')

exports.command = 'init [template]'
exports.desc = 'Inicializa el ambiente ktools'
exports.builder = yargs => yargs.option('template', {
    describe: 'Identificador de template para configuracion\nactualmente solo soporta dox-1.0.0',
    type: 'string'   
})

// { template: { type: 'string', describe: 'nombre de un template para inicializacion' }}
exports.handler = ({ template }) => console.log(init(template))