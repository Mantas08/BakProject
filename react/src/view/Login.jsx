import {Link} from "react-router-dom";
import axiosClient from "../axios-client.js";
import {createRef} from "react";
import { useState } from "react";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Login() {
  const emailRef = createRef()
  const passwordRef = createRef()
  const { setUser, setToken } = useStateContext()
  const [message, setMessage] = useState(null)

  const onSubmit = ev => {
    ev.preventDefault()

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    axiosClient.post('/login', payload)
      .then(({data}) => {
        setUser(data.user)
        setToken(data.token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setMessage(response.data.message)
        }
      })
  }

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Prsijungite prie savo paskyros</h1>

          {message &&
            <div className="alert">
              <p>{message}</p>
            </div>
          }

          <input ref={emailRef} type="email" placeholder="El. paštas"/>
          <input ref={passwordRef} type="password" placeholder="Slaptažodis"/>
          <button className="btn btn-block">Prisijungti</button>
          <p className="message">Neturite paskyros? <Link to="/signup">Registruotis</Link></p>
          <p className="message"><Link to="/ForgotPassword">Priminti slaptažodį?</Link></p>
        </form>
      </div>
    </div>
  )
}
