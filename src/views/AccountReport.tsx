import React, { Component } from "react";
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from "@material-ui/core/index";
import FirebaseService from "../services/FirebaseService";
import withWidth from "@material-ui/core/withWidth";
import moment from "moment";

interface Transaction {
  date: Date;
  description: string;
  value: number;
  quotation: number;
  currency: string;
  to: string;
  from: string;
  sended: boolean;
  type: string;
}

interface Balance {
  code: string;
  value: number;
  transactions: Array<Transaction>;
}

interface Account {
  id: string;
  description: string;
  balances: Array<Balance> | null;
}
interface State {
  account: Account | null;
  loading: boolean;
}

class AccountReport extends Component<any, State> {
  public readonly state = { account: null, loading: true };

  componentWillMount = () => {
    const { id } = this.props.match.params;

    FirebaseService.getUniqueDataBy("accounts", id, (data: Account) => {
      this.setState({ account: { ...data, id }, loading: false });
    });
  };

  //@ts-ignore
  sortFunction = (a: Transaction, b: Transaction) => + (b.date > a.date) - (b.date < a.date);

  render() {
    const { code } = this.props.match.params;
    const { account, loading } = this.state;

    if (loading || !account) return null;

    //@ts-ignore
    const { balances = [] } = account || {};
    const transactions = (balances || []).reduce(
      //@ts-ignore
      (acc, value: Balance) => acc.concat(value.transactions || []),
      new Array<Transaction>()
    );

    const filtredTransactions = transactions
        .filter((transaction: Transaction) =>
            transaction.currency === code &&
            transaction.type === 'TRANSACTION' &&
            //@ts-ignore
            transaction.to === account.id &&
            transaction.sended
        );

    //@ts-ignore
    if (!filtredTransactions || !filtredTransactions.length) {
        return (
            <div style={{padding: 16}}>
                <p>Sem transações de venda</p>
            </div>
        );
    }

    const totalValue = filtredTransactions.reduce((sum: number, transaction: Transaction) => {
        return sum + transaction.value;
    }, 0);

    const quotationAvarage = filtredTransactions.reduce((sum: number, transaction: Transaction) => {
        return sum + (transaction.value * transaction.quotation);
    }, 0);

    const l10n = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: filtredTransactions[0].currency
    });

    const currency = filtredTransactions[0].currency;

    return (
      <div style={{ paddingBottom: 16 }}>
        {!!transactions && !!transactions.length && (
          <React.Fragment>
            <Typography
              style={{ padding: 8 }}
              variant="headline"
              component="h2"
            >
              Movimentações vinculadas com essa conta
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Moeda</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Cotação</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Descrição</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtredTransactions
                    .sort(this.sortFunction)
                    .map((transaction: Transaction, index: number) => {
                 
                  let type;
                  if (transaction.type === 'INITIAL') {
                    type = 'Depósto inicial';
                  } else if (transaction.type === 'MOVEMENT') {
                    if (transaction.sended) type = 'Saída';
                    if (!transaction.sended) type = 'Entrada';
                  } else if (transaction.type === 'TRANSFER') {
                    if (transaction.sended) type = 'Transferência - Saída';
                    if (!transaction.sended) type = 'Transferência - Entrada';
                  } else if (transaction.type === 'TRANSACTION') {
                    if (transaction.sended) type = 'Compra - Saída';
                    if (!transaction.sended) type = 'Compra - Entrada';
                  }
                  return (
                    <TableRow key={transaction.currency + transaction.date + index} >
                      <TableCell>{moment(transaction.date).format("DD/MM/YYYY HH:MM")}</TableCell>
                      <TableCell>{transaction.currency}</TableCell>
                      <TableCell>{l10n.format(transaction.value)}</TableCell>
                      <TableCell>{transaction.quotation}</TableCell>
                      <TableCell>{type}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow key="last" style={{backgroundColor: '#EEE'}}>
                    <TableCell style={{fontWeight: 'bold'}}>Média</TableCell>
                    <TableCell style={{fontWeight: 'bold'}}>{currency}</TableCell>
                    <TableCell style={{fontWeight: 'bold'}}>{l10n.format(totalValue)}</TableCell>
                    <TableCell style={{fontWeight: 'bold'}}>{quotationAvarage / totalValue}</TableCell>
                    <TableCell style={{fontWeight: 'bold'}}>-</TableCell>
                    <TableCell style={{fontWeight: 'bold'}}>-</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default withWidth()(AccountReport);
