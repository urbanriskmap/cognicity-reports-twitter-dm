// List configured webhooks
// npx babel-node commands/list-webhooks.js
import config from '../src/config';
import request from 'request';
import OAuth from 'OAuth';
const OAuth2 = OAuth.OAuth2;   

const ENV = 'production'

const run = function(){
    const oauth2 = new OAuth2(config.TWITTER_CONSUMER_KEY,
        config.TWITTER_CONSUMER_SECRET, 
        'https://api.twitter.com/', 
        null,
        'oauth2/token', 
        null);
    oauth2.getOAuthAccessToken('', {'grant_type':'client_credentials'}, function (err, access_token, refresh_token, results){
        console.log('bearer: ',access_token)
        const options = {
            url: config.TWITTER_ENDPOINT + 'account_activity/all/'+ENV+'/webhooks/<INSERT_WEBHOOK_ID>.json',
            headers: {
                'Authorization': 'bearer ' + access_token
            }
        }
        
        request.delete(options, function(err, response, body){
            console.log('Errors', err);
            console.log('Webhooks', body);
        });
    });


}

run();