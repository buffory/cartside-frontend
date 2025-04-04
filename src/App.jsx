import { useState } from 'react';
import './App.css';
import { Demo } from './Demo.jsx';
import { Header } from './Header.jsx';
import { Hero } from './Hero.jsx';

function App() {

  return (
    <>
        <Header />
        <div className="scroll-container w-full flex flex-col p-5">
            <section><Hero /></section>
            <section><Demo /></section>:w

        </div>
    </>
  )
}

export default App
