#!/bin/bash

export MIX_ENV=prod
export PORT=4800
export NODEBIN=`pwd`/assets/node_modules/.bin
export PATH="$PATH:NODEBIN"
export SECRET_KEY_BASE="pKbut1/sTFGFnaUPjKs5j5ZNF2SqKzll4sdbwsQYTIqLEQYbWZ70WX3/EUcOOXEf"
echo "Building..."
echo `pwd`
mkdir -p ~/.config
mkdir -p priv/static

mix deps.get
mix compile
(cd assets && npm install)
(cd assets && ./node_modules/.bin/webpack --mode production)
mix phx.digest

echo "generating release..."
mix release

echo "build complete!"
