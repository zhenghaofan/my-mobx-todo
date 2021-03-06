import React from 'react';
import ReactDOM from 'react-dom'
import {Tag, Button} from 'antd'
import Parabola from '../third-party/parabola'
import { inject } from 'mobx-react'

@inject('flyStore')
export default class SingleTodo extends React.Component {
  constructor(props) {
    super(props);
    this.options = {
      curvature: 0.003,
      speed: 120,
      complete: this.completeFly.bind(this)
    }
    this.state = {
      flyComplete: false
    }
  }

  completeFly() {
    this.setState({
      flyComplete: true
    })
    this.props.flyStore.resetNeedFly()
    this.props.flyStore.removeEl()
  }

  componentDidMount() {
    if (this.props.flyStore.needFly) {
      this.fly()
    } else {
      this.setState({
        flyComplete: true
      })
    }
  }

  fly() {
    this.parabola = new Parabola(this.props.flyStore.originEl, ReactDOM.findDOMNode(this.targetTag), this.options)
    // console.log(ReactDOM.findDOMNode(this.targetTag));
    this.parabola.run()
  }

  // componentWillUnmount() {
  //   this.parabola && this.parabola.stop()
  // }

  render() {
    return (
      <div className={this.state.flyComplete ? 'todo-show' : 'todo-hide'}>
        {this.props.index}.<Tag closable="closable" ref={(e) => this.targetTag = e} onClose={this.props.deleteTodo}>
          <span>{this.props.content}</span>
        </Tag>
        <Button type="primary" size="small" className="f-r" onClick={this.props.completeTodo}>{this.props.buttonText}</Button>
      </div>
    );
  }
}
