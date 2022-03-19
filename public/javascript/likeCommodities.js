document.addEventListener('click', event => {
  const target = event.target
  const commodityID = target.dataset.id
  if (target.matches('.addCart')) {
    axios.post(`/cart/${commodityID}`)
    .then(()=> {
      target.classList.remove('addCart')
      target.innerHTML = '<i class="fas fa-shopping-cart mr-1"></i>已加入'
    })	
  } else if (target.matches('.fa-shopping-cart')) {
    axios.post(`/cart/${commodityID}`)
    .then(()=> {
      target.parentElement.classList.remove('addCart')
      target.parentElement.innerHTML = '<i class="fas fa-shopping-cart mr-1"></i>已加入'
    })
  }
})