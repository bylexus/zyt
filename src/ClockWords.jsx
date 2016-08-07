import React from 'react';
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
            'fontFamily': 'courier',
            'fontSize': '50px',
            'display':'flex',
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
            color: 'white',
            textShadow: '0 0 9px rgba(255,255,255,0.9)'
        };
        return (
            <div style={this.getContainerStyles()}>
            {words.map((line,lineIndex) => (
                <div key={lineIndex} style={this.getLineStyles()}>
                    {line.map((item,itemIndex) => {
                        let style = {
                            'flexGrow': 1,
                            'textAlign': 'center',
                            'fontSize':'10vmin'
                        };
                        let needle = [lineIndex, itemIndex];
                        if (indexMatch(needle,always) || indexMatch(needle,minute) || indexMatch(needle,hour)) {
                            style = Object.assign(style,actualStyle);
                        }

                        return item.split('').map((char,charIndex) => (
                            <div className={char === '.' ? 'pulse':''} style={style} key={charIndex}>{char}</div>
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
    lang: React.PropTypes.string.isRequired
};

export default ClockWords;
