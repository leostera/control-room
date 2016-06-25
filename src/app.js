//@flow

/*******************************************************************************
 * Utils!
 *******************************************************************************/

const log = console.log.bind(console)

let __uuid_counter=0
let uuid = (key) => {
  __uuid_counter += 1
  return `${key}/${Date.now()}/${__uuid_counter}`
}

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

const Spinner = React.createClass({
  render() {
    return ( <span> {this.props.text}... </span> )
  }
})

const Event = React.createClass({
  render() {
    let e = JSON.stringify(this.props.event, null, '  ')
    return ( <pre> {e} </pre> )
  }
})

const Events = React.createClass({
  render() {
    let events = false

    if( this.props.events.length > 0 ) {
      events = this.props.events
        .map( e => (<Event key={e._key} event={e} />) )
        .reverse()
    }

    return (
      <section id="events">
        <h2> Events </h2>
        { events || <Spinner text="Waiting for events" /> }
      </section>
    )
  }
})

const ControlRoomApp = React.createClass({
  render() {
    return (
      <section>
        <NavBar />
        <Events {...this.props} />
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
import 'rxjs/add/operator/bufferCount'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/scan'

const URI = "ws://localhost:8080/websocket"

let socket = Observable.webSocket(URI)

let addUUID = (e) => Object.assign(e, {
  _key: uuid('event')
})

let render = (events) => {
  ReactDOM.render( (
    <ControlRoomApp events={events} />
  ), document.getElementById("controlroom"))
}

Observable
  .from(socket)
  .map(addUUID)
  .bufferCount(5)
  .scan( (acc, events) => acc.concat(events) )
  .subscribe(render)

render([])
