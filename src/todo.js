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

    const getVisibleTodos = (todos, filter) => {
        switch(filter) {
            case 'SHOW_ALL':
                return todos;
            case 'SHOW_ACTIVE':
                return todos.filter(todo => !todo.completed);
            case 'SHOW_COMPLETED':
                return todos.filter(todo => todo.completed);
        }
    };

    const FilterLink = ({
        filter,
        currentFilter,
        children
    }) => {
        if(currentFilter === filter) {
            return <span>{children}</span>;
        }

        return (
            <a href='#'
                onClick={(e) => {
                    e.preventDefault();
                    store.dispatch({
                        type: 'SET_VISIBILITY_FILTER',
                        filter
                    });
                }}
            >{children}
            </a>
        );
    };

    const { Component } = React;
    let nextTodId = 0;
    class TodoApp extends Component {
        render() {
            const { todos, visibilityFilter } = this.props;
            const visibleTodos = getVisibleTodos(todos, visibilityFilter);
            return (
                <div>
                    <p>
                        Show:
                        {' | '}
                        <FilterLink
                            filter='SHOW_ALL'
                            currentFilter={visibilityFilter}
                            children='All'>
                        </FilterLink>
                        {' | '}
                        <FilterLink
                            filter='SHOW_ACTIVE'
                            currentFilter={visibilityFilter}
                            children='Active'>
                        </FilterLink>
                        {' | '}
                        <FilterLink
                            filter='SHOW_COMPLETED'
                            currentFilter={visibilityFilter}
                            children='Completed'>
                        </FilterLink>
                    </p>
                    <input ref= {node =>
                        this.input = node
                    } />
                    {' '}
                    <button onClick= {
                        () => {
                            const todo = this.input.value.trim();
                            this.input.value = '';
                            if(!todo) return;
                            store.dispatch({
                                type: 'ADD_TODO',
                                id: nextTodId++,
                                text: todo
                            });
                        }
                    }>Add Todo
                    </button>
                    <ul>
                        {visibleTodos.map(todo =>
                            <li key={todo.id}
                                onClick={() =>
                                    store.dispatch({
                                        type: 'TOGGLE_TODO',
                                        id: todo.id
                                    })
                                }
                                style={{
                                    textDecoration: todo.completed
                                        ? 'line-through'
                                        : 'none'
                                }}
                            >{todo.text}
                            </li>
                        )}
                    </ul>
                </div>
            );
        }
    }

    const render = () => {
        ReactDOM.render(
            <TodoApp
                {...store.getState()}
            >
            </TodoApp>,
            document.getElementById('root')
        );
    };

    store.subscribe(render);
    render();

}
