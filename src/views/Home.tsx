import React, { Component } from 'react';
import { Typography, Card, CardContent, CardActionArea} from "@material-ui/core/index";

interface Props {
  history?: any
}

class Home extends Component<Props> {

  render() {
    return (
      <React.Fragment>
        <Card style={{ margin: '2%' }}>
          <CardActionArea onClick={() => this.props.history.push('/account')}>
            <CardContent>
              <Typography variant="headline" component="h2">Cadastro de contas</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card style={{ margin: '2%' }}>
          <CardActionArea onClick={() => this.props.history.push('/accounts')}>
            <CardContent>
              <Typography variant="headline" component="h2">Listagem de contas</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card style={{ margin: '2%' }}>
          <CardActionArea onClick={() => this.props.history.push('/accounts-entry')}>
            <CardContent>
              <Typography variant="headline" component="h2">Cadastro de entrada</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card style={{ margin: '2%' }}>
          <CardActionArea onClick={() => this.props.history.push('/accounts-out')}>
            <CardContent>
              <Typography variant="headline" component="h2">Cadastro de saída</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </React.Fragment>
    );
  }
}

export default Home;
