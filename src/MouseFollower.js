import {div, span} from '@cycle/dom'
import isolate from '@cycle/isolate'
import xs from 'xstream'

function intent(domSource) {
  return {
    mousePos$: domSource.select('document').events('mousemove')
      .map(ev => ({x: ev.screenX, y: ev.screenY})),
    follower$: domSource.select('.mouseFollower').elements()
  };
}

function calculateFollowerPos(follower$) {
  return follower$
    .map(follower =>
      getElementPos(follower).reduce(([top, left]) => {
        return {top, left}
      })
    )
    .startWith({top: 0, left: 0});
}

function getElementPos(element) {
  const currentOffsets = [element.offsetTop, element.offsetLeft];
  return !element.offsetParent ?
    currentOffsets
    : getElementPos(element.offsetParent)
        .map((offset, index) => offset + currentOffsets[index]);
}

function model(actions) {
  const mousePos$ = actions.mousePos$
    .startWith({x: 0, y: 0});
  // const followerPos$ = calculateFollowerPos(actions.follower$);
  const followerPos$ = xs.of(1);
  return xs.combine(mousePos$, followerPos$)
    .map(([mousePos, followerPos]) => {
      return {
        mousePos: mousePos,
        followerPos: followerPos
      };
    });

  // return mousePos$.map((mousePos) => ({mousePos}))
}

function view(state$) {
  return state$
    .map(({mousePos}) =>
      div([
        div('.mouseFollower', {style: {
            backgroundColor: 'blue',
            color: 'yellow'
          },
        }, `posX ${mousePos.x}, posY ${mousePos.y}`),
        div({style: {
          width: '50px',
          height: '50px',
          backgroundColor: 'blue',
        }}, [
          div({style: {
            width: '30px',
            height: '30px',
            position: 'relative',
            top: '10px',
            left: '10px',
            backgroundColor: 'yellow',
            borderRadius: '50%'
          }})
        ])
      ])
    );
}

let MouseFollower = function (sources) {
  const change$ = intent(sources.DOM);
  const value$ = model(change$);
  const vtree$ = view(value$);
  return {
    DOM: vtree$
  };
};

let IsolatedMouseFollower = function (sources) {
  return isolate(MouseFollower)(sources);
};

export default IsolatedMouseFollower;
