const loadTab = async (tab) => {
  return new Promise((resolve) => {
    const listener = (tabId, changeInfo) => {
      if (tabId === tab.id && changeInfo.status === "complete") {
        chrome.tabs.onUpdated.removeListener(listener)
        resolve();
      }
    }
    chrome.tabs.onUpdated.addListener(listener)
  })
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getEbNo = () => {
  const ebNo = document.querySelector('#ebNo');
  return ebNo.value;
}

document.getElementById("scrape").addEventListener("click", async () => {
  const ebNo = getEbNo();
  if (!ebNo) {
    alert('Please enter ebNo');
    return;
  }

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const url =
    "https://exiamfw.home.oocl.com/auth/realms/oocl-prd/protocol/openid-connect/auth?response_type=code&scope=openid&client_id=moc-app-instant&redirect_uri=https://moc.oocl.com/admin/partymenu/pm_main.ssov2?ENTRY%3DMCC%26ENTRY_TYPE%3DOOCL&login_hint=mandy@sfyf.cn";

  // Load URL
  await chrome.tabs.update(tab.id, { url });

  // Wait for tab to load
  await loadTab(tab);

  // Action Login
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async () => {
      try {
        console.log('Action Login....');
        const password = document.querySelector('#password');
        if (password) {
          password.value = 'Fanyuan2025@';
          password.dispatchEvent(new Event('input', { bubbles: true }));
          password.dispatchEvent(new Event('change', { bubbles: true }));
          const loginBtn = document.querySelector('#kc-login');
          await delay(1000);
          await loginBtn.click();
        }
        return true;
      } catch (error) {
        console.error("Error login in the page", error);
      }
    },
  });
  await delay(5000);

  // Redirect to search EIR
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async () => {
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      // Close popup cookie
      try {
        console.log('Action in the page....');
        const cookieEl = document.querySelector('.font-moc mochp-footer').shadowRoot.querySelector('mochp-cookie-notice').shadowRoot.querySelector('mochp-cookie-notice-dialog .cookie-footer .cookie-save');
        console.log('cookieEl', cookieEl);
        if (cookieEl) cookieEl.click();
        await delay(1000);
  
        // Action in the page
        const eirTab = document.querySelector('.font-moc mochp-header').shadowRoot.querySelector('#mochp-header mochp-app-tabs').shadowRoot.querySelector('.mochp-menu-tab-list .mochp-menu-tab-wrapper:nth-child(3) .mochp-menu-item:nth-child(3) p.mochp-menu-item-app-name');
        console.log('eirTab', eirTab);
        if (eirTab) eirTab.click();
        return true;    
      } catch (error) {
        console.error("Error redirect to search EIR in the page", error);
      }
    },
  });
  await delay(5000);

  // Search EIR
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async () => {
      try {
        console.log('ebNo', ebNo);
        const inputEl = document.querySelector('input[id="form:searchBookingNumberID"]');
        console.log('inputEl', inputEl);
        if (inputEl) {
          inputEl.value = ebNo;
          inputEl.dispatchEvent(new Event('input', { bubbles: true }));
          inputEl.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Click the search button
        const searchBtn = document.querySelector('input[id="form:buttonSearchByBooking"]');
        if (searchBtn) searchBtn.click();
        return true;
      } catch (error) {
        console.error("Error search EIR in the page", error);
      }
    },
  });

  // try {
  //   await chrome.tabs.sendMessage(tab.id, {
  //     type: "AUTO_LOGIN",
  //     tabId: tab.id,
  //   });
  // } catch (e) {
  //   console.error("❌ content script chưa inject", e);
  // }
});