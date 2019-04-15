import React, { Fragment } from "react"
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';

import style from "./home-page.css"

export class HomePage extends React.Component {

  state = { }

  componentDidMount() {
    this.loadGames();
  }

  loadGames = () => {
    axios
        .get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=USD,EUR,RUB&api_key=592432a04e855b5ee3900db3de717330cc5d8799a7fecdea6e49223a12bff4c6')
        .then(response => {
            console.log('Axios returned', response.data)
            this.setState( {
                  cryptos: response.data
                })
        });
  }

  render() {
      if(!this.state.cryptos) {
        return <div className={style.loading}> <CircularProgress /> </div>
      }
      return (
        <div>
          
        </div>
      )
  }
}
