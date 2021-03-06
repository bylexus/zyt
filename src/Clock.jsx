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
        // return new Date('2016-01-01 08:35');
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
        <ClockWords {...this.props} date={this.state.date} settings={this.context.settings} />
        );
    }
}

Clock.contextTypes = {
    settings: React.PropTypes.object.isRequired
};

export default Clock;
