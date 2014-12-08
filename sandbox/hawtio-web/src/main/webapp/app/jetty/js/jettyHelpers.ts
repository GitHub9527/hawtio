/**
 * @module Jetty
 */
module Jetty {

  export function iconClass(state:string) {
    if (state) {
      switch (state.toString().toLowerCase()) {
        case 'started':
          return "green icon-play-circle";
        case 'true':
          return "green icon-play-circle";
      }
    }
    return "orange icon-off";
  }

  /**
   * Returns true if the state of the item begins with the given state - or one of the given states
   * @method isState
   * @for Jetty
   * @param {any} item the item which has a State
   * @param {any} state a value or an array of states
   * @return {Boolean}
   */
  export function isState(item, state) {
    var value = (item.state || "").toLowerCase();
    if (angular.isArray(state)) {
      return state.any((stateText) => value.startsWith(stateText));
    } else {
      return value.startsWith(state);
    }
  }
}
