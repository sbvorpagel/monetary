import React, { Component } from 'react';
import { Button, TextField, Typography, Card, CardContent, Select, MenuItem, InputLabel, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core/index";
import FirebaseService from "../services/FirebaseService";
import currencies from '../utils/currencies';

interface Balance {
  code: string
  value: number
}

interface Currency {
  code: string
  singular: string
}

interface State {
  id?: string | null
  description: string
  balances: Array<Balance>
  currency: Currency
  value: number,
  loading: boolean,
}

interface Props {
  match?: any
  history?: any
}

const InitialState = { loading: true, id: null, description: '', balances: new Array<Balance>(), currency: { code: '', singular: '' }, value: 0 };

class AccountsForm extends Component<Props, State> {

  public readonly state = InitialState

  componentWillMount = () => {
    this.getDate();
  };

  getDate = () => {
    const { id } = this.props.match.params;
    if (id) {
      FirebaseService.getUniqueDataBy('accounts', id, (data: any) => {
        this.setState({ ...data, id, currency: { code: '', singular: '' }, value: 0, loading: false });
      });
    } else {
      this.setState({ loading: false });
    }
  }

  onAddBalance = () => {
    const { value, currency, balances } = this.state;
    this.setState({ balances: balances.concat([{ value: value, code: currency.code }]) }, this.handleAdd);
  }

  submit = (event: any) => {
    event.preventDefault();
    this.handleAdd();
  };

  handleAdd = () => {
    const { id, description, balances } = this.state;

    if (!!id) {
      FirebaseService.updateData(id, 'accounts', {
        id,
        description,
        balances,
      }).then(this.getDate);
    } else {
      const newId = FirebaseService.pushData('accounts', {
        description,
        balances,
      });
      if (newId) {
        FirebaseService.updateData(newId, 'accounts', {
          id: newId,
          description,
          balances,
        }).then(() => this.props.history.push(`/monetary/account/${newId}`));
      }
    }
  }

  render() {
    const { id, description, currency, value, balances, loading } = this.state;
    const code = currency.code || '';

    if (loading) return null;

    return (
      <React.Fragment>
        <Card style={{ marginLeft: '2%', marginRight: '2%', marginTop: '2%' }}>
          <CardContent>
            <Typography variant="headline" component="h2">{!!id ? `Editar a conta '${description}'` : 'Adicionar nova conta'}</Typography>

            <form onSubmit={this.submit}>
              <TextField
                style={{
                  clear: 'left',
                  float: 'left',
                  display: 'inline-block',
                  marginTop: '2vh !important',
                }}
                type="text"
                value={description}
                label="Descrição"
                fullWidth
                required
                onChange={e => this.setState({ description: e.target.value })} />

              <Button type="submit" color='primary'
                style={{ marginTop: '20px', display: 'inline-block' }}>
                {!!id ? 'Editar conta' : 'Adicionar conta'}
              </Button>
            </form>
          </CardContent>
        </Card>
        {!!id && (
          <Card style={{ marginLeft: '2%', marginRight: '2%', marginTop: '2%' }}>
            <CardContent>
              <Typography variant="headline" component="h2">Adicionar saldo</Typography>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <InputLabel htmlFor="currency-select">Moeda</InputLabel>
                <Select
                  style={{ width: 200, marginRight: 8 }}
                  value={code}
                  onChange={e => {
                    const currency = currencies.find(currency => currency.code === e.target.value);
                    if (currency) {
                      this.setState({ currency: { code: currency.code, singular: currency.singular } });
                    }
                  }}
                  inputProps={{
                    name: 'currency',
                    id: 'currency-select',
                  }}
                >
                  <MenuItem value="">
                    <em>Selecione uma moeda</em>
                  </MenuItem>
                  {currencies.map(option => (
                    <MenuItem value={option.code}>
                      {option.singular}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  type="number"
                  value={value}
                  label="Saldo"
                  required
                  onChange={e => this.setState({ value: +e.target.value })} />
              </div>
              <Button onClick={this.onAddBalance} color='primary' style={{ marginTop: '20px', display: 'inline-block' }}>
                Adicionar
              </Button>
            </CardContent>
          </Card>
        )}
        {!!balances.length && (
          <Card style={{ marginLeft: '2%', marginRight: '2%', marginTop: '2%' }}>
            <CardContent>
              <Typography variant="headline" component="h2">Saldos vinculados na conta</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Moeda</TableCell>
                    <TableCell align="right">Saldo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {balances.map(balance => {
                    const currency = currencies.find(({ code }) => code === balance.code);
                    const l10n = new Intl.NumberFormat("pt-BR", { style: "currency", currency: balance.code })
                    return (
                      <TableRow key={balance.code}>
                        <TableCell align="left">
                          {!!currency && currency.singular}
                        </TableCell>
                        <TableCell align="right">{l10n.format(balance.value)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </React.Fragment>
    );
  }
}

export default AccountsForm;
