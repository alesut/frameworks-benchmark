/**
 * HelloController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  hello: function (req, res) {
    return res.json({ hello: 'world', time: Date.now() });
  },
  metrics: function (req, res) {
    return res.json({ memory: process.memoryUsage().rss });
  },
  timeout: async function (req, res) {
    return res.json(await new Promise((resolve) => {
      setTimeout(() => {
        resolve({ hello: 'world', time: Date.now() });
      }, 500)
    }));
  }
};

