import React, { Component } from 'react';
import { GridList, GridListTile, Card, CardContent, Typography, Input, Button } from "@material-ui/core/index";
import withWidth from '@material-ui/core/withWidth';
import FirebaseService from "../services/FirebaseService";

interface Balance {
  code: string
  value: number
}

interface Account {
  id: string
  description: string
  balances: Array<Balance>
}

interface State {
  accounts: Array<Account>
  viewList: Array<Account>
  loading: boolean
}

class AccountList extends Component<any, State> {

  public readonly state = { accounts: new Array<Account>(), viewList: new Array<Account>(), loading: true }

  componentWillMount = () => {
    FirebaseService.getDataList('accounts', (data: any) => {
      this.setState({ accounts: data, viewList: data, loading: false });
    });
  };

  onSearch = (event: any) => {
    const { accounts } = this.state;
    if (event && event.target && event.target.value) {
      this.setState({ viewList: accounts.filter(({ description }) => description.indexOf(event.target.value) >= 0) });
    } else {
      this.setState({ viewList: accounts });
    }
  }

  render() {
    const { viewList, loading } = this.state;
    if (loading) return null;

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

    return (
      <React.Fragment>
        <Input type='search' placeholder="Buscar..." style={{ marginLeft: '10%', marginRight: '10%', width: '80%' }} onChange={e => this.onSearch(e)} />
        <GridList cellHeight={150} cols={4}>
          {viewList.map((account: Account) => (
            <GridListTile key={account.id} cols={getGridListCols()}>
              <Card style={{ margin: 16 }}>
                <CardContent>
                  <Typography variant="headline" component="h2">{account.description}</Typography>
                  <Typography>{`Moedas: ${(account.balances || []).length}`}</Typography>
                  <Button color='inherit' onClick={() => this.props.history.push(`/monetary/account/${account.id}`)}>Editar</Button>
                  <Button color='primary' onClick={() => this.props.history.push(`/monetary/account-transactions-list/${account.id}`)}>Ver transações</Button>
                </CardContent>
              </Card>
            </GridListTile>
          ))}
        </GridList>
      </React.Fragment>
    );
  }
}

export default withWidth()(AccountList);