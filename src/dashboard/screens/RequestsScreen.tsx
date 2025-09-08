import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Tabs,
  Tab,
  Snackbar,
} from '@mui/material';
import { 
  Visibility, 
  Edit, 
  Email, 
  Phone,
  AttachFile,
  Download
} from '@mui/icons-material';
import { adminService, type ContactRequest } from '../services/adminService';

const RequestsScreen: React.FC = () => {
  const [rows, setRows] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 탭 상태 관리
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [totalCounts, setTotalCounts] = useState({
    all: 0,
    unread: 0,
    in_progress: 0,
    resolved: 0
  });
  
  // 문의사항 상세보기/답변 관련 상태
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [replyText, setReplyText] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');
  
  // 알림 상태
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  // 데이터 로딩 함수
  const loadContacts = async (statusFilter?: string) => {
    try {
      setLoading(true);
      setError(null);
      const resp = await adminService.getContactRequests();
      if (resp.success) {
        const allContacts = resp.data.data;
        
        // 상태별 필터링
        let filteredContacts = allContacts;
        if (statusFilter && statusFilter !== 'all') {
          filteredContacts = allContacts.filter(contact => contact.status === statusFilter);
        }
        
        setRows(filteredContacts);
        
        // 상태별 카운트 계산
        setTotalCounts({
          all: allContacts.length,
          unread: allContacts.filter(c => c.status === 'unread').length,
          in_progress: allContacts.filter(c => c.status === 'in_progress').length,
          resolved: allContacts.filter(c => c.status === 'resolved').length
        });
      } else {
        setError((resp as any).message || '요청 목록을 불러오지 못했습니다.');
      }
    } catch (e: any) {
      setError(e?.message || '요청 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts(currentTab);
  }, [currentTab]);

  // 탭 변경 핸들러
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  // 문의사항 상세보기 핸들러
  const handleViewDetail = (request: ContactRequest) => {
    setSelectedRequest(request);
    setDetailDialogOpen(true);
  };

  // 답변/상태변경 다이얼로그 열기
  const handleReply = (request: ContactRequest) => {
    setSelectedRequest(request);
    setReplyText(request.admin_response || '');
    setStatusUpdate(request.status);
    setReplyDialogOpen(true);
  };

  // 답변/상태 업데이트
  const handleUpdateContact = async () => {
    if (!selectedRequest) return;
    
    try {
      // 답변과 상태를 함께 업데이트
      const resp = await adminService.updateContactRequest(
        selectedRequest.id,
        statusUpdate,
        replyText
      );
      
      if (resp.success) {
        showSnackbar('문의사항이 업데이트되었습니다.', 'success');
        setReplyDialogOpen(false);
        setSelectedRequest(null);
        setReplyText('');
        setStatusUpdate('');
        // 목록 새로고침
        loadContacts(currentTab);
      } else {
        showSnackbar('업데이트에 실패했습니다.', 'error');
      }
    } catch (e: any) {
      showSnackbar('업데이트 중 오류가 발생했습니다.', 'error');
    }
  };

  // 스낵바 표시
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        📧 요청사항 관리
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 탭 메뉴 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label={`전체 (${totalCounts.all})`} value="all" />
            <Tab label="읽지 않음" value="unread" />
            <Tab label="처리 중" value="in_progress" />
            <Tab label="해결됨" value="resolved" />
          </Tabs>
        </CardContent>
      </Card>

      {/* 문의사항 테이블 */}
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : rows.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">
                문의사항이 없습니다.
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>제목</TableCell>
                    <TableCell>연락처</TableCell>
                    <TableCell>이메일</TableCell>
                    <TableCell>상태</TableCell>
                    <TableCell>처리자</TableCell>
                    <TableCell>접수일</TableCell>
                    <TableCell align="center">작업</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((contact) => (
                    <TableRow key={contact.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {contact.subject}
                          </Typography>
                          {contact.attachment_filename && (
                            <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                              <AttachFile fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                {contact.attachment_filename}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Phone fontSize="small" color="action" />
                          <Typography variant="body2">{contact.contact || '-'}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Email fontSize="small" color="action" />
                          <Typography variant="body2">{contact.user_email || '-'}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          size="small" 
                          color={
                            contact.status === 'resolved' ? 'success' : 
                            contact.status === 'in_progress' ? 'warning' : 
                            'error'
                          } 
                          label={
                            contact.status === 'unread' ? '읽지 않음' : 
                            contact.status === 'in_progress' ? '처리 중' : 
                            '해결됨'
                          } 
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {contact.admin_username || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {contact.created_at ? new Date(contact.created_at).toLocaleString('ko-KR') : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetail(contact)}
                          color="info"
                          title="상세보기"
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleReply(contact)}
                          color="primary"
                          title="답변/상태 변경"
                        >
                          <Edit />
                        </IconButton>
                        {contact.attachment_filename && (
                          <IconButton
                            size="small"
                            color="secondary"
                            title="첨부파일 다운로드"
                          >
                            <Download />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* 문의사항 상세보기 다이얼로그 */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          📧 문의사항 상세보기
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedRequest.subject}
              </Typography>
              
              <Box display="flex" gap={2} mb={2}>
                <Chip icon={<Email />} label={selectedRequest.user_email} variant="outlined" />
                <Chip icon={<Phone />} label={selectedRequest.contact || '-'} variant="outlined" />
                <Chip 
                  size="small" 
                  color={
                    selectedRequest.status === 'resolved' ? 'success' : 
                    selectedRequest.status === 'in_progress' ? 'warning' : 
                    'error'
                  } 
                  label={
                    selectedRequest.status === 'unread' ? '읽지 않음' : 
                    selectedRequest.status === 'in_progress' ? '처리 중' : 
                    '해결됨'
                  } 
                />
              </Box>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                접수일: {selectedRequest.created_at ? new Date(selectedRequest.created_at).toLocaleString('ko-KR') : '-'}
              </Typography>

              {selectedRequest.attachment_filename && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  첨부파일: {selectedRequest.attachment_filename}
                </Typography>
              )}

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                문의 내용:
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedRequest.message}
                </Typography>
              </Paper>

              {selectedRequest.admin_response && (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    관리자 답변:
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                      {selectedRequest.admin_response}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      답변자: {selectedRequest.admin_username || '관리자'} | {selectedRequest.updated_at ? new Date(selectedRequest.updated_at).toLocaleString('ko-KR') : '-'}
                    </Typography>
                  </Paper>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>

      {/* 답변/상태 변경 다이얼로그 */}
      <Dialog open={replyDialogOpen} onClose={() => setReplyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          ✏️ 문의사항 답변 및 상태 변경
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>상태</InputLabel>
              <Select
                value={statusUpdate}
                onChange={(e) => setStatusUpdate(e.target.value)}
                label="상태"
              >
                <MenuItem value="unread">읽지 않음</MenuItem>
                <MenuItem value="in_progress">처리 중</MenuItem>
                <MenuItem value="resolved">해결됨</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="관리자 답변"
              multiline
              rows={6}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              margin="normal"
              helperText="고객에게 전달할 답변을 작성하세요."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialogOpen(false)}>취소</Button>
          <Button onClick={handleUpdateContact} variant="contained">
            저장
          </Button>
        </DialogActions>
      </Dialog>

      {/* 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RequestsScreen;
