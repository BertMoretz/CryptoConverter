import React, { Fragment } from "react"
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withRouter } from "react-router-dom"

import style from './app-bar.css'

class MyAppBar extends React.Component {

  render() {
    return (
      <AppBar position="static">
        <Toolbar>
          <div className={style.logo}>
            <Typography variant="h6" color="inherit">
              CryptoConverter
            </Typography>
          </div>
          <Button color="inherit">Home</Button>
          <Button color="inherit">Stats</Button>
        </Toolbar>
      </AppBar>
    )
  }

}

export default withRouter(MyAppBar)
