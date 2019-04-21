import React, { Fragment } from "react"
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputBase from '@material-ui/core/InputBase';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


import style from "./home-page.css"

const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 18,
    width: 'auto',
    textAlign: 'center',
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      'Roboto',
      'sans-serif',,
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

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

  render() {
    const { fiatValue } = this.state;
    const { cryptoValue } = this.state;

      if(!this.state.cryptos) {
        return <div className={style.loading}> <CircularProgress /> </div>
      }
      return (
        <div className={style.main}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={5}>
              <Tabs
                value={fiatValue}
                onChange={this.handleChangeFiat}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label="USD" />
                <Tab label="EUR" />
                <Tab label="RUB" />
              </Tabs>

            <FormControl disabled={!this.state.fiatToCrypto}>
              <InputBase
                id="bootstrap-input"
                value={this.state.value}
                className={style.bootstrapRoot}
                onChange={this.handle}
                placeholder = {"0  " + this.state.fiat}
              />
            </FormControl>
            </Grid>

            <Grid item xs={12} md={1}>
              <div className={style.currSwapper} >
                <IconButton onClick={this.rotate} className={this.state.fiatToCrypto ? `${style.icon}` : `${style.hey}`}>
                  <ArrowBackIcon />
                </IconButton>
              </div>
            </Grid>

            <Grid item xs={12} md={5}>
            <Tabs
              value={cryptoValue}
              onChange={this.handleChangeCrypto}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="BTC" />
              <Tab label="ETH" />
            </Tabs>

            <FormControl disabled={this.state.fiatToCrypto}>
              <InputBase
                id="bootstrap-input"
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
        </div>
      )
  }
}
