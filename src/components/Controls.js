import React, { Component } from 'react'
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

  callBackendAPI = async (url, data) => {
    var headers = {
       "Content-Type": "application/json",                                                                                                
       "Access-Control-Origin": "*"
    }
    const response = await fetch (url, {
                                          method: 'POST',
                                          headers: headers,
                                          body: JSON.stringify(data)
                                        })
    const body = await response.json()

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body
  }

  getData = () => {
    //chiamata a funzione di update stato lato Python
    this.callBackendAPI('/api/getData', {data: ""})
      .then(res => {
        res.map((item) => {
          return this.setState({[item.Name]: item}) 
        })
      })
      .catch(err => console.log(err))
  }

  componentDidMount() {
    this.getData()
    this.interval = setInterval(this.getData, 5000)
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
        <Grid item xs={12} sm={6} md={6}>
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