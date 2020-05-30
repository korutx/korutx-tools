#!/bin/bash

PATCH1=$(cat configure-devserver.paths.js.diff)
PATCH2=$(cat configure-devserver.start.js.diff)
expected="4.2.24"
cat << EOF1 > patch-configure-devserver.sh
#!/bin/bash
die () {
    echo >&2 "\$@"
    exit 1
}
v=$(create-elm-app | tail -n1 | cut -d' ' -f1 | cut -d'@' -f2)
[ "\$v" = "$expected" ] || 
    die "Patch solo puede aplicarse a create-elm-app@$expected, se encontro \$v"
nmpath="\$1"
paths_js="\$nmpath/create-elm-app/config/paths.js"
start_js="\$nmpath/create-elm-app/scripts/start.js"
patch1=\$(cat << EOF
$PATCH1  
EOF
)
patch2=\$(cat << EOF
$PATCH2  
EOF
)
echo "\$patch1" | patch \$paths_js
echo "\$patch2" | patch \$start_js
EOF1