exports.command = 'project <command>'
exports.desc = 'Gestionar proyectos alojados en bitbucket'
exports.builder = yargs => yargs.commandDir('project-cmds')
exports.handler = {}