import type React from 'react';
import { useEffect, useState } from 'react';
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
import getGspreadList from '../../api/getGspreadList';
import getGspreadDataByID from '../../api/getGspreadDataByID';
import processToSendEmail from '../../api/processToSendEmail';

// ========== ▼ スプシメタデータに関する定義 ▼ ==========
type GspreadIMetaDataType = {
  id: string;
  title: string;
};
const isGspreadIMetaDataType = (arg: any): arg is GspreadIMetaDataType => {
  return arg && typeof arg.id === 'string' && typeof arg.title === 'string';
};
// ========== ▲ スプシメタデータに関する定義 ▲ ==========

// ========== ▼ EmailFormコンポーネントの定義 ▼ ==========
export type TargetAddressDataType = {
  name: string;
  company: string;
  role: string;
  email: string;
};
// ========== ▲ EmailFormコンポーネントの定義 ▲ ==========

const EmailForm: React.FC = () => {
  const [gspreadList, setGspreadList] = useState<GspreadIMetaDataType[] | null>(
    [],
  );
  const [targetGspreadData, setTargetGspreadData] =
    useState<GspreadIMetaDataType | null>();
  const [targetAddressList, setTargetAddressList] = useState<
    (TargetAddressDataType | null)[]
  >([]);
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
    };
    fetchData();
  }, []);

  const handleGspreadChange = (event: SelectChangeEvent) => {
    const fetchData = async (id: string) => {
      const data = await getGspreadDataByID(id);
      console.log(data);
      setTargetAddressList(data);
    };
    const gspreadID = event.target.value;
    if (gspreadList === null) return;
    setTargetGspreadData(gspreadList.find((item) => item.id === gspreadID));
    fetchData(gspreadID);
  };

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
    if (event.target.files === null) return;

    setFiles((prevFiles) => {
      const newFiles = event.target.files;
      if (newFiles === null) return prevFiles;

      return [...prevFiles, ...Array.from(newFiles)];
    });
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
    console.log('メールを送信');
    sendEmail();
  };

  const sendEmail = () => {
    // ここで実際のメール送信処理を実装します
    const pushData = async () => {
      console.log(targetAddressList);
      console.log(body);
      // ここでsendEmailのAPIを叩く処理を実装します
      await processToSendEmail(targetAddressList, body);
    };
    console.log('メールを送信:', { targetAddressList, cc, body, files });
    pushData();
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
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}
    >
      <FormControl fullWidth margin="normal">
        <InputLabel id="recipient-select-label">
          対象スプレッドシート
        </InputLabel>
        <Select
          id="recipient-select"
          value={targetGspreadData ? targetGspreadData.id : ''}
          label="対象スプレッドシート"
          onChange={handleGspreadChange}
        >
          {gspreadList !== null
            ? gspreadList.map((item: GspreadIMetaDataType | null, index) =>
                isGspreadIMetaDataType(item) ? (
                  <MenuItem key={index} value={item.id}>
                    {item.title}
                  </MenuItem>
                ) : null,
              )
            : null}
        </Select>
        {/* {errors.recipient && <Typography color="error">送信先を選択してください</Typography>} */}
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
        fullWidth
        margin="normal"
        id="body"
        label="本文"
        multiline
        rows={15}
        value={body}
        onChange={handleBodyChange}
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
          {files.map((file) => (
            <Chip
              key={file.name}
              label={file.name}
              sx={{ mb: 1 }}
              // eslint-disable-next-line react/jsx-handler-names
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
