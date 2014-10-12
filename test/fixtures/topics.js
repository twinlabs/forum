var moment = require('moment');

module.exports = [
  {
    id: '1',
    date: 'Wed Dec 25 2013 7:13:52 GMT-0500 (EST)',
    user: {
      id: 1,
      name: 'Willis'
    },
    title: 'New Topic',
    body: "..."
  },
  {
    id: '2',
    date: moment('Wed Dec 25 2013 9:13:52 GMT-0500 (EST)').fromNow(),
    user: {
      id: 2,
      name: 'David'
    },
    body: "So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her."

  },
  {
    id: '3',
    date: moment('Wed Dec 25 2013 10:13:52 GMT-0500 (EST)').fromNow(),
    user: {
      id: 3,
      name: 'Alice'
    },
    body: "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, 'and what is the use of a book,' thought Alice 'without pictures or conversation?<br/><img src=\"http://m.ahfr.org/content/cover3.gif\"/>"
  }
];
