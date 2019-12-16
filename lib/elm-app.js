const homedir = require('os').homedir()
const fs = require('fs')
const { json, buffer, endpoints } = require("./api")

const fun_ = async argv => {
    try {
      
      const configPath = `${homedir}/.ktx/config.json`
      let config = {}
      
      if(fs.existsSync(configPath)){
         config = JSON.parse(fs.readFileSync(configPath))
      }
      
      const { values: [ { name: tagName } ]} = await json(endpoints.tags(), { headers })
      
      const cacheDir = `${homedir}/.ktx/cache/${TEMPLATE_PROJECT_NAME}/${tagName}`
      
      shell.mkdir('-p', `${cacheDir}`)
      const content = await buffer(endpoints.download(tagName), { headers })
      fs.writeFileSync(`${cacheDir}/${tagName}.zip`, Buffer.from(content))
      
      fs.createReadStream(`${cacheDir}/${tagName}.zip`)
         .pipe(unzip.Extract({ path: cacheDir })
            .on('finish', () => setTimeout(async () => {
               try {
                  const { length, [ length - 1 ]: currentDir } = shell.ls(`${cacheDir}`)
                  shell.mv( `${cacheDir}/${currentDir}`, `${cacheDir}/${tagName}`)
                  shell.mv(`${cacheDir}/${tagName}`, argv.name)
                  console.log('creando repositorio en bitbucket!', endpoints.repositories(config.bitbucket.team, argv.name))
                  const repo = await json(endpoints.repositories(config.bitbucket.team, argv.name), { 
                     method: 'POST',
                     headers: { ...headers, 'Content-Type': 'application/json' },
                     body: JSON.stringify({
                        scm: "git", 
                        project: { key: config.bitbucket.project }, 
                        is_private: true
                     })
                  })
                  console.log('repositorio en bitbucket ha sido creado')
                  shell.cd(argv.name)
                  console.log('iniciando git ...')
                  shell.exec('git init && git add . && git commit -m "initial commit"')
                  shell.exec(`git remote add origin git@bitbucket.org:teamdox/${argv.name}.git`)
                  shell.exec(`git push -u origin master`)
                  console.log(`Tu proyecto está listo, ejecuta: cd ${argv.name} && elm-app start`)
               } catch (err){
                  console.log(err)
               }
               
            }, 100))
         )
      
      
      
   } 
   catch (err) {
      console.error(err)
   }
  // const json = await resp.json()
   // 1. download template.zip ok
   // 2. mkdir sample-app ok
   // 3. unzip template.zip sample-app ok
   // 3. create-repository bitbucket named sample-app ok
   // 4. git init
   // 5. git add .
   // 6. git commit -m "initial"
   // 7. git push origin master
   // 8. git checkout -b development
   // 9. git push origin development
   // 10. elm-app start
}

module.exports = fun_