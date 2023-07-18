import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, createEvent, sample } from 'effector'
import { useStore, useList } from 'effector-react';
import "./App.css";
const add = createEvent();
const del = createEvent();
const complete = createEvent();
const $storeDefault = createStore([
  {
    task: 'работа',
    id: 1,
    completed: false,
  },
  {
    task: 'учеба',
    id: 2,
    completed: false,
  },
])
  .on(add, (todos, newTodo) => [...todos, newTodo])
  .on(del, (todos, id) => {

    let copy = [...todos];
    copy = copy.filter(el => el.id !== id);
    copy.map((el, index) => {
      el.id = index + 1;
    })

    return copy;

  })
  .on(complete, (todos, id) => {
    let copy = [...todos];
    copy.map(el => {
      if (el.id === id) {
        el.completed = true;
      }
    })
    return copy;
  });

function Task({ task }) {
  return <li key={task.id}>
    {task.completed ? '(Completed) ' + task.task : task.task}

    <button onClick={() => {
      del(task.id);
    }}>
      Delete
    </button>
    {task.completed ? null : <button onClick={() => {
      complete(task.id)
    }}>Complete</button>}
  </li>
}
function Todo(storeDefault) {

  const todos = storeDefault.store.map(el => {
    return <Task task={el} />
  })
  return <div className='Todo'>
    <form onSubmit={(e) => {

      e.preventDefault();
      add({
        task: e.target.newtodo.value,
        id: storeDefault.store.length + 1,
        completed: false
      });
      e.target.newtodo.value = '';
    }}>
      <input type="text" name='newtodo' />
      <button type='submit'>Add</button>
    </form>

    <ul>
      {todos}
    </ul>
  </div>




}


export default function App() {
  const store = useStore($storeDefault);

  return (
    <>

      <Todo storeDefault={$storeDefault} store={store} />
    </>
  )
}

