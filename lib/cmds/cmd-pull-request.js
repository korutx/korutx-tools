exports.command = 'pull-request <command>'
exports.desc = 'Gestiona los pull-requests que tiene asociado el usuario autenticado'
exports.builder = yargs => yargs.commandDir('pull-request-cmds')
exports.handler = argv => {}