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
  },
})(ButtonGroup)
const CSSButton = withStyles({
  root: {
    cursor: 'default'
  }
})(Button)
const CSSButtonActive = withStyles({
  root: {
    cursor: 'default',
    fontWeight: 'bold'
  }
})(Button)

export default class LogicVisualization extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Name: '',
      length: 2,
      labels: ['Off', 'On'],
      force: [0, 0],
      status: [1, 0],
      display: [],
      classe: 'LogicVisualization'
    }
    this.isActive = this.isActive.bind(this)
  }

  isActive = (index) => {
    return this.state.status[index]
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
            disableFocusRipple={true}
            disableRipple={true}
          >
            {
              this.state.labels.map((item, index) =>{
                var active = this.isActive(index)
                return (
                  active ? (
                    <CSSButtonActive
                      key={item}
                      color='primary'
                    >
                      {item}
                    </CSSButtonActive>
                  ) : ( 
                    <CSSButton
                      key={item}
                    >
                      {item}
                    </CSSButton>
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