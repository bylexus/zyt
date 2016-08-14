import React from 'react';
import screenfull from 'screenfull';
import queryString from 'query-string';
import tr from './i18n';

export const settings = Object.assign(
{
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
    keepScreenActive: false,
    lang: 'zueri',
    fontFamily: 'Montserrat',
    upperCase: true,
    disableSettings: false
},
    // override defaults with local storage items:
    JSON.parse(localStorage.getItem('as-clock')) || {},
    // override defaults with Query Param items:
    queryString.parse(location.search)
);

function createSettingsUrl(settings) {
    let query = Object.keys(settings).map((key) => {
        let value = settings[key];
        return `${key}=${value === false? '' : encodeURIComponent(value)}`;
    }).join('&');
    let base = window.cordova ? 'https://zyt.alexi.ch/' : location.href.replace(/\?.*/,'');
    return `${base}?${query}`;
}

let settingsListener = null;
function storeSettings(obj) {
    Object.assign(settings, obj);
    localStorage.setItem('as-clock',JSON.stringify(settings));
    if (settingsListener) {
        settingsListener.forceUpdate();
    }
}

export function setScreenActive(value) {
    if (window.plugins && window.plugins.insomnia) {
        if (value === true) {
            window.plugins.insomnia.keepAwake();
        } else {
            window.plugins.insomnia.allowSleepAgain();
        }
    }
}

export function setCurrentScreenActivationMode() {
    setScreenActive(settings.keepScreenActive);
}


export class SettingsDlg extends React.Component {
    constructor(props) {
        super(props);
        this.state = settings;
        this.changeSetting = this.changeSetting.bind(this);
        this.changeScreenOnSetting = this.changeScreenOnSetting.bind(this);
        this.changeCheckboxSetting = this.changeCheckboxSetting.bind(this);
    }

    changeSetting(e) {
        this.setState({[e.target.id]: e.target.value}, () => {
            storeSettings(this.state);
        });
    }

    changeCheckboxSetting(e) {
        let newVal = !this.state[e.target.id];
        this.changeSetting({target: {id: e.target.id,value: newVal }});
        return newVal;

    }

    changeScreenOnSetting(e) {
        let newVal = this.changeCheckboxSetting(e);
        setScreenActive(newVal);
    }

    toggleFullScreen() {
        if (screenfull.enabled) {
            screenfull.toggle();
        }
    }

    componentDidMount() {
        this.registerJsColorInputs();
    }

    registerJsColorInputs() {
        let btns = document.getElementsByClassName('jscolor');
        let dataFor = '';
        let pos = '';
        let cp = null;
        let me = this;
        let jsColorOpts = {hash: true, width:150, height: 150, padding:0, shadow:false, borderWidth:0 };
        for (let i = 0; i < btns.length; i++) {
            dataFor = btns[i].getAttribute('data-for');
            pos = btns[i].getAttribute('data-position') || '';

            let opts = Object.assign({},jsColorOpts, {value: this.state[dataFor], valueElement: dataFor, position: pos});
            cp = new window.jscolor(btns[i],opts);
            cp.onFineChange = function() {
                me.changeSetting({target: {id: this.valueElement.id,value: this.valueElement.value}});
            };
        }
    }

    render() {
        let colBtnStyle = {width: 100};
        return (
            <div className="settings-dialog container">
                <div><label><span>{tr('LANG')}:</span>
                    <select value={this.state.lang} onChange={this.changeSetting} id="lang">
                        <option value="zueri">Züri-Düütsch</option>
                        <option value="bern">Bärn-Düütsch</option>
                        <option value="deutsch_std">Standard-Deutsch</option>
                        <option value="english_std">English Standard</option>
                    </select>
                </label>
                </div>

                <div>
                    <label><span>{tr('FONT')}:</span>
                    <select value={this.state.fontFamily} onChange={this.changeSetting} id="fontFamily">
                        <option value="Bree Serif">Bree Serif</option>
                        <option value="Bungee Inline">Bungee Inline</option>
                        <option value="Crushed">Crushed</option>
                        <option value="Libre Baskerville">Libre Baskerville</option>
                        <option value="Macondo Swash Caps">Macondo Swash Caps</option>
                        <option value="Merienda One">Merienda One</option>
                        <option value="Monoton">Monoton</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Roboto Mono">Roboto Mono</option>
                        <option value="Spicy Rice">Spicy Rice</option>
                        <option value="Stardos Stencil">Stardos Stencil</option>
                        <option value="Syncopate">Syncopate</option>
                        <option value="Ubuntu">Ubuntu</option>
                        <option value="Ultra">Ultra</option>
                    </select>
                </label></div>

                <div>
                    <label><span>{tr('UPPERCASE')}</span> <input type="checkbox" id="upperCase" checked={this.state.upperCase} onChange={this.changeCheckboxSetting} /></label>
                </div>

                <div style={{textAlign: 'center'}}>
                    <button style={colBtnStyle} data-for="bgColor" className="jscolor">{tr('BACKGROUND')}<br/>{this.state.bgColor}</button>&nbsp;
                    <button style={colBtnStyle} data-for="fgActiveColor" className="jscolor">{tr('FG_ACTIVE')}<br/>{this.state.fgActiveColor}</button>&nbsp;
                    <button style={colBtnStyle} data-for="fgDimmedColor" className="jscolor">{tr('FG_DIMMED')}<br />{this.state.fgDimmedColor}</button>&nbsp;
                    <input type="hidden" id="bgColor" value={this.state.bgColor} />
                    <input type="hidden" id="fgActiveColor" value={this.state.fgActiveColor}/>
                    <input type="hidden" id="fgDimmedColor" value={this.state.fgDimmedColor} />
                </div>

                <fieldset>
                    <legend>{tr('FG_ACTIVE_SHADOW')}</legend>
                    <div>
                        <label>dX: <input type="number"  id="activeShadowX" value={this.state.activeShadowX} onChange={this.changeSetting} style={{width: '40px'}}/></label>&nbsp;
                        <label>dY: <input type="number"  id="activeShadowY" value={this.state.activeShadowY} onChange={this.changeSetting} style={{width: '40px'}} /></label>&nbsp;
                        <label>{tr('BLUR')}: <input type="number"  id="activeShadowBlur" value={this.state.activeShadowBlur} onChange={this.changeSetting} style={{width: '40px'}} /></label>&nbsp;
                        <button style={colBtnStyle} data-for="activeShadowColor" data-position="left" className="jscolor">{this.state.activeShadowColor}</button>
                        <input type="hidden" id="activeShadowColor" value={this.state.activeShadowColor}/>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>{tr('FG_DIMMED_SHADOW')}</legend>
                    <div>
                        <label>dX: <input type="number"  id="dimmedShadowX" value={this.state.dimmedShadowX} onChange={this.changeSetting} style={{width: '40px'}}/></label>&nbsp;
                        <label>dY: <input type="number"  id="dimmedShadowY" value={this.state.dimmedShadowY} onChange={this.changeSetting} style={{width: '40px'}} /></label>&nbsp;
                        <label>blur: <input type="number"  id="dimmedShadowBlur" value={this.state.dimmedShadowBlur} onChange={this.changeSetting} style={{width: '40px'}} /></label>&nbsp;
                        <button style={colBtnStyle} data-for="dimmedShadowColor" data-position="left" className="jscolor">{this.state.dimmedShadowColor}</button>
                        <input type="hidden" id="dimmedShadowColor" value={this.state.dimmedShadowColor} />
                    </div>
                </fieldset>
                <div>
                    {!window.cordova && <button onClick={this.toggleFullScreen}>{tr('TOGGLE_FULLSCREEN')}</button>}

                    {window.plugins && window.plugins.insomnia && (
                        <label><span>{tr('KEEP_SCREEN_ON')}</span> <input type="checkbox" id="keepScreenActive" checked={this.state.keepScreenActive} onChange={this.changeScreenOnSetting} /></label>
                    )}

                    <button style={{float: 'right'}} onClick={(e) => {
                        e.preventDefault();
                        window.open('https://github.com/bylexus/talking-clock','alexich_github');
                        return false;
                    }}>{tr('INFO_ON_GITHUB')}</button>
                </div>
                <div>
                    <a href={createSettingsUrl(this.state)} target="_blank">{tr('CLOCK_URL')}</a>
                </div>
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
