exports.command = 'reviewers <command>'
exports.desc = 'Agregar usuarios revisores a la poll-request'
exports.builder = yargs => yargs.commandDir('reviewers-cmds')
exports.handler = {}