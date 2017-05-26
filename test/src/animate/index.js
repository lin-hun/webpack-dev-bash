import React from 'react';
import ReactDOM from 'react-dom';

window.React = React
window.ReactDOM = ReactDOM

class HelloMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {test: 'miao'};
    console.log(this.props)
  }
  componentWillMount() {
    let me = this
    console.log('willmount')
    // setTimeout(()=>{
    //   me.setState({test:'hahahahha'})
    // },1500)
  }

  componentDidMount() {
    let me = this
    console.log('didmount')
  }
  componentWillReceiveProps(){
    console.log('receiveprops')
  }
  shouldComponentUpdate(){
    console.log('shouldupdate')
    return true

  }
  componentWillUpdate(){
    console.log('willupdate')
  }
  render() {
    console.log('render')
    return <div>con: {this.props.name}</div>;
  }
  componentDidUpdate(){
    console.log('didupdate')
  }
}

class Test extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      name:'jane'
    }
  }
  componentDidMount(){
    let me = this
    setTimeout(()=>{
      me.setState({name:'hahhaha'})
    },1000)
  }
  render(){
    return (<HelloMessage name={this.state.name} />)
  }
}
ReactDOM.render(<Test />, document.getElementById('root'));