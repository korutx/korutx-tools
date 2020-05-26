exports.command = 'spa <action>'
exports.desc = 'Gestiona aplicaciones de la aplicacion'
exports.builder = yargs => yargs.commandDir('spa-cmds')
exports.handler = {}