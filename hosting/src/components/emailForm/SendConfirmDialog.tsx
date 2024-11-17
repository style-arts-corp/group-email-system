import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface OKNODialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SendConfirmDialog: React.FC<OKNODialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="send-confirm-dialog-title"
      aria-describedby="send-confirm-dialog-description"
    >
      <DialogTitle id="send-confirm-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="send-confirm-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          いいえ
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
          variant="contained"
          autoFocus
        >
          はい
        </Button>
      </DialogActions>
    </Dialog>
  );
};
