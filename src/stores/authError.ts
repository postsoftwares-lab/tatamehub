import { ref } from 'vue'

const _showModal = ref(false)

export function useAuthError() {
  function showModal() {
    _showModal.value = true
  }

  function hideModal() {
    _showModal.value = false
  }

  return {
    showModal: () => _showModal.value,
    open: showModal,
    close: hideModal,
  }
}

export function triggerAuthError() {
  const { open } = useAuthError()
  open()
}

export function isAuthErrorModalOpen() {
  return _showModal
}
