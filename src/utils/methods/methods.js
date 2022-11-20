export function cutString(str, limit) {
  if (typeof str !== 'string') {
    throw new TypeError('Argument must be of type string');
  }
  if (str.length <= limit) return str;

  let text = str.trim().slice(0, limit);
  const lastSpace = text.lastIndexOf(' ');
  if (lastSpace > 0) {
    text = text.substring(0, lastSpace);
  }
  return `${text}...`;
}

export function colorPicker(num) {
  const match = { 0: '#E90000', 3: '#E97E00', 5: '#E9D100', 7: '#66E900' };
  if (num >= 0 && num <= 3) return match[0];
  if (num >= 3 && num <= 5) return match[3];
  if (num >= 5 && num <= 7) return match[5];
  if (num >= 7) return match[7];
  return match[0];
}

export const AlertMessage = {
  error: { message: 'Ошибка при запросе.', description: 'Проверьте сетевое подключение.' },
  info: { message: 'По вашему запросу ничего не найдено.', description: 'Попробуйте изменить ваш запрос.' },
};

export const cookie = {
  get(name) {
    const matches = document.cookie.match(
      new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`)
    );
    return matches.length ? decodeURIComponent(matches[1]) : false;
  },

  set(name, value, expires) {
    const date = new Date(expires).toUTCString();
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; expires=${date}`;
  },
};
