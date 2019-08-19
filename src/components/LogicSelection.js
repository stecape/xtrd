import React, { Component } from 'react'
import axios from 'axios'
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

export default class LogicSelection extends Component {
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
      classe: 'LogicSelection'
    }
    this.isActive = this.isActive.bind(this)
    this.sendCommand = this.sendCommand.bind(this)
  }

  isActive = (index) => {
    return this.state.status[index]
  }

  sendCommand = (index, val) => {
    //chiamata a funzione di logicSelection lato Python
    var data ={}
    data['tag'] = this.state.Name
    data['index'] = index
    data['val'] = val
    axios({
      method: 'post',
      url: 'http://127.0.0.1:3002/logicSelection',
      data: data
    }).then((result) =>{
      this.props.updateLogicStatus(result.data.status)
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
                      onClick={() => this.sendCommand(index, true)}
                    >
                      {item}
                    </Button>
                  ) : ( 
                    <Button 
                      key={item}
                      onClick={() => this.sendCommand(index, true)}
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