export function initModal() {
  const modal = document.getElementById('helpModal')
  const btn = document.getElementById('helpButton')

  const open = () => {
    modal.style.display = 'block'
  }
  const span = document.getElementsByClassName('modal-close')[0]
  btn.onclick = () => {
    open()
  }
  open()

  span.onclick = () => {
    modal.style.display = 'none'
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none'
    }
  }
}
