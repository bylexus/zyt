import "babel-polyfill";
import "./vendor/jscolor-2.0.4/jscolor";
import React from 'react';
import ReactDOM from 'react-dom';

import { init as i18nInit } from './i18n';
import Clock from './Clock.jsx';
import Settings, {SettingsDlg,setScreenActive,setCurrentScreenActivationMode} from './Settings.jsx';


// register native device events
function onDeviceReady() {
    document.addEventListener('pause', () => {
        setScreenActive(false);
    },false);

    document.addEventListener('resume',() => {
        setCurrentScreenActivationMode();
    },false);

    // Hide status bar:
    window.StatusBar.hide();

    // Set initial screen activation mode:
    setCurrentScreenActivationMode();
    i18nInit().then(startApp);
}

// Depending on the environment (app or web page), we start the app directly, or we have to wait for the
// deviceready event:
if (window.cordova) {
    document.addEventListener('deviceready', onDeviceReady, false);

} else {
    i18nInit().then(startApp);
}



function startApp() {
    class App extends React.Component {
        constructor(props) {
            super(props);
            this.toggleSettingsDlg = this.toggleSettingsDlg.bind(this);
            this.state = {
                showSettingsDlg: false
            };
        }

        toggleSettingsDlg() {
            if (this.context.settings.clickUrl) {
                window.open(this.context.settings.clickUrl,'zyt_clock');
            } else if (!this.context.settings.disableSettings) {
                this.setState({showSettingsDlg: !this.state.showSettingsDlg});
            }
        }

        render() {
            return (
                <div>
                    <Clock style={{height: '100%'}} onClick={() => this.toggleSettingsDlg()}/>
                    {this.state.showSettingsDlg && <SettingsDlg onClose={this.toggleSettingsDlg}/> }
                </div>
            );
        }
    }

    App.contextTypes = {
        settings: React.PropTypes.object.isRequired
    };


    ReactDOM.render(
        <Settings>
            <App />
        </Settings>,
      document.getElementById('app')
    );
}


