qs = {
  getW: () => {
    try {
      const w = global;
      return w;
    } catch (e) {
      return window;
    }
  },
  init: (initialState) => {
    const w = qs.getW();
    w.quantum = { state: Object.assign({}, initialState) };
    const wqs = w.quantum.state;
    for (let i in wqs) {
      wqs[i].$subscribers = [];
      wqs[i].$connections = [];
    }
  },
  subscribe: (key, element, onChange, onSubscribe) => {
    const w = qs.getW();
    const wqs = w.quantum.state;
    if (wqs.hasOwnProperty(key)) {
      element.quantum = wqs[key].$subscribers.length;
      wqs[key].$subscribers.push({ element: element, onchange: onChange });
    }
    if (onSubscribe)
      onSubscribe(element, wqs[key]);
  },
  connect: (key, component, mapState) => {
    const w = qs.getW();
    const wqs = w.quantum.state;
    if (wqs.hasOwnProperty(key)) {
      wqs[key].$connections.push({ component: component, mapState: mapState });
    }
  },
  disconnect: (key, component) => {
    const w = qs.getW();
    const wqs = w.quantum.state;
    if (wqs.hasOwnProperty(key)) {
      wqs[key].$connections.splice(wqs[key].$connections.findIndex(item => item.component === component), 1);
    }
  },
  unsubscribe: (key, element) => {
    const w = qs.getW();
    const wqs = w.quantum.state;
    if (wqs.hasOwnProperty(key) && wqs[key].$subscribers.length > 0) {
      const indexOf = wqs[key].$subscribers.findIndex((e) => e.element.quantum === element.quantum);
      wqs[key].$subscribers.splice(indexOf, 1);
    }
  },
  get: (key) => {
    const w = qs.getW();
    const wqs = w.quantum.state;
    if (wqs.hasOwnProperty(key))
      return wqs[key];
    return null;
  },
  set: (key, newState) => {
    const w = qs.getW();
    const wqs = w.quantum.state;
    if (wqs.hasOwnProperty(key)) {
      wqs[key] = Object.assign(wqs[key], newState);
      if (wqs[key].$subscribers.length > 0) {
        for (let i in wqs[key].$subscribers) {
          wqs[key].$subscribers[i].onchange(
            wqs[key].$subscribers[i].element,
            wqs[key]);
        }
      }
      if (wqs[key].$connections.length > 0) {
        for (let i in wqs[key].$connections) {
          const component = wqs[key].$connections[i].component;
          component.setState(wqs[key].$connections[i].mapState(wqs[key]));
        }
      }
    }
  },
  log: (key) => {
    const w = qs.getW();
    if (w.quantum.state.hasOwnProperty(key))
      console.log(w.quantum.state[key]);
  }
};
