const { React } = require('powercord/webpack');
const { Tooltip } = require('powercord/components');

module.exports = ({ children, color }) => <Tooltip text='Powercast Staff' position='top'>
  <div className='powercord-badge powercast'>
    <div style={{ '--badge-color': `#${color}` }}>
      {children}
    </div>
  </div>
</Tooltip>;
