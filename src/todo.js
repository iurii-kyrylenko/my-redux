function TodoApp () {

    const { combineReducers } = Redux;
    const { createStore } = Redux;
    const { Component } = React;
    const { Provider } = ReactRedux;
    const { connect } = ReactRedux;

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

    const todoApp = combineReducers({
        todos,
        visibilityFilter
    });

    let nextTodId = 0;
    const addTodo = (text) => {
        return {
            type: 'ADD_TODO',
            id: nextTodId++,
            text
        };
    };

    const toggleTodo = (id) => {
        return {
            type: 'TOGGLE_TODO',
            id
        };
    };

    const setVisibilityFilter = (filter) => {
        return {
            type: 'SET_VISIBILITY_FILTER',
            filter
        };
    };

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

    const Link = ({
        onClick,
        active,
        children
    }) => {
        if(active) {
            return <span>{children}</span>;
        }

        return (
            <a href='#'
                onClick={(e) => {
                    e.preventDefault();
                    onClick();
                }}
            >
                {children}
            </a>
        );
    };

    const MapStateToLinkParams = (
        state,
        ownProps
    ) => {
        return {
            active: state.visibilityFilter === ownProps.filter
        };
    };
    const MapDispatchToLinkParams = (
        dispatch,
        ownProps
    ) => {
        return {
            onClick: () => {
                dispatch(
                    setVisibilityFilter(ownProps.filter)
                )
            }
        };
    };
    const FilterLink = connect(
        MapStateToLinkParams,
        MapDispatchToLinkParams
    )(Link);

    const Header = () => (
        <p>
            Show:
            {' | '}
            <FilterLink
                filter='SHOW_ALL'
            >
                All
            </FilterLink>
            {' | '}
            <FilterLink
                filter='SHOW_ACTIVE'
            >
                Active
            </FilterLink>
            {' | '}
            <FilterLink
                filter='SHOW_COMPLETED'
            >
                Completed
            </FilterLink>
        </p>
    );

    let AddTodo = ({dispatch}) => {
        let input;
        return (
            <div>
                <input ref = {node => input = node} />
                {' '}
                <button
                    onClick= {() => {
                        const text = input.value.trim();
                        input.value = '';
                        if(!text) return;

                        dispatch(addTodo(text));
                    }}
                >Add Todo
                </button>
            </div>
        );
    };

    AddTodo = connect()(AddTodo);

    const Todo = ({
        onClick,
        completed,
        text
    }) => (
        <li
            onClick={onClick}
            style={{
                textDecoration: completed
                    ? 'line-through'
                    : 'none'
            }}
        >{text}
        </li>
    );

    const TodoList = ({
        todos,
        onTodoClick
    }) => (
        <ul>
            {todos.map(todo =>
                <Todo
                    key={todo.id}
                    {...todo}
                    onClick={() => onTodoClick(todo.id)}
                ></Todo>
            )}
        </ul>
    );

    const mapStateToTodoListProps = (
        state
    ) => {
        return {
            todos: getVisibleTodos(
                state.todos,
                state.visibilityFilter
            )
        };
    };
    const mapDispatchToTodoListProps = (
        dispatch
    ) => {
        return {
            onTodoClick: (id) => {
                dispatch(toggleTodo(id))
            }
        };
    };
    const VisibleTodoList = connect(
        mapStateToTodoListProps,
        mapDispatchToTodoListProps
    )(TodoList);

    const TodoApp = () => (
        <div>
            <Header />
            <AddTodo />
            <VisibleTodoList />
        </div>
    );

    ReactDOM.render(
        <Provider store={createStore(todoApp)}>
            <TodoApp />
        </Provider>,
        document.getElementById('root')
    );

}
