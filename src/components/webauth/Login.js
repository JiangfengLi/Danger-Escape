import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  //const [loginSucceed, setLoginSucceed] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault()

    let loginSucceed = false;
    //console.log("outer loading 2: " + loading);
    try {
      //console.log("inner loading 1: " + loading);
      setError("");
      setLoading(true);
      //console.log("inner loading 2: " + loading);
      await login(emailRef.current.value, passwordRef.current.value);     
      //setLoginSucceed(true);
      loginSucceed = true;
      //console.log("loginSucceed: " + loginSucceed);
    } catch {
      setError("Failed to log in")
    }

    //console.log("outer loading 2: " + loading);
    await setLoading(false)
    //console.log("loginSucceed 2: " + loginSucceed);
    if(loginSucceed) history.push("/");
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h1 className="text-center mb-4">Danger Escape</h1>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Log In
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </>
  )
}
