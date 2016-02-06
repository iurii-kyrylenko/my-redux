function TodoApp () {

    const { combineReducers } = Redux;
    const { createStore } = Redux;
    const { Component } = React;

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

    class FilterLink extends Component {
        componentDidMount() {
            const {store} = this.props;
            this.unsubscribe = store.subscribe(() =>
                this.forceUpdate()
            );
        }

        componentWillUnmount() {
            this.unsubscribe();
        }

        render() {
            const {store} = this.props;
            const props = this.props;
            const state = store.getState();

            return (
                <Link
                    active={state.visibilityFilter === props.filter}
                    onClick={() =>
                        store.dispatch({
                            type: 'SET_VISIBILITY_FILTER',
                            filter: props.filter
                        })
                    }
                >
                    {props.children}
                </Link>
            );
        }
    }

    const Header = ({store}) => (
        <p>
            Show:
            {' | '}
            <FilterLink
                store={store}
                filter='SHOW_ALL'
            >
                All
            </FilterLink>
            {' | '}
            <FilterLink
                store={store}
                filter='SHOW_ACTIVE'
            >
                Active
            </FilterLink>
            {' | '}
            <FilterLink
                store={store}
                filter='SHOW_COMPLETED'
            >
                Completed
            </FilterLink>
        </p>
    );

    let nextTodId = 0;

    const AddTodo = ({store}) => {
        let input;
        return (
            <div>
                <input ref = {node => input = node} />
                {' '}
                <button
                    onClick= {() => {
                        const text = input.value.trim();
                        if(text) {
                            store.dispatch({
                                type: 'ADD_TODO',
                                id: nextTodId++,
                                text
                            });
                        }
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

    class VisibleTodoList extends Component {
        componentDidMount() {
            const {store} = this.props;
            this.unsubscribe = store.subscribe(() =>
                this.forceUpdate()
            );
        }

        componentWillUnmount() {
            this.unsubscribe();
        }

        render() {
            const {store} = this.props;
            const state = store.getState();
            return (
                <TodoList
                    todos={
                        getVisibleTodos(state.todos, state.visibilityFilter)
                    }
                    onTodoClick={id =>
                        store.dispatch({
                            type: 'TOGGLE_TODO',
                            id
                        })
                    }
                >
                </TodoList>
            );
        }
    }

    const TodoApp = ({store}) => (
        <div>
            <Header store={store} />
            <AddTodo store={store} />
            <VisibleTodoList store={store} />
        </div>
    );

    ReactDOM.render(
        <TodoApp store={createStore(todoApp)} />,
        document.getElementById('root')
    );

}
