//@flow

import React from 'react'
import ReactDOM from 'react-dom'

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/dom/webSocket'
import 'rxjs/add/observable/from'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/filter'

const URI = "ws://localhost:8080/websocket"

let socket = Observable.webSocket(URI)

let save = (event) => {
  localStorage.setItem("controlroom.last_event", JSON.stringify(event))
  localStorage.setItem("controlroom.events", JSON.stringify(events))
}

Observable.from(socket).do(save).subscribe()

let bind = (event, callback) => {
  Observable
    .from(socket)
    .filter( e => e.event === event )
    .subscribe(callback)
}

bind("queue_push", console.log.bind(console, "QUEUE_PUSH:"))
bind("queue_consumer_stopped", console.log.bind(console, "QUEUE_CONSUMER_STOPPED:"))
