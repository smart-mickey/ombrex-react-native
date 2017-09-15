import React, {Component} from 'react'
import {Router, Scene, ActionConst} from 'react-native-router-flux'
import {Provider, connect} from 'react-redux'
import { createStore, applyMiddleware, combineReducers, compose} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import reducer from './redux/reducers'
import Login from './screens/login.js'
import Forgot from './screens/forgot.js'
import Home from './screens/home.js'
import Setting from './screens/setting.js'
import About from './screens/about.js'


const RouterWithRedux = connect()(Router)
const {
  AppRegistry,
} = require('react-native')
// middleware that logs actions
const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__  });

function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(
      thunkMiddleware, // lets us dispatch() functions
      loggerMiddleware,
    ),
  );
  return createStore(reducer, initialState, enhancer);
}

const store = configureStore({});

class ombrex extends Component {
  render () {
    return (
        <Provider store={store}>
          <RouterWithRedux>
            <Scene key="root" hideNavBar panHandlers={null}>
                <Scene key='Login' component={Login} title='Login Page' hideNavBar={true}/>         
                <Scene key='Forgot' component={Forgot} title='Forgot Page' hideNavBar={true}/>   
                <Scene key='Home' component={Home} title='Home Page' hideNavBar={true}/>   
                <Scene key='Setting' component={Setting} title='Setting Page' hideNavBar={true}/>     
                <Scene key='About' component={About} title='About Page' hideNavBar={true}/>     
            </Scene>
          </RouterWithRedux>
        </Provider>
    )
  }
}

export default ombrex;