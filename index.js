const { Plugin } = require('powercord/entities');

module.exports = class Croissant extends Plugin {
  startPlugin () {
    this.registerCommand(
      'croissant',
      [],
      'Your message, but 1/4 of words is \'croissant\'',
      '{c} <your message>',
      (args) => ({
        send: true,
        result: args.map((w, i) => (i % 4 === 3) ? 'croissant' : w).join(' ')
      })
    );
  }
};
