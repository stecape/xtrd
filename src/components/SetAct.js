import React, { Component } from 'react'
import Container from './Container'
import SetContent from './SetContent'
import ActContent from './ActContent'

export default class SetAct extends Component {
  constructor(props) {
    super(props)
    this.state = { }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.tag && (props.tag.Name !== state.Name)) {
      return { 
        Name: props.tag.Name
      }
    }
    return {}
  }
  render() {
    return (
      <Container {...this.props} >
                <SetContent {...this.props} />
                <ActContent {...this.props} />
      </Container>
    )
  }
}