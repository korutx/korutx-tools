exports.command = 'user <command>'
exports.desc = 'Gestionar usuarios con el team configurado'
exports.builder = yargs => yargs.commandDir('user-cmds')
exports.handler = {}