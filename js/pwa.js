"use strict";

let deferredInstallPrompt = null;

function isStandaloneDisplayMode() {
  return window.matchMedia?.('(display-mode: standalone)').matches === true
    || window.matchMedia?.('(display-mode: fullscreen)').matches === true
    || window.navigator.standalone === true;
}

function isTouchBrowser() {
  return (navigator.maxTouchPoints || 0) > 0
    || window.matchMedia?.('(pointer: coarse)').matches === true;
}

function updateFullscreenButton() {
  const button = document.querySelector('#fullscreen-button');
  if (!button) return;
  button.hidden = !isTouchBrowser() || isStandaloneDisplayMode();
  document.documentElement.classList.toggle('standalone-mode', isStandaloneDisplayMode());
}

function showInstallHelp() {
  const help = document.querySelector('#install-help');
  if (!help) return;
  help.hidden = false;
  document.querySelector('#install-help-close')?.focus();
}

function hideInstallHelp() {
  const help = document.querySelector('#install-help');
  if (!help) return;
  help.hidden = true;
  document.querySelector('#fullscreen-button')?.focus();
}

async function requestAppFullscreen() {
  if (isStandaloneDisplayMode()) return;

  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice.catch(() => null);
    deferredInstallPrompt = null;
    updateFullscreenButton();
    return;
  }

  const root = document.documentElement;
  const requestFullscreen = root.requestFullscreen || root.webkitRequestFullscreen;
  if (typeof requestFullscreen === 'function') {
    try {
      await requestFullscreen.call(root);
      updateFullscreenButton();
      return;
    } catch (error) {
      console.warn('Browser fullscreen request was declined.', error);
    }
  }

  showInstallHelp();
}

function setupFullscreenInstallUi() {
  updateFullscreenButton();
  document.querySelector('#fullscreen-button')?.addEventListener('click', requestAppFullscreen);
  document.querySelector('#install-help-close')?.addEventListener('click', hideInstallHelp);
  document.querySelector('#install-help')?.addEventListener('click', (event) => {
    if (event.target.id === 'install-help') hideInstallHelp();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.querySelector('#install-help')?.hidden === false) {
      hideInstallHelp();
    }
  });
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    updateFullscreenButton();
  });
  window.addEventListener('appinstalled', updateFullscreenButton);
  document.addEventListener('fullscreenchange', updateFullscreenButton);
  document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
  window.matchMedia?.('(display-mode: standalone)').addEventListener?.('change', updateFullscreenButton);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupFullscreenInstallUi, { once: true });
} else {
  setupFullscreenInstallUi();
}

if ('serviceWorker' in navigator && /^https?:$/.test(window.location.protocol)) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch((error) => {
      console.warn('PWA service worker registration failed.', error);
    });
  });
}
