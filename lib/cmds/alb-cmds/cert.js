exports.command = 'cert <command>'
exports.desc = 'Gestionar certificados de alberto'
exports.builder = yargs => yargs.commandDir('cert-cmds')
exports.handler = {}