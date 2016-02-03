function TodoApp () {

    const todo = (state = {}, action) => {
        switch(action.type) {
            case 'ADD_TODO':
                return {
                    id: action.id,
                    text: action.text,
                    completed: false
                };
            case 'TOGGLE_TODO':
                    if(action.id !== state.id) {
                        return state;
                    }
                    return {
                        ...state,
                        completed: !state.completed
                    };
            default:
                return state;
        }
    };

    const todos = (state = [], action) => {
        switch(action.type) {
            case 'ADD_TODO':
                return [
                    ...state,
                    todo(undefined, action)
                ];
            case 'TOGGLE_TODO':
                return state.map(t => todo(t, action));
            default:
                return state;
        }
    };

    const visibilityFilter = (state = 'SHOW_ALL', action) => {
        switch(action.type) {
            case 'SET_VISIBILITY_FILTER':
                return action.filter;
            default:
                return state;
        }
    };

    const { combineReducers } = Redux;

    const todoApp = combineReducers({
        todos,
        visibilityFilter
    });

    const { createStore } = Redux;
    const store = createStore(todoApp);

    const logState = () => {
        console.log(JSON.stringify(store.getState(), null, 2));
    };

    store.subscribe(logState);

    logState();

    store.dispatch({
        type: 'ADD_TODO',
        id: 0,
        text: 'Learn Redux'
    });

    store.dispatch({
        type: 'ADD_TODO',
        id: 1,
        text: 'Watch Santa Barbara'
    });

    store.dispatch({
        type: 'TOGGLE_TODO',
        id: 1
    });

    store.dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter: 'SHOW_COMPLETED'
    });

}
