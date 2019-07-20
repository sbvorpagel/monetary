import React from "react";
import AccountForm from "./views/AccountForm";
import AccountList from "./views/AccountList";
import AccountTransaction from "./views/AccountTransaction";
import AccountTransactionsList from "./views/AccountTransactionsList";
import AccountTransfer from "./views/AccountTransfer";
import AccountEntry from "./views/AccountEntry";
import AccountOut from "./views/AccountOut";
import Home from "./views/Home";
import AccountReport from "./views/AccountReport";
import urls, {
  accountsEdit,
  home,
  accountTransactionsList,
  report
} from "./utils/urls";
import {
  Typography,
  IconButton,
  AppBar,
  Toolbar
} from "@material-ui/core/index";
import MenuIcon from "@material-ui/icons/Menu";
import { Route, Link } from "react-router-dom";

const App: React.FC = () => {
  return (
    <React.Fragment>
      <AppBar position="static" style={{ marginBottom: 16 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Menu"
            component={props => <Link to={`${home.path}`} {...props} />}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            Controle de carteiras
          </Typography>
        </Toolbar>
      </AppBar>
      <Route exact path={home.path} render={props => <Home {...props} />} />

      <Route
        exact
        path={accountsEdit.path}
        render={props => <AccountForm {...props} />}
      />

      <Route
        exact
        path={urls.accountsList.path}
        render={props => <AccountList {...props} />}
      />

      <Route
        exact
        path={urls.accountsTransaction.path}
        render={props => <AccountTransaction {...props} />}
      />

      <Route
        exact
        path={accountTransactionsList.path}
        render={props => <AccountTransactionsList {...props} />}
      />

      <Route
        exact
        path={urls.accountsTransfer.path}
        render={props => <AccountTransfer {...props} />}
      />

      <Route
        exact
        path={urls.accountsEntry.path}
        render={props => <AccountEntry {...props} />}
      />

      <Route
        exact
        path={urls.accountsOut.path}
        render={props => <AccountOut {...props} />}
      />

      <Route
        exact
        path={urls.accountsForm.path}
        render={props => <AccountForm {...props} />}
      />

      <Route
        exact
        path={report.path}
        render={props => <AccountReport {...props} />}
      />
    </React.Fragment>
  );
};

export default App;
