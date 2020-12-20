import React, { useState } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import App from "../../app";

export default function Dashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const [ GameState, setGameState] = useState(1);
  const history = useHistory()

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  function setUserProfile(){
    return(
      <>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <strong>Email:</strong> {currentUser.email}
            <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
              Update Profile
            </Link>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          <Button variant="link" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </>
    )
  }

  if(GameState !== 2){
    console.log("GameState: " + GameState);
    return (
      <>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Danger Escape</h2>
            {GameState > 2 && <Alert variant="danger">Still Constructing T-T</Alert>}
            <Button onClick={() => setGameState(2)} className="btn btn-primary w-100 mt-3">
              Start New Game
            </Button>
            <Button onClick={() => setGameState(3)} className="btn btn-primary w-100 mt-3">
              Load Game
            </Button>
            <Button onClick={() => setGameState(4)} className="btn btn-primary w-100 mt-3">
              Option
            </Button>
          </Card.Body>
        </Card>
        {setUserProfile()}
      </>
    )
  }
  else if(GameState === 2){
    return (
      <>
        <App />
        {setUserProfile()}
      </>
    )
  }

}
