export default {
  patchState: (initialState) => {
    const cachedState = JSON.parse(localStorage.getItem('state'));
    if (!cachedState) return initialState;

    let restoredState = {...initialState};
    for (let prop in cachedState) {
      if (restoredState.hasOwnProperty(prop)) {
        restoredState[prop] = cachedState[prop];
      }
    }

    localStorage.setItem('state', JSON.stringify(restoredState));
    return restoredState;
  },

  enableHotExit: (store) => {
    store.subscribe(() => {
      localStorage.setItem('state', JSON.stringify(store.getState()));
    });
  },

  clear: () => {
    localStorage.clear();
  }
};