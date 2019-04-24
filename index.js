const { resolve } = require('path');
const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModuleByDisplayName } = require('powercord/webpack');

module.exports = class Powercast extends Plugin {
  async startPlugin () {
    this.loadCSS(resolve(__dirname, 'style.scss'));

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

    const ChannelItem = await getModuleByDisplayName('ChannelItem');
    inject('powercast-icon', ChannelItem.prototype, 'render', function (args, res) {
      if (this.props.channel.id === '570621003189714950') {
        res.props['data-powercast'] = 'memes';
      }
      return res;
    });
  }

  pluginWillUnload () {
    uninject('powercast-icon');
  }
};
