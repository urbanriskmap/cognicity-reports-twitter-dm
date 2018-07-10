// Add a webhook
// npx babel-node commands/add-welcome-message.js
import config from '../src/config';
import buttons from '../src/lib/buttons.json';
import request from 'request';

const ENV = 'production'

const run = function(){
    console.log('running');
    const oauth = {
        consumer_key: config.TWITTER_CONSUMER_KEY,
        consumer_secret: config.TWITTER_CONSUMER_SECRET,
        token: config.TWITTER_TOKEN,
        token_secret: config.TWITTER_TOKEN_SECRET,
    }

    console.log(oauth);

    const opts = {
        url: config.TWITTER_ENDPOINT + 'direct_messages/welcome_messages/new',
        oauth: oauth,
        json: true,
        headers: {
            'content-type': 'application/json',
        },
        body: {
                "welcome_message" : {
                  "name": "simple_welcome-message 03",
                  "message_data": {
                    "text": buttons[config.DEFAULT_LANGUAGE].text.welcome,
                    "quick_reply": {
                        "type": "options",
                        "options": [
                          {
                            "label": buttons[config.DEFAULT_LANGUAGE].text.start,
                            "metadata": "start",
                          },
                        ]
                      }
                  }
                }
              }
    }
   request.post(opts, function(err, response, body){
        console.log('returned')
        console.log(err);
        console.log(body);
    });
}
run();
