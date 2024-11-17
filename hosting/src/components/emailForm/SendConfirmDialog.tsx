import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Divider,
  Chip,
} from '@mui/material';

import type { TargetAddressDataType } from '@/components/emailForm/EmailForm';

interface SendConfirmDialogProps {
  // state
  open: boolean;
  // content
  targetAddressList: Array<TargetAddressDataType | null>;
  ccList: string[];
  subject: string;
  body: string;
  files: File[];
  // handler
  onConfirm: () => void;
  onCancel: () => void;
}

export const SendConfirmDialog: React.FC<SendConfirmDialogProps> = ({
  open,
  targetAddressList,
  ccList,
  subject,
  body,
  files,
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
        <DialogContentText
          id="send-confirm-dialog-description"
          sx={{ marginBottom: '40px' }}
        >
          以下の内容で、本当に送信しますか？
        </DialogContentText>
        <Divider textAlign="center">送信先</Divider>
        <DialogContentText
          id="send-confirm-dialog-description"
          sx={{ marginBottom: '20px' }}
        >
          {targetAddressList.map((targetAddress, index) => (
            <Chip
              key={index}
              label={targetAddress?.email}
              sx={{ margin: '5px', fontSize: '10px' }}
            />
          ))}
        </DialogContentText>
        <Divider textAlign="center">cc</Divider>
        <DialogContentText
          id="send-confirm-dialog-description"
          sx={{ marginBottom: '20px' }}
        >
          {ccList.map((ccAddress, index) => (
            <Chip
              key={index}
              label={ccAddress}
              sx={{ margin: '5px', fontSize: '10px' }}
            />
          ))}
        </DialogContentText>
        <Divider textAlign="center">件名</Divider>
        <DialogContentText
          id="send-confirm-dialog-description"
          sx={{
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
          }}
        >
          {subject}
        </DialogContentText>
        <Divider textAlign="center">本文</Divider>
        <DialogContentText
          id="send-confirm-dialog-description"
          sx={{ marginBottom: '20px' }}
        >
          {body}
        </DialogContentText>
        <Divider textAlign="center">添付ファイル</Divider>
        <DialogContentText
          id="send-confirm-dialog-description"
          sx={{ marginBottom: '20px' }}
        >
          {files.map((file, index) => (
            <Chip
              key={index}
              label={file.name}
              sx={{ margin: '5px', fontSize: '10px' }}
            />
          ))}
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
