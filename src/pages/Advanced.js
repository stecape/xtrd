import React, { Component } from 'react'
import Page from '../components/Page'
import Drawing from '../tempComp/Drawing'
import { ricalcolo } from '../tempComp/ricalcolo.js'
import Actual from "../components/Act"
import Grid from '@material-ui/core/Grid'

export default class Advanced extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //Stella
      zp: 45,
      as: 0,
      rs: 410,
      al: 1,
      dc: 0,

      //Fotocellula
      af: 90,
      rf: 524.956,
      sf: 0,

      //Bobina 1
      rb1: 111,
      db1: 222,
      xb1: 0,
      yb1: 0,

      //Bobina 2
      rb2: 55,
      db2: 110,
      xb2: 0,
      yb2: 0,

      //Dati supplementari per disegno
      drawing: {
        xs: 0,
        ys: 0,
        xf: 0,
        yf: 0,
        zp: 0,
        as: 0,
        rs: 0,
        af: 0,
        rf: 0,
        sf: 0,
        xb1: 0,
        yb1: 0,
        rb1: 0,
        xb2: 0,
        yb2: 0,
        rb2: 0
      }
    };
    this.handleChange = this.handleChange.bind(this)
    this.returnValue = this.returnValue.bind(this)
  }

  componentDidMount() {
    this.setState(ricalcolo(this.state))
  }

  handleChange(k, v) {
    var ob = {};
    ob[k] = v;
    this.setState(ob, () => {
      this.setState(ricalcolo(this.state))
    })
  }

  returnValue(key, value){
    this.setState({[key]: value})
    this.setState(ricalcolo(this.state))
  }

  mapping={
    Real_0: "zp",
    Real_1: "as",
    Real_2: "rs",
    Int_0: "al",
    Int_1: "dc",
    Real_3: "af",
    Real_4: "rf",
    Int_2: "sf"
  }
/*   mapping={
    zp: "Real_0",
    as: "Real_1",
    rs: "Real_2",
    al: "Int_0",
    dc: "Int_1",
    af: "Real_3",
    rf: "Real_4",
    sf: "Int_2",
    rb1: "Real_5",
    db1: "Real_6",
    rb2: "Real_7",
    db2: "Real_8"    
  } */



  render() {
    var as = {
      Name: 'Angolo stella',
      conversion: {
        HMIunit: '°',
        HMIDecimals: 2,
      },
      limits: {
        HMIMin: 0,
        HMIMax: 360
      },
      actual: {
        HMIVal: this.state.as
      },
      classe: 'Act'
    }

    return (
      <div>
        <Page
          call="/api/getUNWData"
          title="Unwinder splice sequence"
          returnValue= {this.returnValue}
          mapping= {this.mapping}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <Grid container spacing={1} direction="column" alignItems="stretch">
                <Actual tag={as} />
              </Grid>
            </Grid>
          </Grid>
          <Drawing {...this.state.drawing} />
        </Page>
      </div>
    )
  }
}