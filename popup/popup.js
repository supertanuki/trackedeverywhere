parseStats = () => {
  const stats = localStorage.getItem('stats');
  return null === stats ? {} : JSON.parse(stats);
}

showStats = () => {
  const stats = parseStats();

  const statssElement = document.getElementById('stats');
  while (statssElement.firstChild) {
    statssElement.removeChild(statssElement.firstChild);
  }

  const ul = document.createElement('ul');

  for (let originHost in stats) {
    console.log([originHost, stats[originHost]]);

    const li = document.createElement('li');
    li.appendChild(document.createTextNode(originHost));
    const subUl = document.createElement('ul');

    for (let index in stats[originHost]) {
      const subLi = document.createElement('li');
      subLi.appendChild(document.createTextNode(stats[originHost][index]));
      subUl.appendChild(subLi);
    }

    li.appendChild(subUl);
  }

  statssElement.appendChild(ul);
};

start = () => {
  chrome.runtime.sendMessage({ action: 'start' });

  hide(startButton);
  show(stopButton);
  show(analysisInProgressMessage);
  localStorage.setItem('analysisStarted', '1');
}

stop = () => {
  chrome.runtime.sendMessage({ action: 'stop' });

  hide(stopButton);
  show(startButton);
  hide(analysisInProgressMessage);
  clearInterval(statsInterval);
  localStorage.removeItem('analysisStarted');
}

reset = () => {
  if (!confirm(translate('resetConfirmation'))) {
    return;
  }

  localStorage.removeItem('stats');
  hide(statsElement);
  showStats();
  hide(resetButton);
}

init = () => {
  if (null === localStorage.getItem('stats')) {
    hide(resetButton);
  } else {
    show(resetButton);
  }

  showStats();

  if (null === localStorage.getItem('analysisStarted')) {
    return;
  }

  start();
  statsInterval = setInterval(showStats, 2000);
}

translate = (translationKey) => {
  return chrome.i18n.getMessage(translationKey);
}

translateText = (target, translationKey) => {
  target.appendChild(document.createTextNode(translate(translationKey)));
}

translateHref = (target, translationKey) => {
  target.href = chrome.i18n.getMessage(translationKey);
}

hide = element => element.classList.add('hidden');
show = element => element.classList.remove('hidden');

const analysisInProgressMessage = document.getElementById('analysisInProgressMessage');

const statsElement = document.getElementById('stats');

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', start);

const stopButton = document.getElementById('stopButton');
stopButton.addEventListener('click', stop);

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', reset);

document.querySelectorAll('[translate]').forEach(function(element) {
  translateText(element, element.getAttribute('translate'));
});

document.querySelectorAll('[translate-href]').forEach(function(element) {
  translateHref(element, element.getAttribute('translate-href'));
});

init();
