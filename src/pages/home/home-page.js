import React, { Fragment, useEffect, useState } from "react"
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
import * as utils from "../../utils/utils";


import style from "./home-page.css"

const HomePage = () => {
  const [flag, forceUpdate] = utils.useForceUpdate();

  const [fiat, setFiat] = useState('USD');
  const [crypto, setCrypto] = useState('BTC');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const [fiatToCrypto, setFiatToCrypto] = useState(true);
  const [fiatValue, setFiatValue] = useState(0);
  const [cryptoValue, setCryptoValue] = useState(0);


  const [exchangeRates, setExchangeRates] = useState(null);

  useEffect(() => {
    loadCrypt();
  }, [])

  useEffect(() => {
    if (exchangeRates) {
      countResult();
    }
  }, [value, result, fiat, crypto])


  const loadCrypt = () => {
    axios
        .get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP,EOS,BCH,LTC,TRX,LINK,BSV,OKB,ETC,BNB,MOF,VET,NEO,XMR,KAVA,ONT,USDC,ADA&tsyms=USD,EUR,RUB,JPY,GBP,AUD,CAD,CHF,CNY,ZAR,SEK,NOK,SGD,PLN,TRY,INR,CZK&api_key=592432a04e855b5ee3900db3de717330cc5d8799a7fecdea6e49223a12bff4c6')
        .then(response => {
            console.log('Axios returned', response.data)
            setExchangeRates(response.data);
            forceUpdate();
        });
  }

  const countResult = () => {
    let f = fiat;
    let c = crypto;
    let v = value;
    let r = result;
    let re;
    if (fiatToCrypto) {
      re = v / exchangeRates[c][f];
      setResult(re);
      putFocusFiat();
    } else {
      re = r * exchangeRates[c][f];
      setValue(re);
      putFocusCrypto();
    }


  };

  const handle = event => {
    let value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setValue(event.target.value);
      // forceUpdate();
    }

  };

  const handleCrypto = event => {
    let value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setResult(event.target.value);
      // forceUpdate();
    }
  };

  const rotate = event => {
    let temp = !fiatToCrypto;
    setFiatToCrypto(temp);
    setValue('');
    setResult('');
    // forceUpdate();
  }

  const handleChangeFiat = (event, value) => {
    setFiatValue(value);
    forceUpdate();
    if (value == 0) {
      setFiat("USD");
    }
    if (value == 1) {
      setFiat("EUR");
    }
    if (value == 2) {
      setFiat("RUB");
    }
  };

  const handleChangeCrypto = (event, value) => {
    setCryptoValue(value);
    // forceUpdate();
    if (value == 0) {
      setCrypto("BTC");
    }
    if (value == 1) {
      setCrypto("ETH");
    }
  };

  const putFocusFiat = () => {
    document.getElementById("fiat-input").focus();
  }

  const putFocusCrypto = () => {
    document.getElementById("crypto-input").focus();
  }

  return (
    <div>
      {!exchangeRates ?
        <div className={style.loading}>
          <CircularProgress />
        </div>
        :
        <div className={style.main}>
          <Card className={style.convertcard}>
          <Grid container spacing={0} className={style.content}>
            <Grid item xs={6} md={6} className={!fiatToCrypto ? `${style.borderoutline} ${style.result}`: `${style.borderoutline} ${style.source}`} onClick={putFocusFiat}>

              <Tabs
                className={style.tab}
                value={fiatValue}
                onChange={handleChangeFiat}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label="USD" className={style.tabElement}/>
                <Tab label="EUR" className={style.tabElement}/>
                <Tab label="RUB" className={style.tabElement}/>
              </Tabs>

            <FormControl className={style.inputForm} disabled={!fiatToCrypto}>
              <InputBase
                id="fiat-input"
                value={value}
                className={style.bootstrapRoot}
                onChange={handle}
                placeholder = {"0  " + fiat}
              />
            </FormControl>
            </Grid>

            <Tooltip title="Reverse Convertion" aria-label="Reverse Convertion">
              <div className={style.currSwapper} >
                <IconButton onClick={rotate} className={fiatToCrypto ? `${style.icon}` : `${style.iconback}`}>
                  <ArrowBackIcon />
                </IconButton>
              </div>
            </Tooltip>

            <Grid item xs={6} md={6} className={fiatToCrypto ? `${style.result}`: `${style.source}`} onClick={putFocusCrypto}>
            <Tabs
              className={style.tab}
              value={cryptoValue}
              onChange={handleChangeCrypto}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="BTC" className={style.tabElement}/>
              <Tab label="ETH" className={style.tabElement}/>
            </Tabs>

            <FormControl disabled={fiatToCrypto}>
              <InputBase
                id="crypto-input"
                value={result}
                classes={{
                  root: style.bootstrapRoot,
                  input: style.bootstrapInput,
                }}

                onChange={handleCrypto}
                placeholder = {"0  " + crypto}
              />
            </FormControl>
            </Grid>
          </Grid>
          </Card>
        </div>
      }
    </div>
  );
};

export default HomePage;
