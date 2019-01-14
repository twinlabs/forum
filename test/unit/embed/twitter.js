var assert = require('assert');
var embedTwitter = require('../../../app/components/oembed/oembed-twitter');
var superagent = require('superagent');
var sinon = require('sinon');
var test = require('sinon-test')(sinon);
sinon.test = test;
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
    it(
      'works with well-formed basic twitter URLS',
      sinon.test(function(done) {
        const USER_INPUT = 'https://twitter.com/username/status/12345';
        var requestStub = this.stub(superagent, 'get');

        requestStub.returns(
          Promise.resolve({
            body: {
              html: `<blockquote class="twitter-tweet">{tweet content}<a href="{tweet url}">{tweet link text}</a></blockquote>`,
            },
          }),
        );

        embedTwitter(USER_INPUT).then(function(output) {
          assert(
            output ===
              `<blockquote class="twitter-tweet">{tweet content}<a href="{tweet url}">{tweet link text}</a></blockquote>`,
          );

          done();
        });
      }),
    );

    it(
      'works with mobile twitter URLS',
      sinon.test(function(done) {
        const USER_INPUT = 'https://mobile.twitter.com/username/status/12345';

        var requestStub = this.stub(superagent, 'get');

        requestStub.returns(
          Promise.resolve({
            body: {
              html: `<blockquote class="twitter-tweet">{tweet content}<a href="{tweet url}">{tweet link text}</a></blockquote>`,
            },
          }),
        );

        embedTwitter(USER_INPUT).then(function(output) {
          assert(
            output ===
              `<blockquote class="twitter-tweet">{tweet content}<a href="{tweet url}">{tweet link text}</a></blockquote>`,
          );

          done();
        });
      }),
    );

    it(
      "doesn't bother making requests for URLs without statuses",
      sinon.test(function(done) {
        const USER_INPUT = 'https://mobile.twitter.com/username/status/';

        var requestStub = this.stub(superagent, 'get');

        requestStub.returns(
          Promise.resolve({
            body: {
              html: '',
            },
          }),
        );

        embedTwitter(USER_INPUT).then(function(output) {
          assert(!requestStub.called);
          done();
        });
      }),
    );

    it(
      'replaces tweets in mixed content posts',
      sinon.test(function(done) {
        const USER_INPUT = dedent`
        hello \n\n **check this out**:
        > https://mobile.twitter.com/username/status/12345
        :thumbsup:
      `;

        var requestStub = this.stub(superagent, 'get');

        requestStub.returns(
          Promise.resolve({
            body: {
              html: `<blockquote class="twitter-tweet">{tweet content}<a href="{tweet url}">{tweet link}</a></blockquote>`,
            },
          }),
        );

        embedTwitter(USER_INPUT).then(function(output) {
          var expectedOutput = dedent`
          hello \n\n **check this out**:
          > <blockquote class="twitter-tweet">{tweet content}<a href="{tweet url}">{tweet link}</a></blockquote>
          :thumbsup:
        `;

          assert.equal(output, expectedOutput);
          done();
        });
      }),
    );

    it(
      'renders consecutive tweets in the same body of content',
      sinon.test(function(done) {
        const USER_INPUT = dedent`
        https://twitter.com/username/status/0
        https://twitter.com/username/status/1
        https://twitter.com/username/status/2
        https://twitter.com/username/status/3
      `;
        var requestStub = this.stub(superagent, 'get');

        requestStub.onCall(0).returns(
          Promise.resolve({
            body: {
              html: `<blockquote class="twitter-tweet">{tweet content}<a href="https://twitter.com/username/status/0">https://twitter.com/username/status/0</a></blockquote>`,
            },
          }),
        );

        requestStub.onCall(1).returns(
          Promise.resolve({
            body: {
              html: `<blockquote class="twitter-tweet">{tweet content}<a href="https://twitter.com/username/status/1">https://twitter.com/username/status/1</a></blockquote>`,
            },
          }),
        );

        requestStub.onCall(2).returns(
          Promise.resolve({
            body: {
              html: `<blockquote class="twitter-tweet">{tweet content}<a href="https://twitter.com/username/status/2">https://twitter.com/username/status/2</a></blockquote>`,
            },
          }),
        );

        requestStub.onCall(3).returns(
          Promise.resolve({
            body: {
              html: `<blockquote class="twitter-tweet">{tweet content}<a href="https://twitter.com/username/status/3">https://twitter.com/username/status/3</a></blockquote>`,
            },
          }),
        );

        embedTwitter(USER_INPUT).then(function(output) {
          var expectedOutput = dedent`
          <blockquote class="twitter-tweet">{tweet content}<a href="https://twitter.com/username/status/0">https://twitter.com/username/status/0</a></blockquote>
          <blockquote class="twitter-tweet">{tweet content}<a href="https://twitter.com/username/status/1">https://twitter.com/username/status/1</a></blockquote>
          <blockquote class="twitter-tweet">{tweet content}<a href="https://twitter.com/username/status/2">https://twitter.com/username/status/2</a></blockquote>
          <blockquote class="twitter-tweet">{tweet content}<a href="https://twitter.com/username/status/3">https://twitter.com/username/status/3</a></blockquote>
        `;

          assert.equal(output, expectedOutput);
          done();
        });
      }),
    );

    it('renders tweets interspersed with other types of content');
  });
});
