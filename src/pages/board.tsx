"use client"
import React, { FC, useEffect, useState } from "react";
import "./board.css";

const Board: FC = () => {
  
  const [tileStatus, setTileStatus] = useState<string[]>(Array(9).fill(""));
  const [player, setPlayer] = useState<string>("X");
  const [message, setMessage] = useState<string>("");
  const [inputValue, setInputValue] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);

  const winningConditions: number[][] = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal from top left to bottom right
    [2, 4, 6], // diagonal from top right to bottom left
  ];

  useEffect(() => {
    const selectedOption = (window.localStorage.getItem('selectedOption') || '{}');
    const wsoc = new WebSocket(`ws://localhost:8080`); // replace with your server's address and port
    setWs(wsoc);
        wsoc.onopen = () => {
      console.log('WebSocket is open now.');
      wsoc.send(JSON.stringify({ type: 'join', channel: selectedOption }));
    };

    wsoc.onmessage = (event) => {
      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = function () {
          console.log('Received a message from the server:', this.result);
          let msg = JSON.parse(this.result?.toString() || "");
          if(msg.type === 'join') {
            setMessage(`Player ${player} joined the game`);
          }
          else{
            let msg = JSON.parse(this.result?.toString() || "");
            if(msg.message[0] && msg.message[0].length > 0){
              setTileStatus(msg.message[0]); 
              setPlayer(msg.message[1]);
            }
            
          }
          
        };
        reader.readAsText(event.data);
      } else {
        console.log('Received a message from the server:', event.data);
        let msg = JSON.parse(event.data?.toString() || "");
        if(msg.message[0] && msg.message[0].length > 0){
          setTileStatus(msg.message[0]); 
          setPlayer(msg.message[1]);
        }
      }
    };

    wsoc.onerror = (error) => {
      console.log('WebSocket error: ', error);
    };

    wsoc.onclose = (event) => {
      console.log('WebSocket is closed now.', event.code, event.reason);
    };
  
    return () => {
        wsoc.close();
    };
  }, []);

  useEffect(() => {
    if (checkWinningCondition()) {
      console.log("Winner found!");
    } else if (tileStatus && tileStatus.every((tile) => tile !== "")) {
      setMessage("It's a draw!");
    } else {
      if (player === "X") {
        setMessage(`Player ${player}'s turn`);
      } else {
        setMessage(`Player ${player}'s turn`);
      }
    }
  }, [tileStatus]);

  const checkWinningCondition = () => {
    for (let i = 0; i < winningConditions.length; i++) {
      const [a, b, c] = winningConditions[i];
      if (tileStatus &&
        tileStatus[a] !== "" &&
        tileStatus[a] === tileStatus[b] &&
        tileStatus[a] === tileStatus[c]
      ) {
        setMessage(`Player ${tileStatus[a]} wins!`);
        return true;
      }
    }
    return false;
  };

  const handleTileClick = (index: number) => {
    // Update the status of the clicked tile
    let nextPlayer='';
    const updatedTileStatus = tileStatus ? [...tileStatus] : [];
    if (player === "X") {
      nextPlayer="O";
      if (updatedTileStatus[index] === "") {
        updatedTileStatus[index] = "X";
        setPlayer(nextPlayer);
      }
    } else {
      nextPlayer="X"
      if (updatedTileStatus[index] === "") {
        updatedTileStatus[index] = "O";
        setPlayer(nextPlayer);
      }
    }
    if(ws) {
      // send updatedTileStatus and player to the server as array
      let msg = [];
      msg[0] = updatedTileStatus;
      msg[1] = nextPlayer;
      ws.send(JSON.stringify({ type: 'message', message: msg }));
    }
    else {
      const selectedOption = (window.localStorage.getItem('selectedOption') || '{}');
        const wsoc= new WebSocket(`ws://localhost:8080`);
        wsoc.onopen = () => {
          let msg = [];
          msg[0] = updatedTileStatus;
          msg[1] = nextPlayer;
          wsoc.send(JSON.stringify({ type: 'message', message: msg }));
        };
      }
    setTileStatus(updatedTileStatus);
  };

  return (
    <div className="container">
      <h1>Tic Tac Toe Game Board</h1>
      <div className="board">
        <div className="row">
          <div className="tile" id="0" onClick={() => handleTileClick(0)}>
            {tileStatus?tileStatus[0]:''}
          </div>
          <div className="tile" id="1" onClick={() => handleTileClick(1)}>
            {tileStatus?tileStatus[1]:''}
          </div>
          <div className="tile" id="2" onClick={() => handleTileClick(2)}>
            {tileStatus?tileStatus[2]:''}
          </div>
        </div>
        <div className="row">
          <div className="tile" id="3" onClick={() => handleTileClick(3)}>
            {tileStatus?tileStatus[3]:''}
          </div>
          <div className="tile" id="4" onClick={() => handleTileClick(4)}>
            {tileStatus?tileStatus[4]:''}
          </div>
          <div className="tile" id="5" onClick={() => handleTileClick(5)}>
            {tileStatus?tileStatus[5]:''}
          </div>
        </div>
        <div className="row">
          <div className="tile" id="6" onClick={() => handleTileClick(6)}>
            {tileStatus?tileStatus[6]:''}
          </div>
          <div className="tile" id="7" onClick={() => handleTileClick(7)}>
            {tileStatus?tileStatus[7]:''}
          </div>
          <div className="tile" id="8" onClick={() => handleTileClick(8)}>
            {tileStatus?tileStatus[8]:''}
          </div>
        </div>
      </div>
      <div className="message">{message}</div>
    </div>
  );
};

export default Board;
