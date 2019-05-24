import React, { Component } from 'react';
import { Button, TextField, Typography, Card, CardContent, Select, MenuItem } from "@material-ui/core/index";
import FirebaseService from "../../services/FirebaseService";
import currencies from '../../utils/currencies';

interface Transaction {
  date: string
  description: string
  value: number
  currency: string
  from: string
  sended: boolean
  out: boolean
  entry: boolean
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
  accounts: Array<Account>
  loading: boolean
  from: string
  currency: string
  description: string
  value: number
}

interface Prop {
  isEntry?: boolean
  history?: any
}

export default class AccountTransaction extends Component<Prop, State> {

  public readonly state = { loading: true, accounts: new Array<Account>(), from: '', to: '', value: 0, description: '', currency: '' }

  componentWillMount = () => {
    FirebaseService.getDataList('accounts', (data: any) => {
      this.setState({ accounts: data, loading: false });
    });
  };

  submit = (event: any) => {
    event.preventDefault();
    const { accounts, from, description, value, currency } = this.state;
    const { isEntry } = this.props;
    const accountFrom = accounts.find(account => account.id === from);

    if (accountFrom) {
      const oldBalancesFrom = accountFrom.balances || new Array<Balance>();
      const newBalancesFrom = oldBalancesFrom.map(balance => {
        if (balance.code === currency) {
          const transactions = balance.transactions || new Array<Transaction>();
          return {
            ...balance,
            value: isEntry ? balance.value + value : balance.value - value,
            transactions: transactions.concat([{ date: new Date().toISOString(), value, currency, from, description, sended: false, received: false,  entry: !!isEntry, out: !isEntry }])
          }
        }
        return balance;
      });

      FirebaseService.updateData(from, 'accounts', {
        ...accountFrom,
        balances: newBalancesFrom,
      }).then(() => this.props.history.push('/accounts/'));
    }
  };

  render() {

    const { loading, accounts, from, currency, value, description } = this.state;
    const { isEntry } = this.props;

    const account = !!from && accounts.find(account => account.id === from);
    const balances = account && account.balances ? account.balances : [];

    if (loading) return null;

    return (
      <React.Fragment>
        <Card style={{ marginLeft: '2%', marginRight: '2%', marginTop: '2%' }}>
          <CardContent>
            <Typography variant="headline" component="h2">{!!isEntry ? 'Adicionar Entrada' : 'Adicioanr Saída'}</Typography>
            <form onSubmit={this.submit}>
              <Select
                value={from}
                onChange={e => this.setState({ from: e.target.value, currency: '' })}
                displayEmpty
                fullWidth
                name="De"
                style={{
                  marginTop: 16,
                }}
              >
                <MenuItem value="">
                  <em>Selecione a conta</em>
                </MenuItem>
                {accounts.map(account => (
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
                  marginTop: 16,
                }}
              >
                <MenuItem value="">
                  <em>Selecione a moeda</em>
                </MenuItem>
                {balances.map(balance => {
                  const l10n = new Intl.NumberFormat("pt-BR", { style: "currency", currency: balance.code });
                  const currency = currencies.find(currency => currency.code === balance.code);
                  const complement = !isEntry ? ` (Valor máximo: ${l10n.format(balance.value)})`: ''
                  return (
                    <MenuItem value={balance.code}>
                      {`${currency ? currency.singular : balance.code}${complement}`}
                    </MenuItem>
                  )
                })}
              </Select>
              <TextField
                type="number"
                value={value}
                label="Valor"
                fullWidth
                required
                style={{
                  marginTop: 16,
                }}
                onChange={e => this.setState({ value: +e.target.value })} />
              <TextField
                type="text"
                value={description}
                label="Descrição"
                fullWidth
                required
                style={{
                  marginTop: 16,
                }}
                onChange={e => this.setState({ description: e.target.value })} />
              <Button type="submit" color='primary'
                style={{ marginTop: '20px', display: 'inline-block' }}>
                {!!isEntry ? 'Adicionar entrada' : 'Adicionar saída'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </React.Fragment>
    );
  }
}