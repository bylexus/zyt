import React from 'react';
import hex2rgba from 'hex-rgba';
import timeInfo from './times';

function indexMatch(needleArr, haystack) {
    for (let i = 0; i < haystack.length; i++) {
        if (needleArr[0] === haystack[i][0] && needleArr[1] === haystack[i][1]) {
            return true;
        }
    }
    return false;
}

class ClockWords extends React.Component {
    getTimeInfo() {
        return timeInfo[this.props.settings.lang];
    }

    getContainerStyles() {
        return {
            'fontFamily': this.props.settings.fontFamily || 'Montserrat',
            'display':'flex',
            'backgroundColor': this.props.settings.bgColor,
            'flexDirection': 'column',
            'flexWrap': 'nowrap',
            'justifyContent':'space-between',
            'height': '100%'
        };
    }

    getLineStyles() {
        return {
            'display':'flex',
            'flexDirection': 'row',
            'flexGrow':1,
            'justifyContent':'space-between'
        };
    }

    normalizeDate(date) {
        let { times } = this.getTimeInfo();
        let now = date,
            hour = now.getHours(),
            minute = Math.round(now.getMinutes() / 5) * 5;
        if (minute >= times.minuteForNextHour) {
            hour++;
        }
        hour = hour % 12;
        minute = minute % 60;

        return {
            minute: times.minutes[minute],
            hour: times.hours[hour],
            always: times.always
        };
    }

    render() {
        let {minute, hour, always} = this.normalizeDate(this.props.date);
        let { words } = this.getTimeInfo();
        let {
            activeShadowX,
            activeShadowY,
            activeShadowBlur,
            activeShadowColor,
            dimmedShadowX,
            dimmedShadowY,
            dimmedShadowBlur,
            dimmedShadowColor,
            fgActiveColor,
            fgDimmedColor
        } = this.props.settings;

        let actualStyle = {
            color: fgActiveColor,
            textShadow: `${activeShadowX}px ${activeShadowY}px ${activeShadowBlur}px ${hex2rgba(activeShadowColor,100)}`
        };
        let dimmedStyle = {
            'flexGrow': 1,
            'textAlign': 'center',
            'alignSelf': 'flex-end',
            'fontSize': (100 / (words.length) * 0.9) + 'vmin',
            'lineHeight': (100 / (words.length)) + 'vmin',
            'color': fgDimmedColor,
            textShadow: `${dimmedShadowX}px ${dimmedShadowY}px ${dimmedShadowBlur}px ${hex2rgba(dimmedShadowColor,90)}`
        };
        return (
            <div style={this.getContainerStyles()} onClick={this.props.onClick}>
            {words.map((line,lineIndex) => (
                <div key={lineIndex} style={this.getLineStyles()} className="no-select">
                    {line.map((item,itemIndex) => {
                        let needle = [lineIndex, itemIndex];
                        let style = Object.assign({},dimmedStyle);
                        if (indexMatch(needle,always) || indexMatch(needle,minute) || indexMatch(needle,hour)) {
                            style = Object.assign(style,actualStyle);
                        }

                        return item.split('').map((char,charIndex) => (
                            <div className={char === '.' ? 'pulse word-animation':'word-animation'} style={style} key={charIndex}>{this.props.settings.upperCase ? char.toUpperCase() : char}</div>
                        ));
                    })}
                </div>
            ))}
            </div>
        );
    }
}

ClockWords.propTypes = {
    date: React.PropTypes.instanceOf(Date).isRequired,
    settings: React.PropTypes.object.isRequired,
    onClick: React.PropTypes.func.isRequired
};

export default ClockWords;
