exports.command = 'issue <command>'
exports.desc = 'Gestiona los issues integrando Jira con Bitbucket'
exports.builder = yargs => yargs.commandDir('issue-cmds')
exports.handler = argv => {}