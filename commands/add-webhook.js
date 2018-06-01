// Add a webhook
// npx babel-node commands/add-webhook.js
import config from '../src/config';
import request from 'request';
import OAuth from 'OAuth';

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
        url: config.TWITTER_ENDPOINT + 'account_activity/all/' + ENV + '/webhooks.json?url=' + encodeURIComponent(config.API_GW_WEBHOOK),
        oauth: oauth,
        json: true,
        headers: {
            'content-type': 'application/json',
        },
        body: {}
    }
    
    request.post(opts, function(err, response, body){
        console.log('returned')
        console.log(err);
        console.log(body);
    });
}
run();
