"use client"
import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import './page.css'

export default function Home() {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Selected option:", selectedOption);
    window.localStorage.setItem('selectedOption', selectedOption);
    router.push('/board');
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
      <div className="rules">
        <p>* Select a channel to proceed</p>
        <p>* Share the channel with your friend to join</p>
        <p>* If you are X , your friend is O</p> 
        <p>* Players take turns putting their marks in empty squares</p>
        <p>* The first player to get 3 of the marks in a row (up, down, across, or diagonally) is the winner</p>
        <p>* When all 9 squares are full, the game is over. If no player has 3 marks in a row, the game ends in a tie</p>
      </div>
        <label>
          Select a Channel:
          <select value={selectedOption} onChange={handleOptionChange} className="selection">
            <option value="1">Channel 1</option>
            <option value="2">Channel 2</option>
            <option value="3">Channel 3</option>
            <option value="4">Channel 4</option>
            <option value="5">Channel 5</option>
          </select>
        </label>
        <button type="submit" className="submit">Submit</button>
      </form>
    </div>
  );
}
