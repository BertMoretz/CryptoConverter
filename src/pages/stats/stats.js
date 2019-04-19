import React, { Fragment } from "react"
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import style from "./stats.css"

export class Stats extends React.Component {
  state = {
    fsym: "BTC",
    tsym: "USD",
    limit: 7,
  }

  componentDidMount() {
    this.loadData(this.state.fsym,this.state.tsym,this.state.limit);
  }

  loadData = (fsym, tsym, limit) => {
    axios
      .get(`https://min-api.cryptocompare.com/data/histoday?fsym=${fsym}&tsym=${tsym}&limit=${limit}&api_key=592432a04e855b5ee3900db3de717330cc5d8799a7fecdea6e49223a12bff4c6`)
      .then(response => {
        console.log('Axios returned', response.data)
        this.setState( {
              data: response.data
            })
      });
  }

  renderCustomAxisTick = ({ x, y, payload }) => {
    var date = new Date(payload.value * 1000);
    return (
      <text x={x} y={y+20} fill="#666" textAnchor="middle">
        {date.toDateString().substring(3,15)}
      </text>

    );
  }

  renderCustomY = ({ x, y, payload }) => {
    let currency;
    if (this.state.tsym == "USD")
      currency = "$";
    if (this.state.tsym == "EUR")
        currency = "€";
    if (this.state.tsym == "RUB")
        currency = "R";

    return (
      <text x={x-26} y={y+5} fill="#666" textAnchor="middle">
        {payload.value + currency}
      </text>

    );
  }

  customTooltip = ({payload, label, active}) => {
    if (active) {
      var date = new Date(label * 1000);
      return(
        <div className={style.customtooltip}>
          <p>{date.toDateString().substring(3,15)}</p>
          <p>{`1 ${this.state.fsym} = ${payload[0].value} ${this.state.tsym}`}</p>
        </div>
      );
    }

    return null;

  }

  handleClick = (currency) => () => {
    this.setState({
           tsym: currency
    },  () => {
      this.loadData(this.state.fsym,this.state.tsym,this.state.limit);
    })
  }

  render() {
    if(!this.state.data) {
      return <div className={style.loading}> <CircularProgress /> </div>
    }

    return (
      <Grid container spacing={8}>
        <Grid item xs={10} md={10}>
          <div className={style.chart}>
            <LineChart width={window.innerWidth - window.innerWidth*0.2} height={300} data={this.state.data.Data}>
              <Line strokeWidth={4} type="monotone" dataKey="close" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="time" tick={this.renderCustomAxisTick}/>
              <YAxis tick={this.renderCustomY}/>
              <Tooltip content={this.customTooltip}/>
            </LineChart>
          </div>
        </Grid>
        <Grid item xs={2} md={1}>
          <div className={style.chart}>
            <Button color="primary" size="medium" className={style.button} onClick={this.handleClick("USD")}>
              USD
            </Button>
            <Button color="primary" size="medium" className={style.button} onClick={this.handleClick("EUR")}>
              EUR
            </Button>
            <Button color="primary" size="medium" className={style.button} onClick={this.handleClick("RUB")}>
              RUB
            </Button>
          </div>
        </Grid>
      </Grid>
    )
  }
}
