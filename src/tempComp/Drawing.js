import React from "react";

export default class Drawing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps !== prevState) {
      return nextProps;
    }
    return null;
  }

  render() {
    return (
      <svg width="600" height="800">
        <g transform="translate(300,400) scale(0.3,-0.3)">
          <circle
            cx={this.state.xb1}
            cy={this.state.yb1}
            r={this.state.rb1}
            fill="#4169E1"
          />
          <circle
            cx={this.state.xb2}
            cy={this.state.yb2}
            r={this.state.rb2}
            fill="#2ECC40"
          />
          <line
            x1={this.state.xb1}
            y1={this.state.yb1}
            x2={this.state.xs}
            y2={this.state.ys}
            stroke="Black"
            strokeWidth="5"
          />
          <line
            x1={this.state.xb2}
            y1={this.state.yb2}
            x2={this.state.xs}
            y2={this.state.ys}
            stroke="Black"
            strokeWidth="5"
          />
          <circle cx={this.state.xf} cy={this.state.yf} r={20} fill="Tomato" />
          <line
            x1={this.state.xs}
            y1={this.state.ys}
            x2={this.state.xf}
            y2={this.state.yf}
            stroke="Black"
            strokeWidth="5"
          />
          <line
            x1={-355.0704155516199}
            y1={204.99999999999997}
            x2={this.state.xs}
            y2={this.state.ys}
            stroke="Red"
            strokeWidth="10"
          />
        </g>
      </svg>
    );
  }
}