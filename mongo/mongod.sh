#!/bin/bash
mongod.exe --dbpath mongoData/ # executa e mantem terminal aberto
# mongod.exe --dbpath mongoData/& # executa em background

# tasklist /fi "IMAGENAME eq mongod.exe" # lista processos de mongod
# taskkill /fi "IMAGENAME eq mongod.exe" # termina processos de mongod