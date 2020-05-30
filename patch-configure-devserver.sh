#!/bin/bash
# die () {
#     echo >&2 "$@"
#     exit 1
# }
# v=4.2.24
# [ "$v" = "4.2.24" ] || 
#     die "Patch solo puede aplicarse a create-elm-app@4.2.24, se encontro $v"
nmpath="$1"
paths_js="$nmpath/create-elm-app/config/paths.js"
start_js="$nmpath/create-elm-app/scripts/start.js"
patch1=$(cat << EOF
21c21,22
< 
---
> const configureDevServer = 
>   typeof config.configureDevServer === 'function' ? config.configureDevServer : id;
84c85,86
<   configureWebpack
---
>   configureWebpack,
>   configureDevServer  
EOF
)
patch2=$(cat << EOF
174c174
<     const serverConfig = createDevServerConfig(
---
>     const serverConfig = paths.configureDevServer(createDevServerConfig(
177c177
<     );
---
>     ), process.env.NODE_ENV);  
EOF
)
echo "$patch1" | patch $paths_js
echo "$patch2" | patch $start_js
