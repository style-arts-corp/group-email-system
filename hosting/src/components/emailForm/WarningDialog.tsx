/* eslint-disable jsx-a11y/no-autofocus */
import type React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';

interface WarningDialogProps {
  open: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const WarningDialog: React.FC<WarningDialogProps> = ({
  open,
  message,
  onClose: handleClose,
  onConfirm: handleConfirm,
}) => (
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>警告</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>キャンセル</Button>
      <Button autoFocus onClick={handleConfirm}>
        送信
      </Button>
    </DialogActions>
  </Dialog>
);

export default WarningDialog;
