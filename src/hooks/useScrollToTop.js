import { useEffect } from 'react';

/**
 * 페이지 이동 시 스크롤을 맨 위로 올리는 훅
 * @param {boolean} enabled - 훅 활성화 여부 (기본값: true)
 */
const useScrollToTop = (enabled = true) => {
  useEffect(() => {
    if (enabled) {
      window.scrollTo(0, 0);
    }
  }, [enabled]);
};

export default useScrollToTop; 