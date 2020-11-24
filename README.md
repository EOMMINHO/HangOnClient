# Introduction

This is a KAIST CS473 project aims to solve the following problem statement.

Drinking online via the current video chat system fails to give the liveness of offline parties and has difficulties in providing dynamic interactions between the group members.

# USAGE

## Development

1. command "npm i" will install all dependencies required to run the program.
2. command "npm start" will start the server with PORT 3000.

## Deploy

1. command "npm run build" will create a production build.
2. Host the built folder with any static server. (e.g. Netlify)

## Details

1. Routing & importing basic dependencies are executed in ./src/index.js.
2. The essential definitions for peer-to-peer connection are in ./src/utils/utils.js.
3. All descriptions for React components are in ./src/components.