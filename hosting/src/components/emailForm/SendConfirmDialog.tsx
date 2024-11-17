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
  onConfirm: () => void;
  onCancel: () => void;
}

export const SendConfirmDialog: React.FC<OKNODialogProps> = ({
  open,
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
      <DialogTitle id="send-confirm-dialog-title">
        メール送信内容確認
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="send-confirm-dialog-description">
          以下の内容で、本当に送信しますか？
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          キャンセル
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
          variant="contained"
          autoFocus
        >
          送信
        </Button>
      </DialogActions>
    </Dialog>
  );
};
