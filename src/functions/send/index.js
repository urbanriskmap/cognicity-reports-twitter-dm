import twitter from '../../lib/twitter/';
import messages from '../../lib/twitter/messages';
// TODO - send message
module.exports.twitterReply = (event, context, callback) => {
  // This module listens in to SNS Twitter topic and reads the message published
  let message = JSON.parse(event.Records[0].Sns.Message);
  console.log('Message received from SNS topic: ' + message);
  // Prepare message
  let msg = messages.thanks('en', message.username, message.report_id);
  // Send message to user
  twitter.sendMessage(msg)
    .then((response) => console.log('Message sent.'))
    .catch((err) => console.log(`Error sending message, response from Twitter `
    + `was: ` + JSON.stringify(err)));
};
