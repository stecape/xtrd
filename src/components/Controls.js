import React, { Component } from 'react'
import axios from 'axios'
import Typography from '@material-ui/core/Typography'
import Setpoint from "./Set"
import Actual from "./Act"
import SetAct from "./SetAct"
import LogicSelection from "./LogicSelection"
import LogicButton from "./LogicButton"
import LogicVisualization from "./LogicVisualization"
import Grid from '@material-ui/core/Grid'




export default class Controls extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
    this.updateLogicStatus = this.updateLogicStatus.bind(this);
  }

  updateLogicStatus = (tag, val) => {
    this.setState({[tag]: {status: val}})
  }

  axiosFunc = () => {
    //chiamata a funzione di update stato lato Python
    axios.get('http://127.0.0.1:3002/getData').then(results => {

      var res = JSON.parse(results.data.replace(/'/g, ''))
      res.map((item) => {
        return this.setState({[item.Name]: item}) 
      })
    })
  }

  componentDidMount() {
    this.axiosFunc()
    this.interval = setInterval(this.axiosFunc, 5000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <div>
        <Typography variant="h4" color="inherit">
          Controls
        </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={2}>
          <Grid container spacing={1} direction="column" alignItems="stretch">
            <Setpoint tag={this.state.Temperature}/>
            <Actual tag={this.state.Pressure} />
            <SetAct tag={this.state.Tension} />
            <LogicSelection tag={this.state.Motor} updateLogicStatus={(val) => this.updateLogicStatus("Motor", val)} />
            <LogicButton tag={this.state.Jog} updateLogicStatus={(val) => this.updateLogicStatus("Jog", val)} />
            <LogicVisualization tag={this.state.LimitSwitch} />
          </Grid>
        </Grid>
      </Grid>
      </div>
    )
  }
}