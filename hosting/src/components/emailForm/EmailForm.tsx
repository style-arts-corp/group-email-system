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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import type { SelectChangeEvent } from '@mui/material/Select';
import getGspreadDataByID from '../../api/getGspreadDataByID';
import getGspreadList from '../../api/getGspreadList';
import processToSendEmail from '../../api/processToSendEmail';
import useSuccessDialog from './SuccessDialog';
import WarningDialog from './WarningDialog'; // パスは適切に調整してください

// ========== ▼ スプシメタデータに関する定義 ▼ ==========
type GspreadIMetaDataType = {
  id: string;
  title: string;
};
const isGspreadIMetaDataType = (arg: any): arg is GspreadIMetaDataType =>
  arg && typeof arg.id === 'string' && typeof arg.title === 'string';
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
    Array<TargetAddressDataType | null>
  >([]);
  const [recipient, setRecipient] = useState('');
  const [cc, setCc] = useState('');

  const [ccList, setCcList] = useState<string[]>([]);
  const [newCc, setNewCc] = useState('');

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState({ recipient: false, body: false });
  const [openWarning, setOpenWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const { SuccessDialog, showSuccessDialog } = useSuccessDialog();

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

  const handleAddCc = () => {
    if (newCc.trim() !== '' && !ccList.includes(newCc.trim())) {
      setCcList([...ccList, newCc.trim()]);
      setNewCc('');
    }
  };

  const handleRemoveCc = (ccToRemove: string) => {
    setCcList(ccList.filter((cc) => cc !== ccToRemove));
  };

  const handleNewCcChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewCc(event.target.value);
  };

  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(event.target.value);
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
    console.log('メールを送信');
    sendEmail();
  };

  const sendEmail = () => {
    // ここで実際のメール送信処理を実装します
    const pushData = async () => {
      console.log(targetAddressList);
      console.log(subject);
      console.log(body);
      // ここでsendEmailのAPIを叩く処理を実装します
      await processToSendEmail(targetAddressList, ccList, subject, body);
      showSuccessDialog();
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
      sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}
      onSubmit={handleSubmit}
    >
      <FormControl margin="normal" fullWidth>
        <InputLabel id="recipient-select-label">
          対象スプレッドシート
        </InputLabel>
        <Select
          id="recipient-select"
          label="対象スプレッドシート"
          labelId="recipient-select-label"
          value={targetGspreadData ? targetGspreadData.id : ''}
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

      <Box sx={{ mt: 1 }}>
        <Box
          justifyContent="space-between"
          sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}
        >
          <TextField
            placeholder="CC用アドレス"
            size="small"
            sx={{ mr: 1, width: 450 }}
            value={newCc}
            fullWidth
            onChange={handleNewCcChange}
          />
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={handleAddCc}
          >
            追加
          </Button>
        </Box>
        <Stack direction="row" flexWrap="wrap" spacing={1}>
          {ccList.map((cc, index) => (
            <Chip
              key={index}
              label={cc}
              sx={{ mb: 1 }}
              onDelete={() => {
                handleRemoveCc(cc);
              }}
            />
          ))}
        </Stack>
      </Box>

      <TextField
        id="subject"
        label="件名"
        margin="normal"
        value={subject}
        fullWidth
        onChange={handleSubjectChange}
      />

      <TextField
        error={errors.body}
        helperText={errors.body ? '本文を入力してください' : ''}
        id="body"
        label="本文"
        margin="normal"
        rows={15}
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
        paddingBottom="10%"
        spacing={1}
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

      <SuccessDialog />
    </Box>
  );
};

export default EmailForm;
