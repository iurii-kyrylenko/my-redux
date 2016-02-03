function TodoApp () {

    const todos = (state = [], action) => {
        switch(action.type) {
            case 'ADD_TODO':
                return [
                    ...state,
                    {
                        id: action.id,
                        text: action.text,
                        completed: false
                    }
                ];
            case 'TOGGLE_TODO':
                return state.map((todo) => {
                    if(action.id !== todo.id) {
                        return todo;
                    }
                    return {
                        ...todo,
                        completed: !todo.completed
                    };
                });
            default:
                return state;
        }
    };

    const testAddTodo = () => {
        const action = {
            type: 'ADD_TODO',
            id: 0,
            text: 'Learn Redux'
        };
        const stateBefore = [];
        const stateAfter = [{
            id: 0,
            text: 'Learn Redux',
            completed: false
        }];

        deepFreeze(action);
        deepFreeze(stateBefore);

        expect(
            todos(stateBefore, action)
        ).toEqual(stateAfter);
    }

    const testToggleTodo = () => {
        const action = {
            type: 'TOGGLE_TODO',
            id: 1
        };
        const stateBefore = [{
            id: 0,
            text: 'Learn Redux',
            completed: false
        }, {
            id: 1,
            text: 'Watch Santa Barbara',
            completed: false
        }];
        const stateAfter = [{
            id: 0,
            text: 'Learn Redux',
            completed: false
        }, {
            id: 1,
            text: 'Watch Santa Barbara',
            completed: true
        }];

        deepFreeze(action);
        deepFreeze(stateBefore);

        expect(
            todos(stateBefore, action)
        ).toEqual(stateAfter);
    }

    testAddTodo();
    testToggleTodo();
    console.log('All tests passed.');
}
