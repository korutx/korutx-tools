const readline = require('readline-promise').default
const mutableStdOut = require('./mutable-stdout')

const fun_ = async argv => {

    const readSimple = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    const username = await readSimple.questionAsync('usuario: ')
    readSimple.close()
    
    const readHide = readline.createInterface({ input: process.stdin, output: mutableStdOut(), terminal: true })
    const password = await readHide.questionAsync('password: ')
    readHide.close()
    
    console.log(username, password)
    
}

module.exports = fun_