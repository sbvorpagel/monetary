import React, { Component } from 'react';
import EntryOrOut from './components/EntryOrOut';

export default class AccountEntry extends Component {
  render() {
    return (
      <EntryOrOut isEntry {...this.props} />
    );
  }
}