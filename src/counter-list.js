function CounterListApp() {

    const addCounter = (list) => {
        return [...list, 0];
    };

    const removeCounter = (list, index) => {
        return [
            ...list.slice(0, index),
            ...list.slice(index + 1)
        ];
    };

    const incrementCounter = (list, index) => {
        return [
            ...list.slice(0, index),
            list[index] + 1,
            ...list.slice(index + 1)
        ];
    };

    const decrementCounter = (list, index) => {
        return [
            ...list.slice(0, index),
            list[index] - 1,
            ...list.slice(index + 1)
        ];
    };

    const counterList = (state = [], action) => {
        switch (action.type) {
            case 'ADD_COUNTER':
                return addCounter(state);
            case 'REMOVE_COUNTER':
                if(!state.length) return state;
                return removeCounter(state, state.length - 1);
            case 'INCREMENT':
                return incrementCounter(state, action.index);
            case 'DECREMENT':
                return decrementCounter(state, action.index);
            default:
                return state;
        }
    }

    const { createStore } = Redux;
    const store = createStore(counterList);

    const Counter = ({
        index,
        value,
        onIncrement,
        onDecrement
    }) => (
        <p>
            <button onClick={onIncrement}>+</button>
            &nbsp;&nbsp;
            <button onClick={onDecrement}>-</button>
            &nbsp;&nbsp;
            <span>{value}</span>
        </p>
    );

    const CounterList = ({
        value,
        onAddCounter,
        onRemoveCounter
    }) => (
        <div>
            <button onClick={onAddCounter}>Add Counter</button>
            &nbsp;&nbsp;
            <button onClick={onRemoveCounter}>Remove Counter</button>
            <h2>Counter Number: {store.getState().length}</h2>
            <div>
                {value.map((counter, id) =>
                    <Counter
                        key={id}
                        index={id}
                        value={counter}
                        onIncrement={() => store.dispatch({type: 'INCREMENT', index: id})}
                        onDecrement={() => store.dispatch({type: 'DECREMENT', index: id})}>
                    </Counter>
                )}
            </div>
        </div>
    );

    const render = () => {
        ReactDOM.render(
            <CounterList
                value={store.getState()}
                onAddCounter={() => store.dispatch({type: 'ADD_COUNTER'})}
                onRemoveCounter={() => store.dispatch({type: 'REMOVE_COUNTER'})}>
            </CounterList>,
            document.getElementById('root')
        );
    };

    render();
    store.subscribe(render);

/****
    const testStore = () => {
        store.dispatch({type:'ADD_COUNTER'});
        expect(
            store.getState()
        ).toEqual([0]);

        store.dispatch({type:'ADD_COUNTER'});
        expect(
            store.getState()
        ).toEqual([0, 0]);

        store.dispatch({type:'INCREMENT', index: 0});
        expect(
            store.getState()
        ).toEqual([1, 0]);

        store.dispatch({type:'INCREMENT', index: 1});
        expect(
            store.getState()
        ).toEqual([1, 1]);

        store.dispatch({type:'DECREMENT', index: 0});
        expect(
            store.getState()
        ).toEqual([0, 1]);

        store.dispatch({type:'DECREMENT', index: 1});
        expect(
            store.getState()
        ).toEqual([0, 0]);

        store.dispatch({type:'REMOVE_COUNTER'});
        expect(
            store.getState()
        ).toEqual([0]);

        store.dispatch({type:'REMOVE_COUNTER'});
        expect(
            store.getState()
        ).toEqual([]);

        store.dispatch({type:'REMOVE_COUNTER'});
        expect(
            store.getState()
        ).toEqual([]);

        console.log('All tests passed.');
    };

    testStore();
****/
}
