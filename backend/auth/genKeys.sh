#!/bin/bash
ssh-keygen -N "" -f ~/.ssh/ontoworks.key
ssh-keygen -N "" -f ~/.ssh/ontoworks.key -e -m pem > ~/.ssh/ontoworks.key.pub
cp ~/.ssh/ontoworks.key ./ontoworks.key
cp ~/.ssh/ontoworks.key.pub ./ontoworks.key.pub
