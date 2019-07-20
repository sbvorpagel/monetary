import React, { Component } from "react";
import {
  Typography,
  Card,
  CardContent,
  GridListTile,
  GridList,
  Table,
  TableHead,
  TableBody,
  TableCell,
  Button,
  TableRow
} from "@material-ui/core/index";
import FirebaseService from "../services/FirebaseService";
import currencies from "../utils/currencies";
import withWidth from "@material-ui/core/withWidth";
import moment from "moment";
import { report } from "../utils/urls";

interface Transaction {
  date: Date;
  description: string;
  value: number;
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

class AccountTransactionsList extends Component<any, State> {
  public readonly state = { account: null, loading: true };

  componentWillMount = () => {
    const { id } = this.props.match.params;

    FirebaseService.getUniqueDataBy("accounts", id, (data: Account) => {
      this.setState({ account: { ...data, id }, loading: false });
    });
  };

  //@ts-ignore
  sortFunction = (a: Transaction, b: Transaction) => + (b.date > a.date) - (b.date < a.date);

  renderButton = (transactions: Array<Transaction>, code: string, id: string) => {
    const filtredTransactions = transactions
      .filter((transaction: Transaction) =>
          transaction.currency === code &&
          transaction.type === 'TRANSACTION' &&
          //@ts-ignore
          transaction.to === id &&
          transaction.sended
      );

      if (filtredTransactions && filtredTransactions.length) {
        return (
          <div style={{ flexGrow: 0 }}>
            <Button onClick={() => this.props.history.push(`${report.simplePath}/${id}/${code}`)}>Relatório</Button>
          </div>
        );
      }

      return (<div></div>)
  }

  render() {
    const { account, loading } = this.state;

    if (loading || !account) return null;

    const getGridListCols = () => {
      if (this.props.width === "xs") {
        return 4;
      }
      if (this.props.width === "sm") {
        return 2;
      }
      if (this.props.width === "md") {
        return 2;
      }
      return 1;
    };
    //@ts-ignore
    const { balances = [], id } = account || {};
    const transactions = (balances || []).reduce(
      //@ts-ignore
      (acc, value: Balance) => acc.concat(value.transactions || []),
      new Array<Transaction>()
    );

    return (
      <div style={{ paddingBottom: 16 }}>
        {!!balances && !!balances.length && (
          <React.Fragment>
            <Typography
              style={{ padding: 8 }}
              variant="headline"
              component="h2"
            >
              Moedas vincuadas a essa conta
            </Typography>
            <GridList cellHeight={110} cols={4}>
              {balances.map((balance: Balance) => {
                const l10n = new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: balance.code
                });
                const currency = currencies.find(
                  currency => currency.code === balance.code
                );
                return (
                  <GridListTile key={balance.code} cols={getGridListCols()}>
                    <Card style={{ margin: 2 }}>
                      <CardContent>
                        <div style={{ display: 'flex' }}>
                          <div style={{ flexGrow: 1 }}>
                            <Typography variant="headline" component="h2">
                              {currency ? currency.singular : balance.code}
                            </Typography>
                            <Typography>{`Valor: ${l10n.format(
                              balance.value
                            )}`}</Typography>
                          </div>
                          {this.renderButton(transactions, balance.code, id)}
                        </div>
                      </CardContent>
                    </Card>
                  </GridListTile>
                );
              })}
            </GridList>
          </React.Fragment>
        )}
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
                  <TableCell>Tipo</TableCell>
                  <TableCell>Descrição</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.sort(this.sortFunction).map((transaction: Transaction, index: number) => {
                  const l10n = new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: transaction.currency
                  });
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
                    <TableRow key={transaction.currency + transaction.date + index}>
                      <TableCell style={transaction.sended ? {color: 'red'} : {}} >{moment(transaction.date).format("DD/MM/YYYY HH:MM")}</TableCell>
                      <TableCell style={transaction.sended ? {color: 'red'} : {}}>{transaction.currency}</TableCell>
                      <TableCell style={transaction.sended ? {color: 'red'} : {}}>{l10n.format(transaction.value)}</TableCell>
                      <TableCell style={transaction.sended ? {color: 'red'} : {}}>{type}</TableCell>
                      <TableCell style={transaction.sended ? {color: 'red'} : {}}>{transaction.description}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default withWidth()(AccountTransactionsList);
