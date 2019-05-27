const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { React, getModule, getModuleByDisplayName } = require('powercord/webpack');
const Badge = require('./Badge');

const POWERCASTERS = [ '94762492923748352', '190551803669118976', '132584525296435200' ];

module.exports = class Powercast extends Plugin {
  async startPlugin () {
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

    const channelIconClass = (await getModule([ 'icon', 'modeConnected' ])).icon;
    const _this = this;

    const ChannelItem = await getModuleByDisplayName('ChannelItem');
    inject('powercast-channel-icon', ChannelItem.prototype, 'render', function (args, res) {
      if (this.props.channel.id === '570621003189714950') {
        res.props.children[1].props.children[0] = _this._renderIcon(channelIconClass);
      }
      return res;
    });

    const HeaderBar = await getModuleByDisplayName('HeaderBarContainer');
    inject('powercast-title-icon', HeaderBar.prototype, 'render', (args, res) => {
      if (res.props.children[1].key === '570621003189714950') {
        res.props.children[0].props.children[0] = _this._renderIcon(channelIconClass);
      }
      return res;
    });

    try {
      const Badges = require('../pc-badges/Badges');
      inject('powercast-badges', Badges.prototype, 'render', function (_, res) {
        if (POWERCASTERS.includes(this.props.id)) {
          const badge = res.find(b => b && !b.props.position);
          if (!badge) {
            return res;
          }
          return [
            ...res.slice(0, 2),
            React.createElement(Badge, {
              key: 'fuck me hard',
              ...badge.props
            }, _this._renderIcon()),
            ...res.slice(2)
          ];
        }
        return res;
      });
    } catch (e) {
      // big sad
    }
  }

  _renderIcon (channelIconClass) {
    return React.createElement('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 500 500',
      className: channelIconClass
    }, [
      React.createElement('path', {
        key: 1,
        className: 'cast',
        fill: 'currentColor',
        d: 'M434.1,65.9H65.9C43.4,65.9,25,84.3,25,106.8v40.9c0,11.3,9.2,20.5,20.5,20.5s20.5-9.2,20.5-20.5v-20.5 c0-11.3,9.2-20.5,20.5-20.5h327.3c11.3,0,20.5,9.2,20.5,20.5v245.5c0,11.3-9.2,20.5-20.5,20.5H311.4c-11.3,0-20.5,9.2-20.5,20.5 c0,11.3,9.2,20.5,20.5,20.5h122.7c22.5,0,40.9-18.4,40.9-40.9V106.8C475,84.3,456.6,65.9,434.1,65.9z M48.3,292.8 c-12.3-2-23.3,8-23.3,20.5c0,10,7.4,18.4,17.4,20c42.5,7.4,76.1,40.9,83.5,83.5c1.6,10,10,17.4,20,17.4c12.5,0,22.3-11,20.5-23.3 C156.5,350.2,108.7,302.6,48.3,292.8z M25,372.7v61.4h61.4C86.4,400.1,59,372.7,25,372.7z M47.5,210.1c-12.1-1-22.5,8.4-22.5,20.5 c0,10.4,7.8,19.2,18,20.2c87.3,8.4,156.9,77.9,165.3,165.3c1,10.2,9.8,17.8,20.2,17.8c12.3,0,21.7-10.6,20.5-22.7 C238.1,305,153.7,220.7,47.5,210.1z'
      }),
      React.createElement('path', {
        key: 2,
        className: 'plug',
        fill: 'currentColor',
        d: 'M412.9,175.6c-6-6-15.8-6-21.8,0l-33,33L333.5,184l33-33c6-6,6-15.8,0-21.8c-6-6-15.8-6-21.8,0l-33,33l-7.4-7.4 c-1.4-1.4-3.5-1.4-4.9,0L287.1,167c-1.4,1.4-1.4,3.5,0,4.9l2.4,2.4L248.9,215c-8.6,8.6-8.6,22.6,0,31.2l13.7,13.7l-12.3,12.3 c-1.4,1.4-1.4,3.5,0,4.9l5.1,5.1c-8.4,10.8-7.7,26.5,2.3,36.5l31.8,31.8c1.4,1.4,3.6,1.5,5,0.1c1.4-1.4,1.4-3.5,0-4.9l-31.8-31.8 c-7.3-7.2-8-18.6-2.2-26.7l4.6,4.6c1.4,1.3,3.5,1.3,4.9,0l12.3-12.3l13.7,13.7c8.6,8.6,22.6,8.6,31.2,0l40.6-40.6l2.4,2.4 c1.4,1.4,3.5,1.4,4.9,0l12.2-12.2c1.4-1.4,1.4-3.5,0-4.9l-7.4-7.4l33-33C419,191.5,419,181.7,412.9,175.6z'
      })
    ]);
  }

  pluginWillUnload () {
    uninject('powercast-channel-icon');
    uninject('powercast-title-icon');
    uninject('powercast-badges');
    uninject('powercast-badge');
  }
};
