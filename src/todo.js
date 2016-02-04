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
        onClick,
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
                    onClick(filter);
                }}
            >{children}
            </a>
        );
    };

    const Header = ({
        visibilityFilter,
        onFilterClick
    }) => (
        <p>
            Show:
            {' | '}
            <FilterLink
                onClick={onFilterClick}
                filter='SHOW_ALL'
                currentFilter={visibilityFilter}
                children='All'>
            </FilterLink>
            {' | '}
            <FilterLink
                onClick={onFilterClick}
                filter='SHOW_ACTIVE'
                currentFilter={visibilityFilter}
                children='Active'>
            </FilterLink>
            {' | '}
            <FilterLink
                onClick={onFilterClick}
                filter='SHOW_COMPLETED'
                currentFilter={visibilityFilter}
                children='Completed'>
            </FilterLink>
        </p>
    );

    const AddTodo = ({
        onAddTodo
    }) => {
        let input;
        return (
            <div>
                <input ref = {node => input = node} />
                {' '}
                <button
                    onClick= {() => {
                        const text = input.value.trim();
                        if(text) onAddTodo(text);
                        input.value = '';
                    }}
                >Add Todo
                </button>
            </div>
        );
    };

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

    let nextTodId = 0;

    const TodoApp = ({
        todos,
        visibilityFilter
    }) => (
        <div>
            <Header
                visibilityFilter={visibilityFilter}
                onFilterClick={filter =>
                    store.dispatch({
                        type: 'SET_VISIBILITY_FILTER',
                        filter
                    })
                }
            ></Header>
            <AddTodo
                onAddTodo={text =>
                    store.dispatch({
                        type: 'ADD_TODO',
                        id: nextTodId++,
                        text
                    })
                }
            ></AddTodo>
            <TodoList
                todos={getVisibleTodos(todos, visibilityFilter)}
                onTodoClick={id =>
                    store.dispatch({
                        type: 'TOGGLE_TODO',
                        id
                    })
                }
            ></TodoList>
        </div>
    );

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
