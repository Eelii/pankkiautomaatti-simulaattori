import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';



function App() {

  const [currentPin, setCurrentPin] = useState<string | null>(null)
  const [locked, setLocked] = useState<boolean>(true)
  const [incorrectTries, setIncorrectTries] = useState<number>(0)
  const [funds, setFunds] = useState<string>("999999999999999999999999,99")

  useEffect(() => {
    if(currentPin && currentPin.length === 4){
      checkPin(currentPin)
      setCurrentPin(null)
    }
  }, [currentPin])

  const BUTTON_TEXTS_LOCKED = ["1","2","3","4","5","6","7","8","9","CLR","0","🔐"]
  const BUTTON_TEXTS_UNLOCKED = [...BUTTON_TEXTS_LOCKED.slice(0, -1), "🔓"]
  const BACKEND_URL = "http://localhost:3001"

  const checkPin = async (currentPin:string) => {
    const response = await (await fetch(`${BACKEND_URL}/checkPin?pin=${currentPin}`)).json()
    if(response.pinCorrect){
      setLocked(false)
    } else{
      setIncorrectTries(incorrectTries+ 1)
    }
  }

  const renderKeyPad = () => {
    if(locked){
      return(BUTTON_TEXTS_LOCKED.map((buttonText) => renderPadButton(buttonText)))
    } else{
      return(BUTTON_TEXTS_UNLOCKED.map((buttonText) => renderPadButton(buttonText)))
    }
  }

  const renderPadButton = (buttonText:string) => {

    const handleClick = () => {
      if(locked){
        if(buttonText === "CLR"){
          setCurrentPin(null)
        }
        else if(currentPin === null){
          setCurrentPin(buttonText)
        } 
        else if(currentPin.length < 4){
          setCurrentPin(currentPin + buttonText)
        }
      }
    }

    if(buttonText === "🔐" || buttonText === "🔓"){
      return(
        <div className="padButton-lock">{buttonText}</div>
      )
    } else{
      return(
        <div className="padButton" onClick={()=>handleClick()}>{buttonText}</div>
      )
    }
  }

  const renderBankUI = () =>{
    return(
      <div className="bankInterface">
        <div className="bankInterface-header">
          <b>
            Finske Bank
          </b>
        </div>
        <div className="bankInterface-body">
          { locked && 
            <div className="bankInterface-pinInputField">
              {currentPin?.length?'*'.repeat(currentPin.length):null}
            </div>
          }
          { locked && incorrectTries > 0 &&
            <div style={{position: "absolute", color: incorrectTries>3?"red":"black", marginTop: 150}}>Incorrect tries: {incorrectTries}</div>
          }
          { !locked && 
            <div className="bankInterface-accountView">
              <p>Welcome!</p>
              <p>Current balance:</p>
              <p>{funds +" €"}</p>
              <div style={{width: "100%", height: "20%", marginTop: 30}}>
                {funds!=="0" && <button onClick={()=>setFunds("0")} style={{position:"relative", marginLeft: 20, float:"left"}}>Withdraw all funds</button>}
                <button onClick={()=>{setLocked(true);setIncorrectTries(0)}} style={{position:"relative", marginRight: 20, float:"right"}}>Log out</button>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <div className={locked?"keypad":"keypad-unlocked"}>
        {renderKeyPad()}
      </div>
      {renderBankUI()}
    </div>
  );
}

export default App;
