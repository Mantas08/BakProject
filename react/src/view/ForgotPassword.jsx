import { useState } from 'react';
import axiosClient from '../axios-client';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/forgot-password', { email });
      setMessage('Išsiųstas slaptažodžio atstatymo el. laiškas. Patikrinkite savo pašto dėžutę.');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage('Atsiprašome, neradome paskyros, susijusios su šiuo el. pašto adresu. Patikrinkite el. pašto adresą ir bandykite dar kartą.');
      } else {
        setMessage('Nepavyko išsiųsti slaptažodžio atstatymo el. laiško.');
      }
    }
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={handleSubmit}>
          <h1 className="title">Pamiršote slaptažodį</h1>
          {message && <div className="alert"><p>{message}</p></div>}
          <input
            type="email"
            placeholder="Įveskite el. paštą"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="btn btn-block" type="submit">Atsatyti slaptažodį</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
