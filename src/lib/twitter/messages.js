// Prepare message
const texts = '{"in":'
+ '{"event":{"type":"message_create","message_create":'
+ '{"target":{},'
+ '"message_data":{"text":"RiskMap bot helps you report flooding in realtime. '
+ 'Send /flood to report. '
+ 'In life-threatening situations always call 911."}}}},'
+ '"en":'
+ '{"event":{"type":"message_create","message_create":'
+ '{"target":{},'
+ '"message_data":{"text":"RiskMap bot helps you report flooding in realtime. '
+ 'Send /flood to report. '
+ 'In life-threatening situations always call 911."}}}}}';

export default (config) => ({
  default: function(lang, userId) {
    let messages = JSON.parse(texts);
    let response = messages[config.app.default_lang];
    if (lang in messages) {
      response = messages[lang];
    }
    response.event.message_create.target.recipient_id = userId;
    return response;
  },
  card: function(lang, userId, cardId) {
    // TODO multi lang support
    let messages = JSON.parse(texts);
    let response = messages[config.app.default_lang];
    if (lang in messages) {
      response = messages[lang];
    }
    response.event.message_create.target.recipient_id = userId;
    response.event.message_create.message_data.text =
      `Please report using this one-time link ` + config.server.card_endpoint
      + cardId;
    return response;
  },
  thanks: function(lang, userId, reportId) {
    // TODO multi lang support
    let messages = JSON.parse(texts);
    let response = messages[config.app.default_lang];
    if (lang in messages) {
      response = messages[lang];
    }
    response.event.message_create.target.recipient_id = userId;
    response.event.message_create.message_data.text = `Thank you for your ` +
    `report. You can access it using this link https://riskmap.us/map/broward/`
    + reportId;
    return response;
  },
});
