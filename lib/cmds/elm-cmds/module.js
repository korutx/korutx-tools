exports.command = 'module <action>'
exports.desc = 'Gestiona modulos de la aplicacion'
exports.builder = yargs => yargs.commandDir('module-cmds')
exports.handler = {}