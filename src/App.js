import React, {Component} from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import wilddog from 'wilddog'
import logo from './todo.png';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        injectTapEventPlugin();
        this.state = {
            value: '',
            todos: []
        };
        const config = {
            syncURL: "https://ystodos.wilddogio.com/todos"
        };
        wilddog.initializeApp(config);
        this.ref = wilddog.sync().ref();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.delToDo = this.delToDo.bind(this);
        this.completeToDo = this.completeToDo.bind(this);
        this.updateToDo = this.updateToDo.bind(this);
        this.getToDos = this.getToDos.bind(this);
        this.getToDos();
    }

    getToDos(complete) {
        this.ref.on('value', (snapshot) => {
            let todos = snapshot.val();
            if (typeof complete !== 'undefined') {
                todos = {};
                for (let i in snapshot.val()) {
                    if (snapshot.val()[i].complete === complete) {
                        todos[i] = snapshot.val()[i];
                    }
                }
            }
            this.setState({todos: todos})
        })
    }

    handleSubmit(event) {
        if (event && event.keyCode === 13) {
            event.preventDefault();
            if (event.target.value && event.target.value.trim()) {
                this.ref.push({
                    name: event.target.value.trim(),
                    complete: false,
                    createTime: this.ref.ServerValue.TIMESTAMP
                });
                this.setState({value: ''});
            }
        }
    }

    handleChange(event) {
        this.setState({value: event.target.value})
    }

    delToDo(id) {
        wilddog.sync().ref(id).set(null);
    }

    completeToDo(id, todo) {
        todo.complete = !todo.complete;
        todo.updateTime = this.ref.ServerValue.TIMESTAMP;
        wilddog.sync().ref(id).update(todo);
    }

    updateToDo(id, todo) {
        wilddog.sync().ref(id).update(todo);
    }

    render() {
        return (
            <MuiThemeProvider>
                <div className="App">
                    <div className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>

                        <h2>What to Do ?</h2>
                    </div>
                    <p className="App-intro">
                        Record what you want to do and make evey day wonderful !
                    </p>
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <TextField
                                name="newTodo"
                                hintText="what to do ?"
                                value={this.state.value}
                                onChange={this.handleChange}
                                onKeyDown={this.handleSubmit}
                            />
                        </form>
                    </div>
                    <ToDoList todos={this.state.todos} delToDo={this.delToDo} completeToDo={this.completeToDo}
                              updateToDo={this.updateToDo}/>
                    <ToDoFooter count={Object.keys(this.state.todos).length} getToDos={this.getToDos}/>
                </div>
            </MuiThemeProvider>
        );
    }
}

class ToDoList extends Component {
    render() {
        const items = [];
        for (let todo in this.props.todos) {
            if (this.props.todos.hasOwnProperty(todo)) {
                items.push(<ToDoItem key={todo} id={todo} todo={this.props.todos[todo]} delToDo={this.props.delToDo}
                                     completeToDo={this.props.completeToDo} updateToDo={this.props.updateToDo}/>);
            }
        }
        return (
            <List className="list-container">
                {items}
            </List>
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
        this.props.delToDo(this.props.id);
    }

    handleChange(event) {
        this.props.completeToDo(this.props.id, this.props.todo);
    }

    handleDoubleClick(event) {
        event.preventDefault();
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
        this.props.updateToDo(this.props.id, this.props.todo);
    }

    render() {
        return (
            <ListItem
                leftCheckbox={<Checkbox value={this.props.todo.complete} checked={this.props.todo.complete}
                                        onCheck={this.handleChange}/>}
                rightToggle={<RaisedButton label="x" secondary onClick={this.handClick} className="del-button"/>}
            >
                <span onDoubleClick={this.handleDoubleClick} onBlur={this.handleBlur}>
                    {this.state.editTodo ?
                        (<TextField
                            name="todoName"
                            value={this.props.todo.name}
                            onChange={this.handleChange4Edit}
                            onKeyDown={this.handleChangeUpdate}
                            autoFocus
                        />) :
                        (<span className={this.props.todo.complete ? 'complete-todo' : 'active-todo'}>{this.props.todo.name}</span>)
                    }
                </span>
            </ListItem>
        )
    }
}

class ToDoFooter extends Component {
    constructor(props) {
        super(props);
        this.getAllToDos = this.getAllToDos.bind(this);
        this.getActiveToDos = this.getActiveToDos.bind(this);
        this.getCompletedToDos = this.getCompletedToDos.bind(this);
        this.active = 'all';
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
        const style = {margin: 12};
        return (
            <div>
                共{this.props.count}条
                <RaisedButton label="All" primary={this.active === 'all'} onClick={this.getAllToDos} style={style}/>
                <RaisedButton label="Active" primary={this.active === 'active'} onClick={this.getActiveToDos} style={style}/>
                <RaisedButton label="Completed" primary={this.active === 'completed'} onClick={this.getCompletedToDos} style={style}/>
            </div>
        )
    }
}

export default App;
