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
} from '@mui/material';
import { Visibility, Reply } from '@mui/icons-material';
import { adminService, type ContactRequest } from '../services/adminService';

const RequestsScreen: React.FC = () => {
  const [rows, setRows] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 문의사항 상세보기/답변 관련 상태
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [replyText, setReplyText] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await adminService.getContactRequests();
        if (resp.success) {
          setRows(resp.data.data);
        } else {
          setError((resp as any).message || '요청 목록을 불러오지 못했습니다.');
        }
      } catch (e: any) {
        setError(e?.message || '요청 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // 문의사항 상세보기 핸들러
  const handleViewDetail = (request: ContactRequest) => {
    setSelectedRequest(request);
    setDetailDialogOpen(true);
  };

  // 답변 다이얼로그 열기
  const handleReply = (request: ContactRequest) => {
    setSelectedRequest(request);
    setReplyText('');
    setReplyDialogOpen(true);
  };

  // 답변 전송
  const handleSendReply = async () => {
    if (!selectedRequest || !replyText.trim()) return;
    
    try {
      const resp = await adminService.replyToContactRequest(selectedRequest.id, replyText);
      if (resp.success) {
        // 목록 새로고침
        const requestsResp = await adminService.getContactRequests();
        if (requestsResp.success) {
          setRows(requestsResp.data.data);
        }
        setReplyDialogOpen(false);
        setSelectedRequest(null);
        setReplyText('');
      } else {
        setError(resp.error || '답변 전송에 실패했습니다.');
      }
    } catch (e: any) {
      setError(e?.message || '답변 전송에 실패했습니다.');
    }
  };

  // 상태 업데이트
  const handleStatusUpdate = async (requestId: number, newStatus: string) => {
    try {
      const resp = await adminService.updateContactRequestStatus(requestId, newStatus);
      if (resp.success) {
        // 목록 새로고침
        const requestsResp = await adminService.getContactRequests();
        if (requestsResp.success) {
          setRows(requestsResp.data.data);
        }
      } else {
        setError(resp.error || '상태 업데이트에 실패했습니다.');
      }
    } catch (e: any) {
      setError(e?.message || '상태 업데이트에 실패했습니다.');
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>요청사항</Typography>
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : rows.length === 0 ? (
            <Alert severity="info">표시할 요청이 없습니다.</Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>사용자</TableCell>
                    <TableCell>제목</TableCell>
                    <TableCell>상태</TableCell>
                    <TableCell>생성 시각</TableCell>
                    <TableCell>액션</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((r: ContactRequest, idx: number) => (
                    <TableRow key={r.id || idx} hover>
                      <TableCell>{r.id || '-'}</TableCell>
                      <TableCell>{r.user_email || '-'}</TableCell>
                      <TableCell>{r.subject || '-'}</TableCell>
                      <TableCell>
                        <Chip 
                          size="small" 
                          color={
                            r.status === 'resolved' ? 'success' : 
                            r.status === 'in_progress' ? 'warning' : 
                            'default'
                          } 
                          label={r.status === 'unread' ? '미읽음' : r.status === 'in_progress' ? '진행중' : '해결됨'} 
                        />
                      </TableCell>
                      <TableCell>{r.created_at ? new Date(r.created_at).toLocaleString() : '-'}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewDetail(r)}
                          color="primary"
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleReply(r)}
                          color="secondary"
                        >
                          <Reply />
                        </IconButton>
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
        <DialogTitle>문의사항 상세보기</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">ID</Typography>
                <Typography variant="body1">{selectedRequest.id}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">사용자</Typography>
                <Typography variant="body1">{selectedRequest.user_email}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">제목</Typography>
                <Typography variant="body1">{selectedRequest.subject}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">내용</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedRequest.message}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">상태</Typography>
                <Chip 
                  size="small" 
                  color={
                    selectedRequest.status === 'resolved' ? 'success' : 
                    selectedRequest.status === 'in_progress' ? 'warning' : 
                    'default'
                  } 
                  label={selectedRequest.status === 'unread' ? '미읽음' : selectedRequest.status === 'in_progress' ? '진행중' : '해결됨'} 
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">생성 시각</Typography>
                <Typography variant="body1">
                  {selectedRequest.created_at ? new Date(selectedRequest.created_at).toLocaleString() : '-'}
                </Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">상태 변경</Typography>
                <FormControl size="small" sx={{ minWidth: 150, mt: 1 }}>
                  <InputLabel>상태</InputLabel>
                  <Select
                    value={statusUpdate}
                    label="상태"
                    onChange={(e) => setStatusUpdate(e.target.value)}
                  >
                    <MenuItem value="unread">미읽음</MenuItem>
                    <MenuItem value="in_progress">진행중</MenuItem>
                    <MenuItem value="resolved">해결됨</MenuItem>
                  </Select>
                </FormControl>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ ml: 2 }}
                  onClick={() => {
                    if (statusUpdate && selectedRequest) {
                      handleStatusUpdate(selectedRequest.id, statusUpdate);
                      setStatusUpdate('');
                    }
                  }}
                >
                  상태 변경
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>

      {/* 답변 다이얼로그 */}
      <Dialog open={replyDialogOpen} onClose={() => setReplyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>문의사항 답변</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">문의사항</Typography>
                <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 1, borderRadius: 1 }}>
                  {selectedRequest.subject}
                </Typography>
              </Box>
              <TextField
                label="답변 내용"
                multiline
                rows={6}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                fullWidth
                placeholder="답변 내용을 입력하세요..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialogOpen(false)}>취소</Button>
          <Button 
            onClick={handleSendReply} 
            variant="contained"
            disabled={!replyText.trim()}
          >
            답변 전송
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequestsScreen;
