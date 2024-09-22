import React, { useState } from 'react';
import { Snackbar, Alert, SnackbarCloseReason, Slide, SlideProps } from '@mui/material';
import { CheckCircle } from 'lucide-react';

type TransitionProps = Omit<SlideProps, 'direction'>;

const SlideTransition = (props: TransitionProps) => {
  return <Slide {...props} direction="right" />;
};

interface UseLoginErrorDialogReturn {
  showLoginErrorDialog: () => void;
  LoginErrorDialog: React.FC;
}

const useLoginErrorDialog = (): UseLoginErrorDialogReturn => {
  const [open, setOpen] = useState<boolean>(false);

  const showLoginErrorDialog = (): void => {
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason): void => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const LoginErrorDialog: React.FC = () => (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      TransitionComponent={SlideTransition}
    >
      <Alert
        onClose={handleClose}
        severity="error"
        sx={{ width: '100%' }}
        icon={<CheckCircle className="text-green-500" size={24} />}
      >
        ログインに失敗しました。
      </Alert>
    </Snackbar>
  );

  return { showLoginErrorDialog, LoginErrorDialog };
};

export default useLoginErrorDialog;