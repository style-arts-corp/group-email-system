import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import React, { useState, ChangeEvent } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Alert,
} from '@mui/material';
interface LoginData {
  email: string;
  password: string;
}

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const LoginForm: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      console.log('Login successful');
      // ここでログイン成功後の処理を実装します（例：ホーム画面へのリダイレクト）
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{margin: 'auto', mt: "10%" }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          ログイン
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="メールアドレス"
            name="email"
            autoComplete="email"
            autoFocus
            value={loginData.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="current-password"
            value={loginData.password}
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            ログイン
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;