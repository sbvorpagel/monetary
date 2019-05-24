import React, { Component } from 'react';
import EntryOrOut from './components/EntryOrOut';

export default class AccountOut extends Component {
  render() {
    return (
      <EntryOrOut {...this.props} />
    );
  }
}