import React, { Component } from "react";
import {
  Typography,
  Card,
  CardContent,
  TextField,
  Button
} from "@material-ui/core/index";

import Select from "./components/Select";

import FirebaseService from "../services/FirebaseService";
import currencies from "../utils/currencies";
import urls from "../utils/urls";

interface Transaction {
  date: string;
  description: string;
  value: number;
  currency: string;
  quotation: number;
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
  balances: Array<Balance>;
}

interface State {
  from: string;
  to: string;
  currencyFrom: string;
  currencyTo: string;
  accounts: Array<Account>;
  loading: boolean;
  description: string;
  quantity: number;
  quotation: number;
}

export default class AccountTransaction extends Component<any, State> {
  public readonly state = {
    loading: true,
    accounts: new Array<Account>(),
    currencyFrom: "",
    currencyTo: "",
    from: "",
    to: "",
    quotation: 0,
    quantity: 0,
    description: ""
  };

  componentWillMount = () => {
    FirebaseService.getDataList("accounts", (data: any) => {
      this.setState({ accounts: data, loading: false });
    });
  };

  addTransaction = (
    isFrom: boolean,
    balances: Array<Balance>,
    currencyFrom: string,
    currencyTo: string,
    quantity: number,
    quotation: number,
    description: string,
    accountTo: string,
    accountFrom: string
  ) => {
    if (!balances.some(balance => balance.code === currencyFrom)) {
      balances.push({
        code: currencyFrom,
        value: 0,
        transactions: new Array<Transaction>()
      });
    }
    if (!balances.some(balance => balance.code === currencyTo)) {
      balances.push({
        code: currencyTo,
        value: 0,
        transactions: new Array<Transaction>()
      });
    }
    return balances.map(balance => {
      if (balance.code === currencyFrom) {
        const transactions = balance.transactions || new Array<Transaction>();
        const value = quantity * quotation;
        return {
          ...balance,
          value: isFrom ? balance.value - value : balance.value + value,
          transactions: transactions.concat([
            {
              date: new Date().toISOString(),
              type: "TRANSACTION",
              quotation,
              sended: isFrom,
              value,
              currency: currencyFrom,
              to: accountTo,
              from: accountFrom,
              description
            }
          ])
        };
      }
      if (balance.code === currencyTo) {
        const transactions = balance.transactions || new Array<Transaction>();
        const value = quantity;
        return {
          ...balance,
          value: isFrom ? balance.value + value : balance.value - value,
          transactions: transactions.concat([
            {
              date: new Date().toISOString(),
              type: "TRANSACTION",
              quotation,
              sended: !isFrom,
              value,
              currency: currencyTo,
              to: accountTo,
              from: accountFrom,
              description
            }
          ])
        };
      }
      return balance;
    });
  };

  submit = (event: any) => {
    event.preventDefault();
    const {
      accounts,
      from,
      to,
      description,
      quotation,
      quantity,
      currencyFrom,
      currencyTo
    } = this.state;
    const accountFrom = accounts.find(account => account.id === from);
    const accountTo = accounts.find(account => account.id === to);

    if (accountFrom && accountTo) {
      const oldBalancesFrom = accountFrom.balances || new Array<Balance>();
      const oldBalancesTo = accountTo.balances || new Array<Balance>();
      const newBalancesFrom = this.addTransaction(
        true,
        oldBalancesFrom,
        currencyFrom,
        currencyTo,
        quantity,
        quotation,
        description,
        to,
        from
      );
      const newBalancesTo = this.addTransaction(
        false,
        oldBalancesTo,
        currencyFrom,
        currencyTo,
        quantity,
        quotation,
        description,
        to,
        from
      );

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

  getAccountMessage = (isSelected: boolean, text: string): string => {
    if (isSelected) {
      return `Selecione a moeda que sairá da conta ${text}`;
    }
    return "Selecione a moeda que sairá da conta";
  };

  findCurrencyByCode = (code: string) => {
    return (
      (!!code && currencies.find(currency => currency.code === code)) || {
        code: "",
        singular: "",
        plural: ""
      }
    );
  };

  getFormatedCurrency = (value: number, code: string) => {
    const l10n = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: code
    });
    return l10n.format(value);
  };

  getMonetaryItems = (balances: Array<Balance>) => {
    return balances.map((balance: Balance) => {
      const currency = this.findCurrencyByCode(balance.code);
      return {
        id: balance.code,
        description: `${
          currency ? currency.singular : balance.code
        } (Valor máximo: ${this.getFormatedCurrency(
          balance.value,
          balance.code
        )})`
      };
    });
  };

  render() {
    const {
      loading,
      accounts,
      from,
      to,
      currencyFrom,
      currencyTo,
      quotation,
      quantity,
      description
    } = this.state;

    const accountFrom = !!from && accounts.find(account => account.id === from);
    const accountTo = !!to && accounts.find(account => account.id === to);
    const balancesFrom =
      accountFrom && accountFrom.balances ? accountFrom.balances : [];
    const balancesTo =
      accountTo && accountTo.balances ? accountTo.balances : [];

    const monetaryFromMsg = this.getAccountMessage(
      !!from,
      //@ts-ignore
      accountFrom.description
    );

    const monetaryFromItens = this.getMonetaryItems(balancesFrom);

    const monetaryToMsg = this.getAccountMessage(
      !!to,
      //@ts-ignore
      accountTo.description
    );

    const monetaryToItens = this.getMonetaryItems(balancesTo);

    const sellCurrency = this.findCurrencyByCode(currencyTo);

    if (loading) return null;

    return (
      <div style={{ paddingBottom: 16 }}>
        <form onSubmit={this.submit}>
          <Card
            style={{ marginLeft: "2%", marginRight: "2%", marginTop: "2%" }}
          >
            <CardContent>
              <Typography variant="headline" component="h2">
                Carteira compradora
              </Typography>
              <Select
                value={from}
                onChange={(value: any) =>
                  this.setState({ from: value, currencyFrom: "" })
                }
                name="De"
                selectDefault="Selecione a carteira de compra"
                items={accounts}
              />

              <Select
                value={currencyFrom}
                onChange={(value: any) =>
                  this.setState({ currencyFrom: value })
                }
                name="Moeda da carteira de compra"
                selectDefault={monetaryFromMsg}
                items={monetaryFromItens}
              />
            </CardContent>
          </Card>
          <Card
            style={{ marginLeft: "2%", marginRight: "2%", marginTop: "2%" }}
          >
            <CardContent>
              <Typography variant="headline" component="h2">
                Carteira vendedora
              </Typography>
              <Select
                value={to}
                onChange={(value: any) =>
                  this.setState({ to: value, currencyTo: "" })
                }
                name="Para"
                selectDefault="Selecione carteira vendedora"
                items={accounts}
              />
              <Select
                value={currencyTo}
                onChange={(value: any) => this.setState({ currencyTo: value })}
                name="Moeda da carteira vendedora"
                selectDefault={monetaryToMsg}
                items={monetaryToItens}
              />
            </CardContent>
          </Card>
          {!!(from && to && currencyFrom && currencyTo) && (
            <Card
              style={{ marginLeft: "2%", marginRight: "2%", marginTop: "2%" }}
            >
              <CardContent>
                <Typography variant="headline" component="h2">
                  Valor e cotação
                </Typography>
                <TextField
                  type="number"
                  value={quantity}
                  label={`Quantidade de ${
                    sellCurrency.plural
                  } que será vendido`}
                  fullWidth
                  required
                  style={{
                    marginTop: 16
                  }}
                  onChange={e => this.setState({ quantity: +e.target.value })}
                />
                <TextField
                  type="number"
                  value={quotation}
                  label={`Cotação do ${
                    sellCurrency.singular
                  } que será usado na venda`}
                  fullWidth
                  required
                  style={{
                    marginTop: 16
                  }}
                  onChange={e => this.setState({ quotation: +e.target.value })}
                />
                <TextField
                  type="text"
                  value={description}
                  label="Descrição"
                  fullWidth
                  style={{
                    marginTop: 16
                  }}
                  onChange={e => this.setState({ description: e.target.value })}
                />
              </CardContent>
            </Card>
          )}
          {!!(
            from &&
            to &&
            currencyFrom &&
            currencyTo &&
            quantity &&
            quotation
          ) && (
            <Card
              style={{ marginLeft: "2%", marginRight: "2%", marginTop: "2%" }}
            >
              <CardContent>
                <Typography variant="headline" component="h2">
                  Resumo e confirmação
                </Typography>
                <br />
                <Typography>
                  {`Será transferido ${this.getFormatedCurrency(
                    quantity,
                    currencyTo
                  )} da conta  "${
                    accountTo ? accountTo.description : ""
                  }" e adicionado na conta "${
                    accountFrom ? accountFrom.description : ""
                  }". E será transferido ${this.getFormatedCurrency(
                    quantity * quotation,
                    currencyFrom
                  )} da conta "${
                    accountFrom ? accountFrom.description : ""
                  }" e adicionado na conta "${
                    accountTo ? accountTo.description : ""
                  }"`}
                </Typography>

                <Button
                  type="submit"
                  color="primary"
                  style={{ marginTop: "20px", display: "inline-block" }}
                >
                  Transferir
                </Button>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    );
  }
}
