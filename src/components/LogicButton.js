import React, { Component } from 'react'
import Container from './Container'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core'

const CSSButtonGroup = withStyles({
  root: {
    marginBottom: '12px',
    width: '100%'
  }
})(ButtonGroup)

export default class LogicButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Name: '',
      length: 2,
      labels: ['Off', 'On'],
      command: [0, 0],
      force: [0, 0],
      notAllowed: [0, 0],
      status: [1, 0],
      display: [],
      classe: 'LogicButton'
    }
    this.isActive = this.isActive.bind(this)
    this.logicButton = this.logicButton.bind(this)
  }

  isActive = (index) => {
    return this.state.status[index]
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

  logicButton = (index, val) => {
    //chiamata a funzione di logicSelection lato Python
    var data ={}
    data['tag'] = this.state.Name
    data['index'] = index
    data['val'] = val
    this.callBackendAPI('/api/logicSelection', data)
      .then((result) =>{
        this.props.updateLogicStatus(result.status)
      })
  }

  static getDerivedStateFromProps(props, state) {
    if (props.tag && (props.tag !== state)) {
      return props.tag
    }
    return {}
  }

  render() {
    return (
      <Container tag={this.state}>
        <Grid item>
          <CSSButtonGroup
            size="large"
          >
            {
              this.state.labels.map((item, index) =>{
                var active = this.isActive(index)
                return (
                  active ? (
                    <Button 
                      key={item}
                      color='primary'
                      variant='contained'
                      onMouseDown={() => this.logicButton(index, true)}
                      onMouseUp={() => this.logicButton(index, false)}
                      onMouseOut={() => {if (this.state.status[index]) {this.logicButton(index, false)}}}
                      onBlur={() => this.logicButton(index, false)}
                    >
                      {item}
                    </Button>
                  ) : ( 
                    <Button 
                      key={item}
                      onMouseDown={() => this.logicButton(index, true)}
                      onMouseUp={() => this.logicButton(index, false)}
                      onMouseOut={() => {if (this.state.status[index]) {this.logicButton(index, false)}}}
                      onBlur={() => this.logicButton(index, false)}
                    >
                      {item}
                    </Button>
                  )
                )
              })
            }
          </CSSButtonGroup>
        </Grid>
      </Container>
    )
  }
}