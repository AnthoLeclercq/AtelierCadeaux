#!/bin/bash

echo "############### WELCOME INSIDE YOU DOCKER CONTAINER ###############"

boot_adb() {
  echo "Launch ADB bridge"

  socat tcp-listen:5037,reuseaddr,fork tcp:host.docker.internal:5037 &
}

boot_adb

if [ -z $1 ]; then

  # Si on pas attaché à un terminal (lancement dans vscode)
  if [ ! -t 1 ]; then
    while sleep 1000; do :; done
  else
    exec bash
  fi

else
  exec "$@"
fi
