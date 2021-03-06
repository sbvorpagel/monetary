const path = '/monetary';
// const path = "";

export default {
  accountsTransaction: {
    name: "Fazer uma transação de moedas",
    path: `${path}/accounts-transaction`
  },
  accountsTransfer: {
    name: "Fazer uma transferência entre contas",
    path: `${path}/accounts-transfer`
  },
  accountsList: { name: "Listagem de carteiras", path: `${path}/accounts` },
  accountsEntry: {
    name: "Registrar uma entrada",
    path: `${path}/accounts-entry`
  },
  accountsOut: { name: "Registrar uma saída", path: `${path}/accounts-out` },
  accountsForm: { name: "Cadastro de carteira", path: `${path}/account` }
};

export const accountsEdit = {
  name: "Edição de carteira",
  path: `${path}/account/:id`
};

export const report = {
  name: "Relatório",
  path: `${path}/report/:id/:code`,
  simplePath: `${path}/report`
}

export const home = {
  name: "Home",
  path: `${path}/`
};

export const accountTransferList = {
  name: "Listagem de transferências",
  path: `${path}/account-transfer-list/:id'`
};

export const accountTransactionsList = {
  name: "Listagem de transações",
  path: `${path}/account-transaction-list/:id`,
  simplePath: `${path}/account-transaction-list/`
};
