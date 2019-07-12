import React, { Component } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardActionArea
} from "@material-ui/core/index";
import urls from "../utils/urls";

interface Props {
  history?: any;
}

interface MenuItem {
  name: string;
  path: string;
}

const keys = Object.keys(urls);
// @ts-ignore
const menuItems: Array<MenuItem> = (keys || []).map((key: string) => urls[key]);

class Home extends Component<Props> {
  MenuRenderer = (menuItem: MenuItem) => {
    return (
      <Card style={{ margin: "16px" }}>
        <CardActionArea onClick={() => this.props.history.push(menuItem.path)}>
          <CardContent>
            <Typography variant="headline" component="h2">
              {menuItem.name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  };

  render() {
    return (
      <React.Fragment>
        {menuItems.map(menuItem => (
          <this.MenuRenderer
            key={menuItem.path}
            name={menuItem.name}
            path={menuItem.path}
          />
        ))}
      </React.Fragment>
    );
  }
}

export default Home;
