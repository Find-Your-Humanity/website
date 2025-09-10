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
    try {
      // 사용자 입력값 또는 자동 생성된 이름/설명 사용
      const timestamp = new Date().toLocaleString('ko-KR');
      const data: CreateApiKeyRequest = { 
        name: newKeyName.trim() || `API Key ${timestamp}`, 
        description: newKeyDescription.trim() || `자동 생성된 API 키 - ${timestamp}` 
      };
      const result = await apiKeyService.createApiKey(data);
      setNewlyCreatedKey({ api_key: result.api_key, secret_key: result.secret_key });
      await loadApiKeys();
      showSnackbar('API 키가 성공적으로 생성되었습니다!', 'success');
    } catch (error: any) {
      showSnackbar(error?.message || 'API 키 생성에 실패했습니다.', 'error');
    }
  };

  const handleOpenDialog = () => {
    setNewlyCreatedKey(null); // 이전 키 정보 초기화
    setShowSecretKey(null); // 비밀 키 표시 상태도 초기화
    setNewKeyName(''); // 이름 입력 필드 초기화
    setNewKeyDescription(''); // 설명 입력 필드 초기화
    setOpenDialog(true);
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
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
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
      <Dialog 
        open={openDialog} 
        onClose={() => {
          setOpenDialog(false);
          setNewlyCreatedKey(null);
          setShowSecretKey(null);
          setNewKeyName('');
          setNewKeyDescription('');
        }} 
        fullWidth 
        maxWidth="sm"
      >
        <DialogTitle>새 API 키 만들기</DialogTitle>
        <DialogContent>
          {!newlyCreatedKey && (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="API 키 이름"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="예: 프로덕션 API 키, 테스트용 키"
                sx={{ mb: 3 }}
                helperText="API 키를 구분하기 위한 이름을 입력하세요"
              />
              <TextField
                fullWidth
                label="설명 (선택사항)"
                value={newKeyDescription}
                onChange={(e) => setNewKeyDescription(e.target.value)}
                placeholder="예: 웹사이트 메인 페이지용, 모바일 앱용"
                multiline
                rows={3}
                helperText="API 키의 용도나 목적을 설명하세요"
              />
            </Box>
          )}
          {newlyCreatedKey && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                  Public Key (공개 키)
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'grey.50', 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      flex: 1,
                      wordBreak: 'break-all'
                    }}
                  >
                    {newlyCreatedKey.api_key}
                  </Typography>
                  <Tooltip title="공개 키 복사">
                    <IconButton 
                      size="small" 
                      onClick={() => copyToClipboard(newlyCreatedKey.api_key)}
                      sx={{ 
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' }
                      }}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                  Secret Key (비밀 키)
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'error.50', 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'error.200',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      flex: 1,
                      wordBreak: 'break-all'
                    }}
                  >
                    {showSecretKey === newlyCreatedKey.secret_key ? newlyCreatedKey.secret_key : '•'.repeat(32)}
                  </Typography>
                  <Tooltip title={showSecretKey === newlyCreatedKey.secret_key ? '비밀 키 숨기기' : '비밀 키 표시'}>
                    <IconButton 
                      size="small" 
                      onClick={() => setShowSecretKey((prev) => (prev ? null : newlyCreatedKey.secret_key))}
                      sx={{ 
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' }
                      }}
                    >
                      {showSecretKey === newlyCreatedKey.secret_key ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="비밀 키 복사">
                    <IconButton 
                      size="small" 
                      onClick={() => copyToClipboard(newlyCreatedKey.secret_key)}
                      sx={{ 
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' }
                      }}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Alert 
                severity="warning" 
                sx={{ 
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    fontSize: '1.2rem'
                  }
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  ⚠️ 중요: 비밀 키는 지금만 확인 가능합니다!
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  반드시 안전한 곳에 보관하고, 절대 공개하지 마세요.
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          background: 'white',
          mx: 2,
          mb: 2,
          borderRadius: 2,
          justifyContent: 'center',
          gap: 2
        }}>
          <Button 
            onClick={() => {
              setOpenDialog(false);
              setNewlyCreatedKey(null);
              setShowSecretKey(null);
              setNewKeyName('');
              setNewKeyDescription('');
            }}
            variant="outlined"
            sx={{
              minWidth: 120,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            취소
          </Button>
          {newlyCreatedKey ? (
            <Button 
              onClick={() => {
                setOpenDialog(false);
                setNewlyCreatedKey(null);
                setShowSecretKey(null);
                setNewKeyName('');
                setNewKeyDescription('');
              }} 
              variant="contained"
              sx={{
                minWidth: 120,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #4caf50 30%, #45a049 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #45a049 30%, #3d8b40 90%)',
                }
              }}
            >
              완료
            </Button>
          ) : (
            <Button 
              onClick={handleCreateApiKey} 
              variant="contained"
              sx={{
                minWidth: 120,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2196f3 30%, #1976d2 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976d2 30%, #1565c0 90%)',
                }
              }}
            >
              생성하기
            </Button>
          )}
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
