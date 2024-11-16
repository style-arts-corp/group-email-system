import type React from 'react';
import { useState } from 'react';
import type { SnackbarCloseReason, SlideProps } from '@mui/material';
import { Snackbar, Alert, Slide } from '@mui/material';
import { CheckCircle } from 'lucide-react';

type TransitionProps = Omit<SlideProps, 'direction'>;

const SlideTransition = (props: TransitionProps) => (
  <Slide {...props} direction="right" />
);

interface UseSuccessDialogReturn {
  showSuccessDialog: () => void;
  SuccessDialog: React.FC;
}

const useSuccessDialog = (): UseSuccessDialogReturn => {
  const [open, setOpen] = useState<boolean>(false);

  const showSuccessDialog = (): void => {
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ): void => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const SuccessDialog: React.FC = () => (
    <Snackbar
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      autoHideDuration={3000}
      open={open}
      onClose={handleClose}
    >
      <Alert
        icon={<CheckCircle className="text-green-500" size={24} />}
        severity="success"
        sx={{ width: '100%' }}
        onClose={handleClose}
      >
        操作が成功しました
      </Alert>
    </Snackbar>
  );

  return { showSuccessDialog, SuccessDialog };
};

export default useSuccessDialog;
