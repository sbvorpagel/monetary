import React, { Component } from 'react';
import { Typography, Card, CardContent, GridListTile, GridList, Table, TableHead, TableBody, TableCell, TableRow } from "@material-ui/core/index";
import FirebaseService from "../services/FirebaseService";
import currencies from '../utils/currencies';
import withWidth from '@material-ui/core/withWidth';

interface Transaction {
  date: Date
  description: string
  value: number
  currency: string
  to: string
  from: string
  sended: boolean
  entry: boolean
  out: boolean
  received: boolean
}

interface Balance {
  code: string
  value: number
  transactions: Array<Transaction>
}

interface Account {
  id: string
  description: string
  balances: Array<Balance>
}
interface State {
  account: Account | null
  loading: boolean
}

class AccountTransactionsList extends Component<any, State> {

  public readonly state = { account: null, loading: true }

  componentWillMount = () => {
    const { id } = this.props.match.params;

    FirebaseService.getUniqueDataBy('accounts', id, (data: Account) => {
      this.setState({ account: { ...data, id }, loading: false });
    });
  };

  render() {
    const { account, loading } = this.state;

    if (loading || !account) return null;

    const getGridListCols = () => {
      if (this.props.width === 'xs') {
        return 4;
      }
      if (this.props.width === 'sm') {
        return 2;
      }
      if (this.props.width === 'md') {
        return 2;
      }
      return 1;
    }

    const { balances } = account;
    const transactions = (balances || []).reduce((acc, value: Balance) => acc.concat(value.transactions || []), new Array<Transaction>());
    console.log(transactions);

    return (
      <React.Fragment>
        <Typography style={{ padding: 8 }} variant="headline" component="h2">Moedas vincuadas a essa conta</Typography>
        <GridList cellHeight={110} cols={4}>
          {(balances || []).map((balance: Balance) => {
            const l10n = new Intl.NumberFormat("pt-BR", { style: "currency", currency: balance.code });
            const currency = currencies.find(currency => currency.code === balance.code);
            return (
              <GridListTile key={balance.code} cols={getGridListCols()}>
                <Card style={{ margin: 2 }}>
                  <CardContent>
                    <Typography variant="headline" component="h2">{currency ? currency.singular : balance.code}</Typography>
                    <Typography>{`Valor: ${l10n.format(balance.value)}`}</Typography>
                  </CardContent>
                </Card>
              </GridListTile>
            );
          })}
        </GridList>
        <Typography style={{ padding: 8 }} variant="headline" component="h2">Transações vinculadas com essa conta</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Moeda</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Descrição</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction: Transaction, index: number) => {
              const l10n = new Intl.NumberFormat("pt-BR", { style: "currency", currency: transaction.currency });
              let type;
              if (transaction.entry) type = 'Entrada';
              if (transaction.out) type = 'Saída';
              if (transaction.sended) type = 'Enviado';
              if (transaction.received) type = 'Recebido';

              return (
                <TableRow key={transaction.currency + transaction.date + index}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.currency}</TableCell>
                  <TableCell>{l10n.format(transaction.value)}</TableCell>
                  <TableCell>{type}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </React.Fragment>
    );
  }
}

export default withWidth()(AccountTransactionsList);