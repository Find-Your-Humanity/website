// 입력값 검증 유틸리티

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return '이메일을 입력해주세요.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return '올바른 이메일 형식이 아닙니다.';
  return '';
}

export function validateUsername(username) {
  if (!username || typeof username !== 'string') return '사용자명을 입력해주세요.';
  if (username.length < 3) return '사용자명은 3자 이상이어야 합니다.';
  const re = /^[a-zA-Z0-9_.-]+$/;
  if (!re.test(username)) return '사용자명은 영문, 숫자, _, ., - 만 사용할 수 있습니다.';
  return '';
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') return '비밀번호를 입력해주세요.';
  if (password.length < 4) return '비밀번호는 4자 이상이어야 합니다.';
  return '';
}

export function validateContact(contact) {
  if (!contact || typeof contact !== 'string') return '연락처를 입력해주세요.';
  const digits = contact.replace(/[^0-9]/g, '');
  if (digits.length < 10 || digits.length > 11) return '연락처는 숫자 10~11자리여야 합니다.';
  return '';
}

export function validateSignupForm({ email, username, password, confirmPassword, contact }) {
  const errors = {
    email: validateEmail(email),
    username: validateUsername(username),
    password: validatePassword(password),
    confirmPassword: '',
    contact: validateContact(contact),
  };

  if (!confirmPassword) {
    errors.confirmPassword = '비밀번호 확인을 입력해주세요.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
  }

  // 빈 에러만 제거하지 않고 그대로 반환해 UI에서 표시
  return errors;
}

export function hasErrors(errors) {
  return Object.values(errors).some((msg) => !!msg);
}
