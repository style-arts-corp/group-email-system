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
  FormHelperText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import type { SelectChangeEvent } from '@mui/material/Select';
import getGspreadDataByID from '@/api/getGspreadDataByID';
import getGspreadList from '@/api/getGspreadList';
import processToSendEmail from '@/api/processToSendEmail';
import useSuccessDialog from './SuccessDialog';
import { SendConfirmDialog } from '@/components/emailForm/SendConfirmDialog';

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
  // gspread
  const [gspreadList, setGspreadList] = useState<GspreadIMetaDataType[] | null>(
    [],
  );
  const [targetGspreadData, setTargetGspreadData] =
    useState<GspreadIMetaDataType | null>();

  // send target
  const [targetAddressList, setTargetAddressList] = useState<
    Array<TargetAddressDataType | null>
  >([]);
  // cc
  const [ccList, setCcList] = useState<string[]>([]);
  const [newCc, setNewCc] = useState('');
  // subject and body
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  // file
  const [files, setFiles] = useState<File[]>([]);

  // form errors
  const [gspreadFormError, setGspreadFormError] = useState(false);
  const [subjectFormError, setSubjectFormError] = useState(false);
  const [bodyFormError, setBodyFormError] = useState(false);

  // dialog
  const [openSendConfirmDialog, setOpenSendConfirmDialog] = useState(false);
  const { SuccessDialog, showSuccessDialog } = useSuccessDialog();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getGspreadList();
      console.log(data);
      setGspreadList(data);
    };
    fetchData();
  }, []);

  // functions of gspread / address list
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
    if (targetGspreadData) setGspreadFormError(false);
  };

  // functions for cc
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

  // functions for subject
  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(event.target.value);
    if (subject) setSubjectFormError(false);
  };

  // functions for body
  const handleBodyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBody(event.target.value);
    if (body) setBodyFormError(false);
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
    let res = true;
    // スプレッドシートの選択チェック
    if (!targetGspreadData) {
      setGspreadFormError(true);
      res = false;
    }
    // 件名のチェック
    if (!subject.trim()) {
      setSubjectFormError(true);
      res = false;
    }
    // 本文のチェック
    if (!body.trim()) {
      setBodyFormError(true);
      res = false;
    }
    return res;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    console.log('メールを送信');
    setOpenSendConfirmDialog(true);
  };

  const sendEmail = () => {
    // ここで実際のメール送信処理を実装します
    const pushData = async () => {
      console.log(targetAddressList);
      console.log(subject);
      console.log(body);
      // ここでsendEmailのAPIを叩く処理を実装します
      const _file = files.length > 0 ? files[0] : null;
      await processToSendEmail(targetAddressList, ccList, subject, body, _file);
      // フォームのリセット
      setTargetGspreadData(null);
      setTargetAddressList([]);
      setCcList([]);
      setSubject('');
      setBody('');
      setFiles([]);
      // 送信完了ダイアログを表示
      showSuccessDialog();
    };
    console.log('メールを送信:', { targetAddressList, body, files });
    pushData();
    setOpenSendConfirmDialog(false);
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
        {
          // エラーメッセージ
          gspreadFormError ? (
            <FormHelperText sx={{ color: 'red', fontSize: '0.8rem' }}>
              対象スプレッドシートを選択してください
            </FormHelperText>
          ) : null
        }
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
        error={subjectFormError}
        helperText={subjectFormError ? '件名を入力してください' : ''}
      />

      <TextField
        id="body"
        label="本文"
        margin="normal"
        rows={15}
        value={body}
        fullWidth
        multiline
        onChange={handleBodyChange}
        error={bodyFormError}
        helperText={bodyFormError ? '本文を入力してください' : ''}
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

      <SuccessDialog />

      <SendConfirmDialog
        open={openSendConfirmDialog}
        targetAddressList={targetAddressList}
        ccList={ccList}
        subject={subject}
        body={body}
        files={files}
        onConfirm={sendEmail}
        onCancel={() => setOpenSendConfirmDialog(false)}
      />
    </Box>
  );
};

export default EmailForm;
