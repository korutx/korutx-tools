const { getCurrentContext } = require('../configuration')

exports.command = 'current-context'
exports.desc = 'Muestra el contexto actual'
exports.builder = {}
exports.handler = () => console.log(getCurrentContext())