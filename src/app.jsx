import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';

import Clock from './Clock.jsx';
import Settings, {SettingsDlg} from './Settings.jsx';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSettingsDlg: false
        };
    }

    render() {
        return (
            <div className="app-container" style={{backgroundColor: this.context.settings.bgColor}} >
                <Clock style={{height: '100%'}} onClick={() => this.setState({showSettingsDlg: !this.state.showSettingsDlg})}/>
                {this.state.showSettingsDlg && <SettingsDlg /> }
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

