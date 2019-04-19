import React, { Fragment } from "react"
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withRouter } from "react-router-dom"

import style from './app-bar.css'

class MyAppBar extends React.Component {

  buildDetailsClickHandler = (link) => () => {
     this.props.history.replace(`/${link}`)
   }

  render() {
    return (
      <AppBar position="static" color="primary">
        <Toolbar>
          <div className={style.logo}>
            <Typography variant="h6" color="inherit">
              CryptoConverter
            </Typography>
          </div>
          <Button color="inherit" onClick={this.buildDetailsClickHandler("home")}>Home</Button>
          <Button color="inherit" onClick={this.buildDetailsClickHandler("statistics")}>Stats</Button>
        </Toolbar>
      </AppBar>
    )
  }

}

export default withRouter(MyAppBar)
