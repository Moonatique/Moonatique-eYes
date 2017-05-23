import {div} from '@cycle/dom'
import xs from 'xstream'
import MouseFollower from './MouseFollower'


function intent(domSource) {
  return {
    mousePos$: domSource.select('document').events('mousemove')
      .map(ev => ({x: ev.screenX, y: ev.screenY}))
  }
}

function model(actions) {
  return actions.mousePos$
    .map(({x, y}) => ({mouseX: x, mouseY: y}))
    .startWith({mouseX: 0, mouseY: 0})
}

function view(mouseFollowerDOM) {
  return mouseFollowerDOM
    .map((mouseFollowerVTree) =>
      div({style: {
        padding: '5px',
        backgroundColor: 'red'
      }}, [
        mouseFollowerVTree
      ])
    )
}

export function App (sources) {
  const mouseFollower = MouseFollower(sources);
  const vtree$ = view(mouseFollower.DOM)
  const sinks = {
    DOM: vtree$
  }
  return sinks
}
