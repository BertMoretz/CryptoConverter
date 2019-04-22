import React, { Fragment } from "react"
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputBase from '@material-ui/core/InputBase';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Card from '@material-ui/core/Card';
import Tooltip from '@material-ui/core/Tooltip';


import style from "./home-page.css"

export class HomePage extends React.Component {

  state = {
    fiat: 'USD',
    crypto: 'BTC',
    value: '',
    result: '',
    fiatToCrypto: true,
    fiatValue: 0,
    cryptoValue: 0,
  }

  componentDidMount() {
    this.loadCrypt();
  }

  loadCrypt = () => {
    axios
        .get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=USD,EUR,RUB&api_key=592432a04e855b5ee3900db3de717330cc5d8799a7fecdea6e49223a12bff4c6')
        .then(response => {
            console.log('Axios returned', response.data)
            this.setState( {
                  cryptos: response.data
                })
        });
  }

  countResult = () => {
    let f = this.state.fiat;
    let c = this.state.crypto;
    let v = this.state.value;
    let r = this.state.result;
    let re;
    if (this.state.fiatToCrypto) {
      re = v / this.state.cryptos[c][f];
      this.setState({ result: re }, () => {
        console.log(this.state.result)
      });
    } else {
      re = r * this.state.cryptos[c][f];
      this.setState({ value: re }, () => {
        console.log(this.state.value)
      });
    }


  }

  // handleChangeFiat = event => {
  //   this.setState({ fiat: event.target.value },  () => {
  //     this.countResult();
  //   });
  // };
  //
  // handleChangeCrypto = event => {
  //   this.setState({ crypto: event.target.value },  () => {
  //     this.countResult();
  //   });
  // };

  handle = event => {
    let value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      this.setState({
             value: event.target.value
      },  () => {
        this.countResult();
      })
    }

  };

  handleCrypto = event => {
    let value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      this.setState({
             result: event.target.value
      },  () => {
        this.countResult();
      })
    }
  };

  rotate = event => {
    let temp = !this.state.fiatToCrypto;
    this.setState({
           fiatToCrypto: temp,
           value: '',
           result: '',
    },  () => {
      this.countResult();
    })
  }

  handleChangeFiat = (event, value) => {
    this.setState({ fiatValue : value }, () => {
      if (value == 0)
        this.setState({fiat: "USD"}, () => {
          this.countResult();
        })
      if (value == 1)
        this.setState({fiat: "EUR"}, () => {
          this.countResult();
        })
      if (value == 2)
        this.setState({fiat: "RUB"}, () => {
          this.countResult();
        })
    });
  };

  handleChangeCrypto = (event, value) => {
    this.setState({ cryptoValue : value }, () => {
      if (value == 0)
        this.setState({crypto: "BTC"}, () => {
          this.countResult();
        })
      if (value == 1)
        this.setState({crypto: "ETH"}, () => {
          this.countResult();
        })
    });
  };

  putFocusFiat = () => {
    document.getElementById("fiat-input").focus();
  }

  putFocusCrypto = () => {
    document.getElementById("crypto-input").focus();
  }

  render() {
    const { fiatValue } = this.state;
    const { cryptoValue } = this.state;

      if(!this.state.cryptos) {
        return <div className={style.loading}> <CircularProgress /> </div>
      }
      return (
        <div className={style.main}>
          <Card className={style.convertcard}>
          <Grid container spacing={0} className={style.content}>
            <Grid item xs={6} md={6} className={!this.state.fiatToCrypto ? `${style.borderoutline} ${style.result}`: `${style.borderoutline} ${style.source}`} onClick={this.putFocusFiat}>

              <Tabs
                className={style.tab}
                value={fiatValue}
                onChange={this.handleChangeFiat}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label="USD" className={style.tabElement}/>
                <Tab label="EUR" className={style.tabElement}/>
                <Tab label="RUB" className={style.tabElement}/>
              </Tabs>

            <FormControl className={style.inputForm} disabled={!this.state.fiatToCrypto}>
              <InputBase
                id="fiat-input"
                value={this.state.value}
                className={style.bootstrapRoot}
                onChange={this.handle}
                placeholder = {"0  " + this.state.fiat}
              />
            </FormControl>
            </Grid>

            <Tooltip title="Reverse Convertion" aria-label="Reverse Convertion">
              <div className={style.currSwapper} >
                <IconButton onClick={this.rotate} className={this.state.fiatToCrypto ? `${style.icon}` : `${style.iconback}`}>
                  <ArrowBackIcon />
                </IconButton>
              </div>
            </Tooltip>

            <Grid item xs={6} md={6} className={this.state.fiatToCrypto ? `${style.result}`: `${style.source}`} onClick={this.putFocusCrypto}>
            <Tabs
              className={style.tab}
              value={cryptoValue}
              onChange={this.handleChangeCrypto}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="BTC" className={style.tabElement}/>
              <Tab label="ETH" className={style.tabElement}/>
            </Tabs>

            <FormControl disabled={this.state.fiatToCrypto}>
              <InputBase
                id="crypto-input"
                value={this.state.result}
                classes={{
                  root: style.bootstrapRoot,
                  input: style.bootstrapInput,
                }}
                onChange={this.handleCrypto}
                placeholder = {"0  " + this.state.crypto}
              />
            </FormControl>
            </Grid>
          </Grid>
          </Card>
        </div>
      )
  }
}
