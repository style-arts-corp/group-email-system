import type React from 'react';
import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Stack,
  Chip,
  Typography,
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import type { SelectChangeEvent } from '@mui/material/Select';
import WarningDialog from './WarningDialog'; // パスは適切に調整してください

const EmailForm: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [cc, setCc] = useState('');
  const [body, setBody] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState({ recipient: false, body: false });
  const [openWarning, setOpenWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const handleRecipientChange = (event: SelectChangeEvent) => {
    setRecipient(event.target.value);
    setErrors((prev) => ({ ...prev, recipient: false }));
  };

  const handleCcChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCc(event.target.value);
  };

  const handleBodyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBody(event.target.value);
    setErrors((prev) => ({ ...prev, body: false }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...Array.from(event.target.files!),
      ]);
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  const validateForm = (): boolean => {
    const newErrors = {
      recipient: recipient.trim() === '',
      body: body.trim() === '',
    };
    setErrors(newErrors);

    return !newErrors.recipient && !newErrors.body;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      if (cc.trim() === '' && files.length === 0) {
        setWarningMessage(
          'CCと添付ファイルが設定されていません。続行しますか？',
        );
        setOpenWarning(true);
      } else if (cc.trim() === '') {
        setWarningMessage('CCが設定されていません。続行しますか？');
        setOpenWarning(true);
      } else if (files.length === 0) {
        setWarningMessage('添付ファイルが設定されていません。続行しますか？');
        setOpenWarning(true);
      } else {
        sendEmail();
      }
    }
  };

  const sendEmail = () => {
    // ここで実際のメール送信処理を実装します
    console.log('メールを送信:', { recipient, cc, body, files });
  };

  const handleCloseWarning = () => {
    setOpenWarning(false);
  };

  const handleConfirmSend = () => {
    setOpenWarning(false);
    sendEmail();
  };

  return (
    <Box
      component="form"
      sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}
      onSubmit={handleSubmit}
    >
      <FormControl error={errors.recipient} margin="normal" fullWidth>
        <InputLabel id="recipient-select-label">送信先</InputLabel>
        <Select
          id="recipient-select"
          label="送信先"
          labelId="recipient-select-label"
          value={recipient}
          onChange={handleRecipientChange}
        >
          <MenuItem value="recipient1@example.com">
            recipient1@example.com
          </MenuItem>
          <MenuItem value="recipient2@example.com">
            recipient2@example.com
          </MenuItem>
          <MenuItem value="recipient3@example.com">
            recipient3@example.com
          </MenuItem>
        </Select>
        {errors.recipient && (
          <Typography color="error">送信先を選択してください</Typography>
        )}
      </FormControl>

      <TextField
        id="cc"
        label="CC"
        margin="normal"
        value={cc}
        fullWidth
        onChange={handleCcChange}
      />

      <TextField
        error={errors.body}
        helperText={errors.body ? '本文を入力してください' : ''}
        id="body"
        label="本文"
        margin="normal"
        rows={4}
        value={body}
        fullWidth
        multiline
        onChange={handleBodyChange}
      />

      <Box sx={{ mt: 2, mb: 2 }}>
        <Stack direction="row" flexWrap="wrap" spacing={1}>
          {files.map((file, index) => (
            <Chip
              key={index}
              label={file.name}
              sx={{ mb: 1 }}
              onDelete={() => {
                handleRemoveFile(file);
              }}
            />
          ))}
        </Stack>
      </Box>

      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
      >
        <Button
          component="label"
          startIcon={<AttachFileIcon />}
          variant="outlined"
        >
          添付ファイル追加
          <input type="file" hidden multiple onChange={handleFileChange} />
        </Button>

        <Button endIcon={<SendIcon />} type="submit" variant="contained">
          送信
        </Button>
      </Stack>

      <WarningDialog
        message={warningMessage}
        open={openWarning}
        onClose={handleCloseWarning}
        onConfirm={handleConfirmSend}
      />
    </Box>
  );
};

export default EmailForm;
