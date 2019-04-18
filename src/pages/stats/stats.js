import React, { Fragment } from "react"
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import CircularProgress from '@material-ui/core/CircularProgress';

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

  render() {
    if(!this.state.data) {
      return <div className={style.loading}> <CircularProgress /> </div>
    }

    return (
      <div className={style.chart}>
        <LineChart width={1000} height={300} data={this.state.data.Data}>
          <Line strokeWidth={4} type="monotone" dataKey="close" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="time" tick={this.renderCustomAxisTick}/>
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>
    )
  }
}
