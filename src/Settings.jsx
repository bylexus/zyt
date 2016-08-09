import React from 'react';
import screenfull from 'screenfull';

export const settings = Object.assign({
    bgColor: '#000000',
    fgDimmedColor: '#333333',
    fgActiveColor: '#ffffff',
    activeShadowX: '0',
    activeShadowY: '0',
    activeShadowBlur: '9',
    activeShadowColor: '#cccccc',
    dimmedShadowX: '0',
    dimmedShadowY: '0',
    dimmedShadowBlur: '0',
    dimmedShadowColor: '#000000',
    lang: 'zueri'
}, JSON.parse(localStorage.getItem('as-clock')) || {});

let settingsListener = null;
function storeSettings(obj) {
    Object.assign(settings, obj);
    localStorage.setItem('as-clock',JSON.stringify(settings));
    if (settingsListener) {
        settingsListener.forceUpdate();
    }
}

export class SettingsDlg extends React.Component {
    constructor(props) {
        super(props);
        this.state = settings;
        this.changeSetting = this.changeSetting.bind(this);
    }

    changeSetting(e) {
        this.setState({[e.target.name]: e.target.value}, () => {
            storeSettings(this.state);
        });
    }

    toggleFullScreen() {
        if (screenfull.enabled) {
            screenfull.toggle();
        }
    }

    render() {
        return (
            <div className="settings-dialog container">
                <div><label><span>Lang:</span>
                    <select value={this.state.lang} onChange={this.changeSetting} name="lang">
                        <option value="zueri">Züri-Düütsch</option>
                        <option value="bern">Bärn-Düütsch</option>
                        <option value="deutsch_std">Standard-Deutsch</option>


                    </select>
                </label></div>
                <div><label><span>BG:</span> <input type="color" name="bgColor" value={this.state.bgColor} onChange={this.changeSetting} /></label></div>
                <div><label><span>FG dimmed:</span> <input type="color" name="fgDimmedColor" value={this.state.fgDimmedColor} onChange={this.changeSetting}/></label></div>
                <div><label><span>FG active:</span> <input type="color" name="fgActiveColor" value={this.state.fgActiveColor} onChange={this.changeSetting}/></label></div>
                <fieldset>
                    <legend>FG active shadow</legend>
                    <div>
                        <label>dX: <input type="number" min="0" name="activeShadowX" value={this.state.activeShadowX} onChange={this.changeSetting} style={{width: '30px'}}/></label>&nbsp;
                        <label>dY: <input type="number" min="0" name="activeShadowY" value={this.state.activeShadowY} onChange={this.changeSetting} style={{width: '30px'}} /></label>&nbsp;
                        <label>blur: <input type="number" min="0" name="activeShadowBlur" value={this.state.activeShadowBlur} onChange={this.changeSetting} style={{width: '30px'}} /></label>&nbsp;
                        <label><input type="color" name="activeShadowColor" value={this.state.activeShadowColor} onChange={this.changeSetting}/></label>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>FG dimmed shadow</legend>
                    <div>
                        <label>dX: <input type="number" min="0" name="dimmedShadowX" value={this.state.dimmedShadowX} onChange={this.changeSetting} style={{width: '30px'}}/></label>&nbsp;
                        <label>dY: <input type="number" min="0" name="dimmedShadowY" value={this.state.dimmedShadowY} onChange={this.changeSetting} style={{width: '30px'}} /></label>&nbsp;
                        <label>blur: <input type="number" min="0" name="dimmedShadowBlur" value={this.state.dimmedShadowBlur} onChange={this.changeSetting} style={{width: '30px'}} /></label>&nbsp;
                        <label><input type="color" name="dimmedShadowColor" value={this.state.dimmedShadowColor} onChange={this.changeSetting}/></label>
                    </div>
                </fieldset>
                <div><button onClick={this.toggleFullScreen}>Toggle Full Screen</button></div>
            </div>
        );
    }
}

class Settings extends React.Component {
    constructor(props) {
        super(props);
        settingsListener = this;
    }

    getChildContext() {
        return {
            settings: settings
        };
    }

    render () {
        return this.props.children;
    }
}
Settings.propTypes = {
    children: React.PropTypes.object.isRequired
};
Settings.childContextTypes = {
    settings: React.PropTypes.object
};

export default Settings;
