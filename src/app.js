//@flow

/*******************************************************************************
 * Presentation!
 *******************************************************************************/

import React from 'react'
import ReactDOM from 'react-dom'

import Octocat from './Octocat'

const NavBar = React.createClass({
  render() {
    return (
      <nav>
        <a class="brand" />
        <Octocat path="ostera/control-room" />
      </nav>
    )
  }
})

const Event = React.createClass({
  render() {
    let e = this.props.event
    return (
      <section>
        <h4>{e.event}</h4>
      </section>
    )
  }
})

const Events = React.createClass({
  render() {
    console.log(this.props)
    // this.props.events.events._data[]
    let events = this.props.events.map( e => {
      (<li> <Event event={e} /> </li>)
    })

    return (
      <ul>
        { events }
      </ul>
    )
  }
})

const ControlRoomApp = React.createClass({
  render() {
    console.log(this.props)
    // this.props.events._data[]
    let events = this.props.events
    return (
      <section>
        <NavBar />
        <Events events={{events}} />
      </section>
    )
  }
})

/*******************************************************************************
 * Data!
 *******************************************************************************/

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/dom/webSocket'
import 'rxjs/add/observable/from'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/filter'

const URI = "ws://localhost:8080/websocket"

let socket = Observable.webSocket(URI)

let _data = []
let save = (event) => {
  _data.push(event)
  localStorage.setItem("controlroom.last_event", JSON.stringify(event))
}

let render = (event) => {
  ReactDOM.render( (
    <ControlRoomApp events={{_data}} />
  ), document.getElementById("controlroom"))
}

Observable
  .from(socket)
  .do(save)
  .subscribe(render)


/*
let bind = (event, callback) => {
  Observable
    .from(socket)
    .filter( e => e.event === event )
    .subscribe(callback)
}

bind("event_push", console.log.bind(console, "event_PUSH:"))
bind("event_consumer_stopped", console.log.bind(console, "event_CONSUMER_STOPPED:"))
*/
