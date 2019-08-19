import React, { Component } from 'react'
import axios from 'axios'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core'


const CSSTextField = withStyles({
  root: {
    marginBottom: '12px',
    width: '100%'
  },
})(TextField)

export default class SetContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Name: '',
      init: false,
      conversion: {
        PIunit: '',
        HMIunit: '',
        'scale': 1,
        'offset': 0,
        'PIDecimals': 0,
        'HMIDecimals': 0,
      },
      limits: {
        PIMin: 0,
        PIMax: 0,
        HMIMin: 0,
        HMIMax: 0
      },
      setpoint: {
        PIVal: 0,
        HMIVal: 0
      },
      force: {
        previousForce: false,
        force: false,
        previousValue: '',
        forceValue: ''
      },
      lockValue: false,
      display: [],
      classe: 'Set',
      internalVal: 0
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleFocusIn = this.handleFocusIn.bind(this)
  }

  handleChange = (event) => {
    this.setState({ internalVal: event.target.value })
  }

  handleSubmit = (event) => {
    //chiamata a funzione di set lato Python
    var data ={}
    data['tag'] = this.state.Name
    data['val'] = this.state.internalVal
    event.preventDefault()
    event.stopPropagation()
    axios({
      method: 'post',
      url: 'http://127.0.0.1:3002/set',
      data: data
    }).then((result) =>{
      this.setState(result.data)
      this.setState({internalVal: result.data.setpoint.HMIVal})
    })
  }


  componentWillUnmount() {
    clearTimeout(this.timeOut)
  }

  handleFocusIn() {
    this.timeOut = setTimeout(() => { 
      this.setState({ internalVal: this.state.setpoint.HMIVal })
      this.inputDOM.blur()
    }, 20000)    
  }

  static getDerivedStateFromProps(props, state) {
    if (props.tag && (props.tag !== state)) {
      var obj = { 
        Name: props.tag.Name,
        init: props.tag.init,
        conversion: props.tag.conversion,
        limits: props.tag.limits,
        force: props.tag.force,
        lockValue: props.tag.lockValue,
        display: props.tag.display,
        classe: props.tag.classe,
        setpoint: props.tag.setpoint
      }
      if (props.tag.setpoint.HMIVal.toString() !== state.setpoint.HMIVal.toString()){
        obj["internalVal"] = props.tag.setpoint.HMIVal
      }
      return obj
    }
    return {}
  }

  render() {
    const inputProps = {
      step: 'any',
    }
    return (
      <Grid item>
        <form method="post" onSubmit={this.handleSubmit}>
          <CSSTextField
            id={this.state.Name}
            name={this.state.Name}
            onFocus={this.handleFocusIn}
            inputRef={(inputDOM) => { this.inputDOM = inputDOM }}
            onChange={this.handleChange}
            value={this.state.internalVal}
            type="number"
            inputProps={inputProps}
            InputProps={{
              startAdornment: <InputAdornment position="start">{this.state.conversion.HMIunit}</InputAdornment>,
            }}
            variant="filled"
          />
        </form>
      </Grid>
    )
  }
}