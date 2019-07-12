import React, { Component } from "react";
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem
} from "@material-ui/core/index";
import FirebaseService from "../services/FirebaseService";
import currencies from "../utils/currencies";
import urls from "../utils/urls";

interface Transfer {
  date: string;
  description: string;
  value: number;
  currency: string;
  to: string;
  from: string;
  sended: boolean;
  out: boolean;
  entry: boolean;
  received: boolean;
}

interface Balance {
  code: string;
  value: number;
  transactions: Array<Transfer>;
}

interface Account {
  id: string;
  description: string;
  balances: Array<Balance>;
}

interface State {
  accounts: Array<Account>;
  loading: boolean;
  from: string;
  to: string;
  currency: string;
  description: string;
  value: number;
}

export default class AccountTransfer extends Component<any, State> {
  public readonly state = {
    loading: true,
    accounts: new Array<Account>(),
    from: "",
    to: "",
    value: 0,
    description: "",
    currency: ""
  };

  componentWillMount = () => {
    FirebaseService.getDataList("accounts", (data: any) => {
      this.setState({ accounts: data, loading: false });
    });
  };

  submit = (event: any) => {
    event.preventDefault();
    const { accounts, from, to, description, value, currency } = this.state;
    const accountFrom = accounts.find(account => account.id === from);
    const accountTo = accounts.find(account => account.id === to);

    if (accountFrom && accountTo) {
      const oldBalancesFrom = accountFrom.balances || new Array<Balance>();
      const newBalancesFrom = oldBalancesFrom.map(balance => {
        if (balance.code === currency) {
          const transactions = balance.transactions || new Array<Transfer>();
          return {
            ...balance,
            value: balance.value - value,
            transactions: transactions.concat([
              {
                date: new Date().toISOString(),
                sended: true,
                received: false,
                out: false,
                entry: false,
                value,
                currency,
                to,
                from,
                description
              }
            ])
          };
        }
        return balance;
      });

      const oldBalancesTo = accountTo.balances || new Array<Balance>();
      let newBalancesTo;
      if (oldBalancesTo.some(balance => balance.code === currency)) {
        newBalancesTo = oldBalancesTo.map(balance => {
          if (balance.code === currency) {
            const transactions = balance.transactions || new Array<Transfer>();
            return {
              ...balance,
              value: balance.value + value,
              transactions: transactions.concat([
                {
                  date: new Date().toISOString(),
                  sended: false,
                  received: true,
                  out: false,
                  entry: false,
                  value,
                  currency,
                  to,
                  from,
                  description
                }
              ])
            };
          }
          return balance;
        });
      } else {
        newBalancesTo = oldBalancesTo.concat([
          {
            value,
            code: currency,
            transactions: [
              {
                date: new Date().toISOString(),
                sended: false,
                received: true,
                out: false,
                entry: false,
                value,
                currency,
                to,
                from,
                description
              }
            ]
          }
        ]);
      }
      const promises = [
        FirebaseService.updateData(from, "accounts", {
          ...accountFrom,
          balances: newBalancesFrom
        }),
        FirebaseService.updateData(to, "accounts", {
          ...accountTo,
          balances: newBalancesTo
        })
      ];
      Promise.all(promises).then(() =>
        this.props.history.push(urls.accountsList.path)
      );
    }
  };

  render() {
    const {
      loading,
      accounts,
      from,
      to,
      currency,
      value,
      description
    } = this.state;

    console.log(to);

    const account = !!from && accounts.find(account => account.id === from);
    const balances = account && account.balances ? account.balances : [];

    if (loading) return null;

    return (
      <React.Fragment>
        <Card style={{ marginLeft: "2%", marginRight: "2%", marginTop: "2%" }}>
          <CardContent>
            <Typography variant="headline" component="h2">
              Criar transação entre contas
            </Typography>
            <form onSubmit={this.submit}>
              <Select
                value={from}
                onChange={e =>
                  this.setState({ from: e.target.value, to: "", currency: "" })
                }
                displayEmpty
                fullWidth
                name="De"
                style={{
                  marginTop: 16
                }}
              >
                <MenuItem value="">
                  <em>Selecione a conta que irá enviar</em>
                </MenuItem>
                {accounts.map(account => (
                  <MenuItem value={account.id}>{account.description}</MenuItem>
                ))}
              </Select>
              <Select
                value={to}
                onChange={e => this.setState({ to: e.target.value })}
                disabled={!from}
                displayEmpty
                fullWidth
                name="De"
                style={{
                  marginTop: 16
                }}
              >
                <MenuItem value="">
                  <em>Selecione a conta que irá receber</em>
                </MenuItem>
                {accounts
                  .filter(account => account.id !== from)
                  .map(account => (
                    <MenuItem value={account.id}>
                      {account.description}
                    </MenuItem>
                  ))}
              </Select>
              <Select
                value={currency}
                onChange={e => this.setState({ currency: e.target.value })}
                disabled={!from}
                displayEmpty
                fullWidth
                name="Moeda"
                style={{
                  marginTop: 16
                }}
              >
                <MenuItem value="">
                  <em>Selecione a moeda da transação</em>
                </MenuItem>
                {balances.map(balance => {
                  const l10n = new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: balance.code
                  });
                  const currency = currencies.find(
                    currency => currency.code === balance.code
                  );
                  return (
                    <MenuItem value={balance.code}>
                      {`${
                        currency ? currency.singular : balance.code
                      } (Valor máximo: ${l10n.format(balance.value)})`}
                    </MenuItem>
                  );
                })}
              </Select>
              <TextField
                type="number"
                value={value}
                label="Valor"
                fullWidth
                required
                style={{
                  marginTop: 16
                }}
                onChange={e => this.setState({ value: +e.target.value })}
              />
              <TextField
                type="text"
                value={description}
                label="Descrição"
                fullWidth
                required
                style={{
                  marginTop: 16
                }}
                onChange={e => this.setState({ description: e.target.value })}
              />
              <Button
                type="submit"
                color="primary"
                style={{ marginTop: "20px", display: "inline-block" }}
              >
                Transferir
              </Button>
            </form>
          </CardContent>
        </Card>
      </React.Fragment>
    );
  }
}
