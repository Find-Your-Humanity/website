import { apiClient } from './apiClient';

// 문서 업데이트
export const updateDocument = async (language, documentType, markdownContent) => {
  try {
    const response = await apiClient.post('/api/admin/documents/update', {
      language,
      document_type: documentType,
      content: markdownContent
    });
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error('문서 업데이트 실패');
    }
  } catch (error) {
    console.error('문서 업데이트 오류:', error);
    throw error;
  }
};

// 문서 조회
export const getDocument = async (language, documentType) => {
  try {
    const response = await apiClient.get(`/api/admin/documents/${language}/${documentType}`);
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error('문서 조회 실패');
    }
  } catch (error) {
    console.error('문서 조회 오류:', error);
    throw error;
  }
};

// 문서 목록 조회
export const listDocuments = async (language = null) => {
  try {
    const params = language ? { language } : {};
    const response = await apiClient.get('/api/admin/documents', { params });
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error('문서 목록 조회 실패');
    }
  } catch (error) {
    console.error('문서 목록 조회 오류:', error);
    throw error;
  }
};

// 문서 서비스 상태 확인
export const checkDocumentsHealth = async () => {
  try {
    const response = await apiClient.get('/api/admin/documents/health');
    return response.data;
  } catch (error) {
    console.error('문서 서비스 상태 확인 오류:', error);
    throw error;
  }
}; 