export default {
  home: { name: 'Home', path: '/monetary' },
  accountsList: { name: 'AccountsList', path: '/monetary/accounts' },
  accountsForm: { name: 'AccountsForm', path: '/monetary/account' },
  accountsTransaction: { name: 'AccountsTransaction', path: '/monetary/accounts-transaction' },
  accountTransactionsList: { name: 'AccountTransactionsList', path: '/monetary/account-transactions-list/:id' },
  accountsEntry: { name: 'AccountsEntry', path: '/monetary/accounts-entry' },
  accountsOut: { name: 'AccountsOut', path: '/monetary/accounts-out' },
};

export const accountsEdit = {
  name: 'AccountsEdit',
  path: '/monetary/account/:id',
}