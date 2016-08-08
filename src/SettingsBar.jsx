import React from 'react';

class SettingsBar extends React.Component {
    render() {
        return (
            <footer style={{height: 40, lineHeight:'40px', padding: 3,backgroundColor: this.context.settings.bgColor}}>
                <button
                    className="settings"
                    style={{backgroundColor: this.context.settings.bgColor, color: this.context.settings.fgActiveColor}}
                    onClick={this.props.handleSettingsBtn}><i className="fa fa-cog fa-2x"></i>
                </button>
            </footer>

        );
    }

}

SettingsBar.propTypes = {
    handleSettingsBtn: React.PropTypes.func.isRequired
};

SettingsBar.contextTypes = {
    settings: React.PropTypes.object.isRequired
};

export default SettingsBar;
