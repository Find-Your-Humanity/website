import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { apiKeyService, type ApiKey, type CreateApiKeyRequest } from '../services/apiKeyService';

const ApiKeysScreen: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyDescription, setNewKeyDescription] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [showSecretKey, setShowSecretKey] = useState<string | null>(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<{ api_key: string; secret_key: string } | null>(null);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      const keys = await apiKeyService.getApiKeys();
      setApiKeys(keys);
    } catch (error) {
      showSnackbar('API 키 목록을 불러오는데 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) {
      showSnackbar('API 키 이름을 입력해주세요.', 'error');
      return;
    }

    try {
      const data: CreateApiKeyRequest = { name: newKeyName.trim(), description: newKeyDescription.trim() || undefined };
      const result = await apiKeyService.createApiKey(data);
      setNewlyCreatedKey({ api_key: result.api_key, secret_key: result.secret_key });
      setOpenDialog(false);
      setNewKeyName('');
      setNewKeyDescription('');
      await loadApiKeys();
      showSnackbar('API 키가 성공적으로 생성되었습니다.', 'success');
    } catch (error: any) {
      showSnackbar(error?.message || 'API 키 생성에 실패했습니다.', 'error');
    }
  };

  const handleToggleApiKey = async (keyId: string, isActive: boolean) => {
    try {
      await apiKeyService.toggleApiKey(keyId, isActive);
      await loadApiKeys();
      showSnackbar(`API 키가 ${isActive ? '활성화' : '비활성화'}되었습니다.`, 'success');
    } catch (error: any) {
      showSnackbar(error?.message || 'API 키 상태 변경에 실패했습니다.', 'error');
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    if (!window.confirm('정말로 이 API 키를 삭제하시겠습니까?')) return;
    try {
      await apiKeyService.deleteApiKey(keyId);
      await loadApiKeys();
      showSnackbar('API 키가 삭제되었습니다.', 'success');
    } catch (error: any) {
      showSnackbar(error?.message || 'API 키 삭제에 실패했습니다.', 'error');
    }
  };

  const copyToClipboard = async (text: string, label = '복사되었습니다.') => {
    try {
      await navigator.clipboard.writeText(text);
      showSnackbar(label, 'success');
    } catch {
      showSnackbar('클립보드 복사에 실패했습니다.', 'error');
    }
  };

  return (
    <Box className="rc-container">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>API 키</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
          새 API 키 만들기
        </Button>
      </Box>

      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : apiKeys.length === 0 ? (
            <Alert severity="info">등록된 API 키가 없습니다. 새 API 키를 생성하세요.</Alert>
          ) : (
            <TableContainer component={Paper} className="rc-scroll-x rc-sticky-header">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>이름</TableCell>
                    <TableCell>Key ID</TableCell>
                    <TableCell>상태</TableCell>
                    <TableCell>생성일</TableCell>
                    <TableCell align="right">작업</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.key_id} hover>
                      <TableCell>{key.name}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <code>{key.key_id}</code>
                          <Tooltip title="Key ID 복사">
                            <IconButton size="small" onClick={() => copyToClipboard(key.key_id)}>
                              <CopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={key.is_active ? '활성' : '비활성'} color={key.is_active ? 'success' : 'default'} size="small" />
                      </TableCell>
                      <TableCell>{new Date(key.created_at).toLocaleString()}</TableCell>
                      <TableCell align="right">
                        <Tooltip title={key.is_active ? '비활성화' : '활성화'}>
                          <Switch
                            checked={key.is_active}
                            onChange={(_, v) => handleToggleApiKey(key.key_id, v)}
                          />
                        </Tooltip>
                        <Tooltip title="삭제">
                          <IconButton color="error" onClick={() => handleDeleteApiKey(key.key_id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* 새 API 키 생성 다이얼로그 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>새 API 키 만들기</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="이름"
            type="text"
            fullWidth
            variant="outlined"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="설명 (선택)"
            type="text"
            fullWidth
            variant="outlined"
            value={newKeyDescription}
            onChange={(e) => setNewKeyDescription(e.target.value)}
          />

          {newlyCreatedKey && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>발급된 키</Typography>
              <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ minWidth: 80 }}>API Key:</Typography>
                <code>{newlyCreatedKey.api_key}</code>
                <Tooltip title="API Key 복사">
                  <IconButton size="small" onClick={() => copyToClipboard(newlyCreatedKey.api_key)}>
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ minWidth: 80 }}>Secret:</Typography>
                <code>{showSecretKey === newlyCreatedKey.secret_key ? newlyCreatedKey.secret_key : '•'.repeat(12)}</code>
                <Tooltip title={showSecretKey === newlyCreatedKey.secret_key ? '숨기기' : '표시'}>
                  <IconButton size="small" onClick={() => setShowSecretKey((prev) => (prev ? null : newlyCreatedKey.secret_key))}>
                    {showSecretKey === newlyCreatedKey.secret_key ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Secret 복사">
                  <IconButton size="small" onClick={() => copyToClipboard(newlyCreatedKey.secret_key)}>
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Alert severity="warning" sx={{ mt: 1 }}>
                보안을 위해 Secret 키는 지금만 확인 가능합니다. 반드시 안전한 곳에 보관하세요.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>취소</Button>
          <Button onClick={handleCreateApiKey} variant="contained">생성</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ApiKeysScreen;
