import React from 'react';
import ReactDOM from 'react-dom';
//https://github.com/JedWatson/classnames
var classNames = require('classnames');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var ToggleSwitchCustom = React.createClass({

    propTypes: {
        defaultChecked: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        name: React.PropTypes.string,
        value: React.PropTypes.string,
        id: React.PropTypes.string,
        offValue: React.PropTypes.string,
        onValue: React.PropTypes.string,
        label: React.PropTypes.string
    },

    mixins: [LinkedStateMixin],
    childrenProps: "",
    toggleState: [],
    self: this,
    offState: "",
    onState: "",

    getDefaultProps: function getDefaultProps() {
        return {
            checked: false
        };
    },

    getInitialState: function getInitialState() {
        self.childrenProps = this.props.children.split("-")
        self.offState = self.childrenProps[0];
        self.onState = self.childrenProps[1];
        return {
            checked: !!this.props.checked,
            hasFocus: false,
            label: self.offState
        };
    },

    handleClick: function handleClick(event) {
        var checkbox = this.refs.myonoffswitch;
        var checkboxWasDirectlyClicked = event.target === checkbox;
        this.setState({ checked: checkbox.checked });
        if (checkbox.checked === true) {
            this.setState({ label: self.onState });
        } else {
            this.setState({ label: self.offState });
        }
        if (checkboxWasDirectlyClicked) {
            return;
        }
        event.preventDefault();
        checkbox.click();
        checkbox.focus();
    },

    handleFocus: function handleFocus() {
        this.setState({ hasFocus: true });
    },

    handleBlur: function handleBlur() {
        this.setState({ hasFocus: false });
    },

    render() {
        return (
            <div className="onoffswitch">
                <input id="myonoffswitch" ref="myonoffswitch" type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" onChange={this.handleClick}></input>
                <label className="onoffswitch-label" htmlFor="myonoffswitch">
                    <div className="onoffswitch-inner" data-attr={this.linkState('label').value}></div>
                    <span className="onoffswitch-switch"></span>
                </label>
            </div>
        );
    }
});
export default ToggleSwitchCustom;