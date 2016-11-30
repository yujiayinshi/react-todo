import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            todos: []
        };
        this.store = [];
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.delToDo = this.delToDo.bind(this);
        this.completeToDo = this.completeToDo.bind(this);
        this.updateToDo = this.updateToDo.bind(this);
        this.getToDos = this.getToDos.bind(this);
    }

    getToDos(complete) {
        this.complete = complete;
        if (typeof this.complete !== 'undefined') {
            const todos = this.store.filter(function(item) {
                return item.complete === complete
            });
            this.setState({todos: todos});
        } else {
            this.setState({todos: this.store});
        }
    }

    handleSubmit(event) {
        if (event && event.keyCode === 13) {
            event.preventDefault();
            const todos = this.state.todos;
            todos.push({
                id: new Date().getTime(),
                name: event.target.value,
                complete: false
            });
            this.setState({
                value: '',
                todos: todos
            });
            this.store = todos;
        }
    }

    handleChange(event) {
        this.setState({value: event.target.value})
    }

    delToDo(todo) {
        const todos = this.state.todos;
        if (todos.indexOf(todo) > -1) {
            todos.splice(todos.indexOf(todo), 1);
            this.setState(this.state);
        }
        if (typeof this.complete === 'undefined') {
            this.store = todos;
        }
    }

    completeToDo(todo) {
        const todos = this.state.todos;
        for (let i = 0, ii = todos.length; i < ii; i++) {
            if (todos[i].id === todo.id) {
                todos[i].complete = !todos[i].complete;
                break;
            }
        }
        this.setState(this.state);
        if (typeof this.complete === 'undefined') {
            this.store = todos;
        } else {
            this.getToDos(this.complete);
        }
    }

    updateToDo(todo) {
        const todos = this.state.todos;
        for (let i = 0, ii = todos.length; i < ii; i++) {
            if (todos[i].id === todo.id) {
                todos[i] = todo;
                break;
            }
        }
        this.setState(this.state);
        if (typeof this.complete === 'undefined') {
            this.store = todos;
        } else {
            this.getToDos(this.complete);
        }
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>

                    <h2>Welcome to React</h2>
                </div>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>

                <div>
                    START WITH REACT
                </div>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" value={this.state.value} onChange={this.handleChange}
                               onKeyDown={this.handleSubmit}/>
                    </form>
                </div>
                <ToDoList todos={this.state.todos} delToDo={this.delToDo} completeToDo={this.completeToDo} updateToDo={this.updateToDo} />
                <ToDoFooter count={this.state.todos.length} getToDos={this.getToDos} />
            </div>
        );
    }
}

class ToDoList extends Component {
    render() {
        return (
            <ul>
                {
                    this.props.todos.map((todo, index) =>
                        <ToDoItem key={todo.id} todo={todo} delToDo={this.props.delToDo} completeToDo={this.props.completeToDo} updateToDo={this.props.updateToDo} />
                    )
                }
            </ul>
        );
    }
}

class ToDoItem extends Component {

    constructor(props) {
        super(props);
        this.state = {editTodo: false, value: this.props.todo.name};
        this.handClick = this.handClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleChangeUpdate = this.handleChangeUpdate.bind(this);
        this.handleChange4Edit = this.handleChange4Edit.bind(this);
    }

    handClick() {
        this.props.delToDo(this.props.todo);
    }

    handleChange() {
        this.props.completeToDo(this.props.todo);
    }

    handleDoubleClick() {
        this.setState({
            editTodo: true
        });
    }

    handleBlur() {
        this.setState({
            editTodo: false
        })
    }

    handleChangeUpdate(event) {
        if (event && event.keyCode === 13) {
            this.setState({
                editTodo: false
            })
        }
    }

    handleChange4Edit(event) {
        this.props.todo.name = event.target.value;
        this.props.updateToDo(this.props.todo);
    }

    render() {
        return (
            <li className="list-item">
                <input type="checkbox" checked={this.props.todo.complete} value={this.props.todo.complete} onChange={this.handleChange} />
                <span onDoubleClick={this.handleDoubleClick} onBlur={this.handleBlur}>
                    {this.state.editTodo ?
                        (<input type="text" value={this.props.todo.name} onChange={this.handleChange4Edit} onKeyDown={this.handleChangeUpdate} autoFocus />) :
                        (<span className={this.props.todo.complete ? 'complete-todo' : 'active-todo'}>{this.props.todo.name}</span>)
                    }
                </span>
                <button onClick={this.handClick} className="del-button">x</button>
            </li>
        )
    }
}

class ToDoFooter extends Component {
    constructor(props) {
        super(props);
        this.getAllToDos = this.getAllToDos.bind(this);
        this.getActiveToDos = this.getActiveToDos.bind(this);
        this.getCompletedToDos = this.getCompletedToDos.bind(this);
    }

    getAllToDos() {
        this.props.getToDos();
        this.active = 'all';
    }

    getActiveToDos() {
        this.props.getToDos(false);
        this.active = 'active';
    }

    getCompletedToDos() {
        this.props.getToDos(true);
        this.active = 'completed';
    }

    render() {
        return (
            <div>
                共{this.props.count}条
                <button onClick={this.getAllToDos} className={this.active === 'all' ? 'active-button' : 'button'}>All</button>
                <button onClick={this.getActiveToDos} className={this.active === 'active' ? 'active-button' : 'button'}>Active</button>
                <button onClick={this.getCompletedToDos} className={this.active === 'completed' ? 'active-button' : 'button'}>Completed</button>
            </div>
        )
    }
}

export default App;
