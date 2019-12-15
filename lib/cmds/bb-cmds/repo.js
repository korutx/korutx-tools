exports.command = 'repo <command>'
exports.desc = 'Gestionar repositorios alojados en bitbucket'
exports.builder = yargs => yargs.commandDir('repo-cmds')
exports.handler = {}