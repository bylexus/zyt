import React from 'react';
import ClockWords from './ClockWords.jsx';

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: this.now()
        };
    }

    now() {
        return new Date();
    }

    componentDidMount() {
        this.timer = window.setInterval(() => {
            this.setState({date: this.now()});
        },1000);
    }

    componentWillUnmount() {
        window.clearInterval(this.timer);
    }

    render() {
        return (
        <ClockWords date={this.state.date} lang={this.context.settings.lang}/>
        );
    }
}

Clock.contextTypes = {
    settings: React.PropTypes.object.isRequired
};

export default Clock;
