const googleHosts = [
  'www.google-analytics.com',
  'www.googletagmanager.com',
  'www.gstatic.com',
  'ajax.googleapis.com',
  'googletagservices.com',
  'pay.google.com',
  'play.google.com',
  'news.google.com'
];

extractHostname = (url) => {
  let hostname = url.indexOf("//") > -1 ? url.split('/')[2] : url.split('/')[0];
  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];

  return hostname;
};

addHost = (originHost, host) => {
  if (!originHost) {
    return;
  }

  const stats = localStorage.getItem('stats');
  const statsJson = null === stats ? {} : JSON.parse(stats);

  if (undefined === statsJson[originHost]) {
    statsJson[originHost] = [];
  }

  console.log([originHost, host]);

  if (googleHosts.includes(host) && !statsJson[originHost].includes(host)) {
    statsJson[originHost].push(host);
  }

  console.log(statsJson);

  localStorage.setItem('stats', JSON.stringify(statsJson));
};

isChrome = () => {
  return (typeof(browser) === 'undefined');
};

headersReceivedListener = (requestDetails) => {
  const originHost = extractHostname(requestDetails.originUrl);
  const host = extractHostname(requestDetails.url);

  addHost(originHost, host);

  return {};
};

setBrowserIcon = (type) => {
  chrome.browserAction.setIcon({path: `icons/icon-${type}-48.png`});
};

handleMessage = (request) => {
  if ('start' === request.action) {
    setBrowserIcon('on');

    chrome.webRequest.onHeadersReceived.addListener(
      headersReceivedListener,
      {urls: ['<all_urls>']},
      ['responseHeaders']
    );

    return;
  }

  if ('stop' === request.action) {
    setBrowserIcon('off');
    chrome.webRequest.onHeadersReceived.removeListener(headersReceivedListener);
  }
};

chrome.runtime.onMessage.addListener(handleMessage);
