function counter(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}

// const { createStore } = Redux;

const createStore = (reducer) => {
    let state;
    let listeners = [];

    const getState = () => state;

    const dispatch = (action) => {
        state = reducer(state, action);
        listeners.forEach(listener => listener());
    };

    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(lst => lst !== listener);
        };
    };

    dispatch({});

    return {
        getState, dispatch, subscribe
    };
};

const store = createStore(counter);

const render = () => {
    document.body.innerHTML = store.getState();
}

render();

store.subscribe(() => {
    render();
});

document.addEventListener('click', () => {
    store.dispatch({type: 'INCREMENT'});
});
