let showModal;

export const setVersionModalHandler = (handler) => {
  showModal = handler;
};

export const versionModalHandler = (message) => {
  if (showModal) {
    showModal(message);
  }
};