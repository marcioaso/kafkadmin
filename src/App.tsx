import { Component, For } from 'solid-js';


import { list as usersList, remove, replace } from './store/users';

const App:Component = () => {
  replace({id:1, name:'Marcio Oliveira'})
  return (
    <div>
      <header >
        <div>KafkAdmin</div>
        <For each={ usersList() }>
          {(item) => <div>{item.id} - {item.name}</div>}
        </For>
      </header>
    </div>
  );
};

export default App;