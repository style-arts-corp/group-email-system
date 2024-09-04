import React, { useState } from 'react';
import { Snackbar, Alert, SnackbarCloseReason, Slide, SlideProps } from '@mui/material';
import { CheckCircle } from 'lucide-react';

type TransitionProps = Omit<SlideProps, 'direction'>;

const SlideTransition = (props: TransitionProps) => {
  return <Slide {...props} direction="right" />;
};

interface UseSuccessDialogReturn {
  showSuccessDialog: () => void;
  SuccessDialog: React.FC;
}

const useSuccessDialog = (): UseSuccessDialogReturn => {
  const [open, setOpen] = useState<boolean>(false);

  const showSuccessDialog = (): void => {
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason): void => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const SuccessDialog: React.FC = () => (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      TransitionComponent={SlideTransition}
    >
      <Alert
        onClose={handleClose}
        severity="success"
        sx={{ width: '100%' }}
        icon={<CheckCircle className="text-green-500" size={24} />}
      >
        操作が成功しました
      </Alert>
    </Snackbar>
  );

  return { showSuccessDialog, SuccessDialog };
};

export default useSuccessDialog;