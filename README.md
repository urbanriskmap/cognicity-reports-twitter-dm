[![Build Status](https://travis-ci.org/urbanriskmap/cognicity-reports-twitter-dm.svg?branch=master)](https://travis-ci.org/urbanriskmap/cognicity-reports-twitter-dm) [![Coverage Status](https://coveralls.io/repos/github/urbanriskmap/cognicity-reports-twitter-dm/badge.svg?branch=master)](https://coveralls.io/github/urbanriskmap/cognicity-reports-twitter-dm?branch=master) [![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0) 

## :no_entry_sign: Deprecated

## cognicity-reports-twitter-dm

Allows Twitter users to submit flood reports via a Twitter Direct Message (DM) chat bot.

This module deploys AWS lambda functions that, after a user initiates a conversation via Twitter direct messages, uses the cognicity-bot-core module to fetch a report card from a CogniCity server and sends it to the user. The module also sends thank you messages once a user has submitted a flood report.


### Install
`npm install`

### Deployment
Adjust .travis.yml to deploy via Travis as need.


## Getting Started

* Register Twitter account for the [Account Activity API](https://developer.twitter.com/en/docs/accounts-and-users/subscribe-account-activity/overview)
* Create an application, dev environment and subscription for the [Twitter account](https://developer.twitter.com/en/account/environments)
* Copy tokens and secrets from https://apps.twitter.com (see configuration below)
* Deploy functions to AWS Lambda
* Connect functions to an AWS API gateway instance
* Add the API gateway endpoint URL to `src/config.js` (or set process.env)
* Create a subscription using the `commands/add-subscription.js` script
* Register a webhook using the `commands/add-webhook.js` script
* Test the chatbot

### Configuration

Configuration variables are as follows (these should be set in the Lambda environment):
* `API_GW_WEBHOOK` - the API gateway address for the webhook endpoint. Currently this is unused.
* `BLACKLIST` - list of comma seperated twitter user ID numbers to exclude from chatbot replies (e.g. '123,456,789')
* `CARDS_API` - the endpoint to get new report cards
* `CARDS_API_KEY` - the api key for the cards endpoint
* `CARDS_DECK` - one or more of 'flood,prep', describes what cards decks can be deployed
* `CARDS_URL` - the URL for the card resources to be sent to the user
* `DEFAULT_INSTANCE_COUNTRY_CODE` - default country code for deployment (e.g. 'us')
* `DEFAULT_INSTANCE_REGION_CODE` - in case a report is submitted outside the city, the code that the bot should fall back on for geographic reference
* `DEFAULT_LANGUAGE` - default language for user interactions
* `MAP_URL` - the risk map URL
* `TWITTER_CONSUMER_KEY` - Twitter consumer key
* `TWITTER_CONSUMER_SECRET` - Twitter consumer secret
* `TWITTER_TOKEN` - Twitter token
* `TWITTER_TOKEN_SECRET` - Twitter secret token
* `TWITTER_BOT_USER_ID` - the user ID for the bot (stop self replies) !important
* `TWITTER_ENDPOINT` - Twitter's API


### Building
Built in ES6, compiled with Babel, deployed to AWS Lambda using Travis.
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
- Use JSDoc comments throughout
