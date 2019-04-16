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
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';


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
    value: '0',
    result: '0',
    fiatToCrypto: true,
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

  handleChangeFiat = event => {
    this.setState({ fiat: event.target.value },  () => {
      this.countResult();
    });
  };

  handleChangeCrypto = event => {
    this.setState({ crypto: event.target.value },  () => {
      this.countResult();
    });
  };

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
           value: 0,
           result: 0,
    },  () => {
      this.countResult();
    })
  }

  render() {
      if(!this.state.cryptos) {
        return <div className={style.loading}> <CircularProgress /> </div>
      }
      return (
        <Grid container spacing={24}>
          <Grid item xs={12} md={5}>
          <FormControl className={style.margin}>
            <InputLabel htmlFor="fiat-customized-select" className={style.bootstrapLabel}>
              Fiat
            </InputLabel>
            <Select
              value={this.state.fiat}
              onChange={this.handleChangeFiat}
              input={<BootstrapInput name="fiat" id="fiat-customized-select" />}
            >
              <MenuItem value={"USD"}>USD</MenuItem>
              <MenuItem value={"EUR"}>EUR</MenuItem>
              <MenuItem value={"RUB"}>RUB</MenuItem>
            </Select>


          </FormControl>
          <FormControl disabled={!this.state.fiatToCrypto}>
            <InputLabel shrink htmlFor="bootstrap-input" className={style.bootstrapLabel}>
              Bootstrap
            </InputLabel>
            <InputBase
              id="bootstrap-input"
              value={this.state.value}
              classes={{
                root: style.bootstrapRoot,
                input: style.bootstrapInput,
              }}
              onChange={this.handle}
            />
          </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
          <IconButton className={style.fab} onClick={this.rotate}>
            <CompareArrowsIcon />
          </IconButton>
          </Grid>
          <Grid item xs={12} md={5}>
          <FormControl className={style.margin}>
            <InputLabel htmlFor="crypto-customized-select" className={style.bootstrapLabel}>
              Crypto
            </InputLabel>
            <Select
              value={this.state.crypto}
              onChange={this.handleChangeCrypto}
              input={<BootstrapInput name="crypto" id="crypto-customized-select" />}
            >
              <MenuItem value={"BTC"}>BTC</MenuItem>
              <MenuItem value={"ETH"}>ETH</MenuItem>
            </Select>
          </FormControl>

          <FormControl disabled={this.state.fiatToCrypto}>
            <InputLabel shrink htmlFor="bootstrap-input" className={style.bootstrapLabel}>
              Bootstrap
            </InputLabel>
            <InputBase
              id="bootstrap-input"
              value={this.state.result}
              classes={{
                root: style.bootstrapRoot,
                input: style.bootstrapInput,
              }}
              onChange={this.handleCrypto}
            />
          </FormControl>
          </Grid>
        </Grid>
      )
  }
}
