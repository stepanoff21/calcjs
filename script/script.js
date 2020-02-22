'use strict';

const DAY_STRING = ['день', 'дня', 'дней'];

const DATA = {
  whichSite: ['landing', 'multiPage', 'onlineStore'],
  price: [4000, 8000, 26000],
  desktopTemplates: [50, 40, 30],
  adapt: 20,
  mobileTemplates: 15,
  editable: 10,
  metrikaYandex: [500, 1000, 2000],
  analyticsGoogle: [850, 1350, 3000],
  sendOrder: 500,
  deadlineDay: [[2, 7], [3, 10], [7, 14]],
  deadlinePercent: [20, 17, 15]
};

const startButton = document.querySelector('.start-button'),
  firstScreen = document.querySelector('.first-screen'),
  mainForm = document.querySelector('.main-form'),
  formCalculate = document.querySelector('.form-calculate'),
  endButton = document.querySelector('.end-button'),
  total = document.querySelector('.total'),
  fastRange = document.querySelector('.fast-range'),
  totalPriceSum = document.querySelector('.total_price__sum'),
  desktopTemplates = document.getElementById('desktopTemplates'),
  adapt = document.getElementById('adapt'),
  mobileTemplates = document.getElementById('mobileTemplates'),
  editable = document.getElementById('editable'),
  desktopTemplatesValue = document.querySelector('.desktopTemplates_value'),
  adaptValue = document.querySelector('.adapt_value'),
  mobileTemplatesValue = document.querySelector('.mobileTemplates_value'),
  editableValue = document.querySelector('.editable_value'),
  typeSite = document.querySelector('.type-site'),
  maxDeadline = document.querySelector('.max-deadline'),
  rangeDeadline = document.querySelector('.range-deadline'),
  deadlineValue = document.querySelector('.deadline-value'),
  calcDescription = document.querySelector('.calc-description'),
  metrikaYandex = document.getElementById('metrikaYandex'),
  analyticsGoogle = document.getElementById('analyticsGoogle'),
  sendOrder = document.getElementById('sendOrder'),
  cardHead = document.querySelector('.card-head'),
  totalPrice = document.querySelector('.total_price'),
  firstFieldset = document.querySelector('.first-fieldset');  

const declOfNum = (n, titles) => n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ?
  0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];

const showElem = elem => elem.style.display = 'block';

const hideElem = elem => elem.style.display = 'none';

const dopOptionsString = (yandex, google, order) => {
  let str = '';

  if (yandex || google || order) {
    str += 'Подключим';

    if (yandex) {
      str += ' Яндекс Метрику';
      if (google && order) {
        str += ', Гугл Аналитику и отправку заявок на почту.';
        return str;
      }
      if (google || order) {
        str += ' и';
      }
    }

    if (google) {
      str += ' Гугл Аналитику';
      if (order) {
        str += ' и';
      }
    }

    if (order) {
      str += ' отправку заявок на почту';
    }
    str += '.';
  }

  return str;
};

const renderTextContent = (total, site, maxDay, minDay) => {
  totalPriceSum.textContent = total;
  typeSite.textContent = site;
  maxDeadline.textContent = declOfNum(maxDay, DAY_STRING);
  rangeDeadline.min = minDay;
  rangeDeadline.max = maxDay;
  deadlineValue.textContent = declOfNum(rangeDeadline.value, DAY_STRING);

  desktopTemplatesValue.textContent = desktopTemplates.checked ? 'Да' : 'Нет';
  adaptValue.textContent = adapt.checked ? 'Да' : 'Нет';
  mobileTemplatesValue.textContent = mobileTemplates.checked ? 'Да' : 'Нет';
  editableValue.textContent = editable.checked ? 'Да' : 'Нет';

  calcDescription.textContent = `
  Сделаем ${site}${adapt.checked ?
    ', адаптированный под мобильные устройства и планшеты' : ''}.
  ${editable.checked ? `Установим панель админстратора,
    чтобы вы могли самостоятельно менять содержание на сайте без разработчика.` : ''}
    ${dopOptionsString(metrikaYandex.checked, analyticsGoogle.checked, sendOrder.checked)}
  `;
};

const priceCalculation = (elem = {}) => {
  const {
    whichSite: wSite,
    price,
    deadlineDay,
    deadlinePercent
  } = DATA;

  let result = 0,
      index = 0,
      options = [],
      site = '',
      maxDeadlineDay = deadlineDay[index][1],
      minDeadlineDay = deadlineDay[index][0],
      overPercent = 0;

  if (elem.name === 'whichSite') {
    for (const item of formCalculate.elements) {
      if (item.type === 'checkbox') {
        item.checked = false;
      }
    }
    hideElem(fastRange);
  }

  for (const item of formCalculate.elements) {
    if (item.name === 'whichSite' && item.checked) {
      index = wSite.indexOf(item.value);
      site = item.dataset.site;
      maxDeadlineDay = deadlineDay[index][1];
      minDeadlineDay = deadlineDay[index][0];
    } else if (item.classList.contains('calc-handler') && item.checked) {
      options.push(item.value);
    } else if (item.classList.contains('want-faster') && item.checked) {
      const overDay = maxDeadlineDay - rangeDeadline.value;
      overPercent = overDay * (deadlinePercent[index] / 100);
    }
  }

  result += price[index];

  options.forEach(function(key) {
    if (typeof(DATA[key]) === 'number') {
      if (key === 'sendOrder') {
        result += DATA[key];
      } else {
        result += price[index] * DATA[key] / 100;
      }
    } else {
      if (key === 'desktopTemplates') {
        result += price[index] * DATA[key][index] / 100;
      } else {
        result += DATA[key][index];
      }
    }
  });

  result += result * overPercent;

  renderTextContent(result, site, maxDeadlineDay, minDeadlineDay);
};

const handlerCallBackForm = event => {
  const target = event.target;

  if (adapt.checked) {
    mobileTemplates.disabled = false;
  } else {
    mobileTemplates.disabled = true;
    mobileTemplates.checked = false;
  }

  if (target.classList.contains('want-faster')) {
    target.checked ? showElem(fastRange) : hideElem(fastRange);
    priceCalculation(target);
  }

  if (target.classList.contains('calc-handler')) {
    priceCalculation(target);
  }
};

const moveBackTotal = () => {
  if (document.documentElement.getBoundingClientRect().bottom > document.documentElement.clientHeight + 200) {
    totalPrice.classList.remove('totalPriceBottom');
    firstFieldset.after(totalPrice);
    window.removeEventListener('scroll', moveBackTotal);
    window.addEventListener('scroll', moveTotal);
  }
};

const moveTotal = () => {
  if (document.documentElement.getBoundingClientRect().bottom < document.documentElement.clientHeight + 200) {
    totalPrice.classList.add('totalPriceBottom');
    endButton.before(totalPrice);
    window.removeEventListener('scroll', moveTotal);
    window.addEventListener('scroll', moveBackTotal);
  }
};

const renderResponse = response => {
  if (response.ok) {
    hideElem(total);
    cardHead.textContent = 'Заявка на разработку сайта была отправлена, мы скоро с вами свяжемся!';
  }
};

startButton.addEventListener('click', () => {
  showElem(mainForm);
  hideElem(firstScreen);
  window.addEventListener('scroll', moveTotal);
});

endButton.addEventListener('click', () => {
  for (const elem of formCalculate.elements) {
    if (elem.tagName === 'FIELDSET') {
      hideElem(elem);
    }
  }

  cardHead.textContent = 'Заявка на разработку сайта';

  hideElem(totalPrice);

  showElem(total);
});

formCalculate.addEventListener('change', handlerCallBackForm);

formCalculate.addEventListener('submit', event => {
  event.preventDefault();

  const data = new FormData(event.target);

  fetch('server.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    body: data,
  }).then(renderResponse).catch(error => console.log(error));
});

priceCalculation();