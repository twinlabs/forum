$(function() {
  embedTwitter($('.content a'));
});

function embedTwitter($selector) {
  var TWITTER = /https?:\/\/(www\.)?(mobile\.)?twitter.com\/.+?\/status(es)?/i;

  $selector.filter(function(index, element) {
    var match = false;

    if (this.getAttribute('href').match(TWITTER) !== null) {
      match = true;
    }

    if ($(this).parent('.twitter-tweet').length) {
      match = false;
    }

    return match;
  }).each(function(index, element) {
    var requestUrl = element.getAttribute('href');

    requestUrl = requestUrl.replace('mobile.', '');

    $.ajax({
      url: 'https://api.twitter.com/1/statuses/oembed.json?url=' + encodeURIComponent(requestUrl),
      dataType: 'jsonp',
      headers: {
        'Authorization': 'OAuth oauth_consumer_key="nujH4OgzdEtr9RcA55iOaYpzp", oauth_nonce="d953a64aad3116c9c6f66f78a2bc0aa6", oauth_signature="jZ5UPRi1Pz3xX1XfgMR6vUXfVLA%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1423944834", oauth_version="1.0"'
      },
      success: function(data) {
        $(element).replaceWith(data.html);
      }
    });
  });
}
