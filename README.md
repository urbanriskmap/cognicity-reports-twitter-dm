[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0) [![Build Status](https://travis-ci.org/urbanriskmap/twitter-dm-bot-lamda.svg?branch=master)](https://travis-ci.org/urbanriskmap/twitter-dm-bot-lamda) [![Coverage Status](https://coveralls.io/repos/github/urbanriskmap/twitter-dm-bot-lamda/badge.svg?branch=dev)](https://coveralls.io/github/urbanriskmap/twitter-dm-bot-lamda?branch=dev)

## Twitter DM Bot
Allows twitter users to submit flood reports via Twitter direct message (dm) chat bot.
Part of the CogniCity platform, deployed for [Urban Risk Map](https://riskmap.us).

### Building
Built in ES6, compiled with Babel, deployed to AWS Lambda using Serverless.
Run
`npm run build`

### Tests
Run unit tests (mocha + unit) and ESLint
`npm test`

### Contributing
- Issues tracked on GitHub
- Master currently deployed version, use dev branch for new features
- Note
  * design pattern notes below
  * note release process notes below

### Release process
- update the CHANGELOG.md file with newly released version, date and high-level overview of changes. Commit the change.
- Create a tag in git from current head of master. The tag version should be the same as the version specified in the package.json file - this is the release version.
- Update the version in the package.json file and commit the change - this is a new version.
- Further development is now on the updated version number until the release process begins again.

### Design Patterns
- functions that make external calls should return a promise
- internal methods can be simple functions
- functionality should be testable without excessive mocking
- Use JSDoc comments throughout

## Setup Twitter Acitivty API notes
TODO.
- reference: https://github.com/twitterdev/twitter-webhook-boilerplate-node/blob/master/example_scripts/welcome_messages/create-welcome-message.js
### Incoming messages

1.) Create twitter app and enable DMs. This is the account registered for the activity API (e.g. @petabencana)
2.) Use xxx script to register a webhook for scripts. store the webhook id somewhere
3.) Use Twurl to register account that will send/receive DMs against twitter app (e.g. @riskmapus)
4.) Use xxx script to register endpoint against a specific account for the activity API to monitor (e.g. @riskmapus)
5.) Push default messages
6.) Take the app key for the above app and pase it into the VARIABLE...

### Outgoing messages
1.) Register a new separate app against the account which will reply (e.g. @riskmapus)
2.) Paste the account ID into the lambda to avoid self spam
3.) Paste keys into VARIABLES for replies
