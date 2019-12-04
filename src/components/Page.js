import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'



export default class Page extends Component {
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
       "Content-Type": "application/json; charset=utf-8",                                                                                                
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
    //chiamata a funzione di update stato lato Server
    this.callBackendAPI(this.props.call, {data: ""})
      .then(res => {
        Object.keys(res.ProbeData).map((key) => {
          var value = Number(res.ProbeData[key])
          //this.setState({[key]: value})
          return this.props.returnValue(this.props.mapping[key], value)
        })
      })
      .catch(err => console.log(err))
  }

  componentDidMount() {
    this.getData()
    this.interval = setInterval(this.getData, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {

    return (
      <div>
        <Typography variant="h4" color="inherit">
          {this.props.title}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <Grid container spacing={1} direction="column" alignItems="stretch">
                {this.props.children}
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}