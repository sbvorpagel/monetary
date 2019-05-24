export default {
  home: { name: 'Home', path: '/' },
  accountsList: { name: 'AccountsList', path: '/accounts' },
  accountsForm: { name: 'AccountsForm', path: '/account' },
  accountsTransaction: { name: 'AccountsTransaction', path: '/accounts-transaction' },
  accountTransactionsList: { name: 'AccountTransactionsList', path: '/account-transactions-list/:id' },
  accountsEntry: { name: 'AccountsEntry', path: '/accounts-entry' },
  accountsOut: { name: 'AccountsOut', path: '/accounts-out' },
};

export const accountsEdit = {
  name: 'AccountsEdit',
  path: '/account/:id',
  pathWithoutParams: '/edit',
}