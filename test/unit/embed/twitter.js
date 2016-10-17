var assert = require('assert');
var embedTwitter = require('../../../v2/app/components/oembed/oembed-twitter');
var superagent = require('superagent');
var sinon = require('sinon');
var dedent = require('dedent');

describe('twitter embeds', function() {
  it('returns given input if there are no tweets', function(done) {
    const USER_INPUT = 'hello world, this is a basic post';

    embedTwitter(USER_INPUT).then(function(output) {
      assert(output === USER_INPUT);
      done();
    });
  });

  describe('talks to twitter when it finds a tweet', function() {
    it('works with well-formed basic twitter URLS', sinon.test(function(done) {
      const USER_INPUT = 'https://twitter.com/username/status/12345';
      var requestStub = this.stub(superagent, 'get');

      requestStub.returns(Promise.resolve({
        body: {
          html: `<blockquote class="twitter-tweet">{tweet content}<a href="{tweet url}">{tweet link text}</a></blockquote>`

        }
      }));

      embedTwitter(USER_INPUT).then(function(output) {
        assert(output === `<blockquote class="twitter-tweet">{tweet content}<a href="{tweet url}">{tweet link text}</a></blockquote>`);

        done();
      });
    }));

    it('works with mobile twitter URLS', sinon.test(function() {
      const USER_INPUT = 'https://mobile.twitter.com/username/status/12345';

      var requestStub = this.stub(superagent, 'get');

      requestStub.returns(Promise.resolve({
        body: {
          html: `<blockquote class="twitter-tweet">{tweet content}<a href="{tweet url}">{tweet link text}</a></blockquote>`

        }
      }));

      embedTwitter(USER_INPUT).then(function(output) {
        assert(output === `<blockquote class="twitter-tweet">{tweet content}<a href="{tweet url}">{tweet link text}</a></blockquote>`);

        done();
      });
    }));

    it('doesn\'t bother making requests for URLs without statuses', sinon.test(function(done) {
      const USER_INPUT = 'https://mobile.twitter.com/username/status/';

      var requestStub = this.stub(superagent, 'get');

      requestStub.returns(Promise.resolve({
        body: {
          html: ''
        }
      }));

      embedTwitter(USER_INPUT).then(function(output) {
        assert(!requestStub.called);
        done();
      });
    }));

    it('replaces tweets in mixed content posts', sinon.test(function(done) {
      const USER_INPUT = dedent`
        hello \n\n **check this out**:
        > https://mobile.twitter.com/username/status/12345
        :thumbsup:
      `;

      var requestStub = this.stub(superagent, 'get');

      requestStub.returns(Promise.resolve({
        body: {
          html: `<blockquote class="twitter-tweet">{tweet content}<a href="{tweet url}">{tweet link}</a></blockquote>`

        }
      }));

      embedTwitter(USER_INPUT).then(function(output) {
        var expectedOutput = dedent`
          hello \n\n **check this out**:
          > <blockquote class="twitter-tweet">{tweet content}<a href="{tweet url}">{tweet link}</a></blockquote>
          :thumbsup:
        `;

        assert.equal(output, expectedOutput);
        done();
      });
    }));

    it('renders consecutive tweets in the same body of content');
  });
});
