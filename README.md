Twitter DM Bot for CogniCity (prototype)

- reference: https://github.com/twitterdev/twitter-webhook-boilerplate-node/blob/master/example_scripts/welcome_messages/create-welcome-message.js

- stuff broken (now fixed):
  - id_str doesn't exist
  - crypto module rolled in

## Twitter DM Bot
Allows twitter users to submit flood reports via Twitter direct message (dm) chat bot.

## Setup notes
Process is convoluted.

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
