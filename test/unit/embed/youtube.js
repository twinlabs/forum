var assert = require('assert');
var embedYouTube = require('../../../app/components/oembed/oembed-youtube');
var superagent = require('superagent');
var dedent = require('dedent');

describe('youtube embeds', function() {
  it('correctly produces frames for basic youtube URLs', function(done) {
    embedYouTube('https://www.youtube.com/watch?v=RD_44xEEDjU').then(function(output) {
      var expectedOutput = `<iframe style="min-height: 350px" src="//www.youtube.com/embed/RD_44xEEDjU" frameborder="0" allowfullscreen></iframe>`;

      assert.equal(output, expectedOutput);

      done();
    });
  });
});
