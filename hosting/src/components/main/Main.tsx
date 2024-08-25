import React, { useEffect, useState } from 'react';
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
import { SelectChangeEvent } from '@mui/material/Select';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import WarningDialog from './WarningDialog';  // パスは適切に調整してください
import getGspreadList from '../../api/getGspreadList';

type GspreadIMetaDataType = {
  id: string;
  title: string;
};

const isGspreadIMetaDataType = (arg: any): arg is GspreadIMetaDataType => {
  return arg && typeof arg.id === 'string' && typeof arg.title === 'string';
}

const EmailForm: React.FC = () => {
  const [gspreadList, setGspreadList] = useState<(GspreadIMetaDataType | null)[]>([])
  const [recipient, setRecipient] = useState('');
  const [cc, setCc] = useState('');
  const [body, setBody] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState({ recipient: false, body: false });
  const [openWarning, setOpenWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getGspreadList();
      console.log(data);
      setGspreadList(data);
    }
    fetchData();
  }, []);

  const handleRecipientChange = (event: SelectChangeEvent) => {
    setRecipient(event.target.value as string);
    setErrors(prev => ({ ...prev, recipient: false }));
  };

  const handleCcChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCc(event.target.value);
  };

  const handleBodyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBody(event.target.value);
    setErrors(prev => ({ ...prev, body: false }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(prevFiles => [...prevFiles, ...Array.from(event.target.files as FileList)]);
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(files.filter(file => file !== fileToRemove));
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
        setWarningMessage('CCと添付ファイルが設定されていません。続行しますか？');
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
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <FormControl fullWidth margin="normal" error={errors.recipient}>
        <InputLabel id="recipient-select-label">対象スプレッドシート</InputLabel>
        <Select
          labelId="recipient-select-label"
          id="recipient-select"
          value={recipient}
          label="対象スプレッドシート"
          onChange={handleRecipientChange}
        >
          {
            gspreadList.map((item:GspreadIMetaDataType | null, index) => (
              isGspreadIMetaDataType(item) ? <MenuItem key={index} value={item.id}>{item.title}</MenuItem> : null
            ))
          }
          </Select>
        {errors.recipient && <Typography color="error">送信先を選択してください</Typography>}
      </FormControl>

      <TextField
        fullWidth
        margin="normal"
        id="cc"
        label="CC"
        value={cc}
        onChange={handleCcChange}
      />

      <TextField
        fullWidth
        margin="normal"
        id="body"
        label="本文"
        multiline
        rows={4}
        value={body}
        onChange={handleBodyChange}
        error={errors.body}
        helperText={errors.body ? '本文を入力してください' : ''}
      />

      <Box sx={{ mt: 2, mb: 2 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {files.map((file, index) => (
            <Chip
              key={index}
              label={file.name}
              onDelete={() => handleRemoveFile(file)}
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
      </Box>

      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
        <Button
          component="label"
          variant="outlined"
          startIcon={<AttachFileIcon />}
        >
          添付ファイル追加
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            multiple
          />
        </Button>

        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
        >
          送信
        </Button>
      </Stack>

      <WarningDialog
        open={openWarning}
        message={warningMessage}
        onClose={handleCloseWarning}
        onConfirm={handleConfirmSend}
      />
    </Box>
  );
};

export default EmailForm;