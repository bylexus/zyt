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
        return timeInfo[this.props.lang];
    }

    getContainerStyles() {
        return {
            'fontFamily': '"Courier New",courier',
            'fontSize': '50px',
            'display':'flex',
            'backgroundColor': this.context.settings.bgColor,
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

        let actualStyle = {
            color: this.context.settings.fgActiveColor,
            textShadow: '0 0 9px '+hex2rgba(this.context.settings.fgActiveColor,90)
        };
        return (
            <div style={this.getContainerStyles()} onClick={this.props.onClick}>
            {words.map((line,lineIndex) => (
                <div key={lineIndex} style={this.getLineStyles()} className="no-select">
                    {line.map((item,itemIndex) => {
                        let style = {
                            'flexGrow': 1,
                            'textAlign': 'center',
                            'fontSize': (100 / (words.length)) + 'vmin',
                            'lineHeight': (100 / (words.length)) + 'vmin',
                            'fontWeight': 'bold',
                            'color': this.context.settings.fgDimmedColor
                        };
                        let needle = [lineIndex, itemIndex];
                        if (indexMatch(needle,always) || indexMatch(needle,minute) || indexMatch(needle,hour)) {
                            style = Object.assign(style,actualStyle);
                        }

                        return item.split('').map((char,charIndex) => (
                            <div className={char === '.' ? 'pulse word-animation':'word-animation'} style={style} key={charIndex}>{char}</div>
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
    lang: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired
};
ClockWords.contextTypes = {
    settings: React.PropTypes.object
};

export default ClockWords;
