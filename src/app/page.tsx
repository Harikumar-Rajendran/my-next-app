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
        <label>
          Select an option:
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
