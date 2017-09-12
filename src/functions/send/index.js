import twitter from '../../lib/twitter/';

module.exports.twitterReply = (event, context, callback) => {
  // This module listens in to SNS Twitter topic and reads the message published
  let message = JSON.parse(event.Records[0].Sns.Message);
  console.log('Message received from SNS topic: ' + message);
  // Prepare message
  let msg = {};
  msg.event = {
        type: 'message_create',
        message_create: {
          target: {
            recipient_id: message.username,
          },
          message_data: {
            text: 'Thank you for your report. You can access it using this link https://riskmap.us/map/broward/' + message.report_id,
          },
        }
      }
  // Send message to user
  twitter.sendMessage(msg)
    .then(response => console.log('Message sent.'))
    .catch(err => console.log('Error sending message, response from Twitter was: ' + JSON.stringify(err)));
};
