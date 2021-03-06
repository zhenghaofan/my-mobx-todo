import React from 'react'
import { List, Tag, Tabs } from 'antd'
import moment from 'moment'
import '../common/right.css'
import {observable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'
import SingleTodo from './SingleTodo'

const TabPane = Tabs.TabPane
@inject('todoStore')
@inject('dateStore')
@inject('tabsKeyStore')
@observer
export default class Right extends React.Component {
  // @observable activeKey
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log(this.props.tabsKeyStore.activeKey);
  }

  @computed get dateString() {
    return moment(this.props.dateStore.newDate).format('YYYY/MM/DD')
  }

  @computed get allTodos() {
    let index = this.props.todoStore.todoList.map((item)=>item.date).indexOf(this.dateString)
      if (index < 0) {
        return [];
      } else {
        return this.props.todoStore.todoList[index].todos;
    }
  }

  @computed get targetTodos() {
    return this.allTodos.filter(item => item.status === this.props.tabsKeyStore.activeKey)
  }

  getTodos(status) {
    this.props.tabsKeyStore.setActiveKey(status);
  }

  deleteTodo(item) {
    this.props.todoStore.deleteTodo(this.dateString, item)
  }

  completeTodo(item, status) {
    this.props.todoStore.completeTodo(this.dateString, item, status)
  }

  render() {
    return (
      <div className="right-container">
        <h3>{this.dateString} Todolist:</h3>
          <Tabs defaultActiveKey="non_complete" ref="tabs" activeKey={this.props.tabsKeyStore.activeKey} onChange={this.getTodos.bind(this)}>
          <TabPane tab="要干" key="non_complete">
            <List>
                  {
                    this.targetTodos.length > 0 ? this.targetTodos.map((item, index) => {
                      return (
                        <div className="single-todo" key={item.content}>
                          <SingleTodo
                            index={index+1}
                            deleteTodo={this.deleteTodo.bind(this, item.content)}
                            completeTodo={this.completeTodo.bind(this, item.content, 'complete')}
                            content={item.content}
                            buttonText="mark as complete">
                          </SingleTodo>
                        </div>
                      )
                    }) : <div className="no-list">暂无todo</div>
                  }
            </List>
          </TabPane>
          <TabPane tab="干完了" key="complete">
            <List>
                  {
                    this.targetTodos.length > 0 ? this.targetTodos.map((item, index) => {
                      return (
                        <div className="single-todo" key={item.content}>
                          <SingleTodo
                            index={index+1}
                            deleteTodo={this.deleteTodo.bind(this, item.content)}
                            completeTodo={this.completeTodo.bind(this, item.content, 'non_complete')}
                            content={item.content}
                            buttonText="mark as non-complete">
                          </SingleTodo>
                        </div>
                      )
                    }) : <div className="no-list">暂无todo</div>
                  }
            </List>
          </TabPane>
          <TabPane tab="全部" key="">
            <List>
                  {
                    this.allTodos.length > 0 ? this.allTodos.map((item, index) => {
                      return (
                        <div className="single-todo" key={item.content}>
                          {index+1}.<Tag closable onClose={this.deleteTodo.bind(this, item.content)}><span>{item.content}</span></Tag>
                        {item.status === 'non_complete' ? (<Tag color="#f50" className="f-r">non-complete</Tag>) : (<Tag color="#87d068" className="f-r">complete</Tag>)}
                        </div>
                      )
                    }) : <div className="no-list">暂无todo</div>
                  }
            </List>
          </TabPane>
          </Tabs>
      </div>
    )
  }
}
