document.addEventListener('click', event => {
  const target = event.target
  const commodityID = target.dataset.id
  if (target.matches('.removeLike')) {
    axios.post(`/commodity/like/${commodityID}?_method=DELETE`)
    .then(()=> {
        target.innerHTML = `<i class="fas fa-heart mr-1" data-id="${commodityID}"></i>加入最愛`
        target.classList.remove('btn-secondary', 'removeLike')
        target.classList.add('btn-danger', 'addLike')
    })
  } else if (target.matches('.fa-heart-broken')) {
    axios.post(`/commodity/like/${commodityID}?_method=DELETE`)
    .then(()=> {
        target.parentElement.classList.remove('btn-secondary', 'removeLike')
        target.parentElement.classList.add('btn-danger', 'addLike')
        target.parentElement.innerHTML = `<i class="fas fa-heart mr-1" data-id="${commodityID}"></i>加入最愛`
    })
  } else if (target.matches('.addLike')) {
    axios.post(`/commodity/like/${commodityID}?`)
    .then(()=> {
      target.innerHTML = `<i class="fas fa-heart-broken mr-1" data-id="${commodityID}"></i>移除最愛`
      target.classList.remove('btn-danger', 'addLike')
      target.classList.add('btn-secondary', 'removeLike')
    })
  } else if (target.matches('.fa-heart')) {
    axios.post(`/commodity/like/${commodityID}?`)
    .then(()=> {
      target.parentElement.classList.remove('btn-danger', 'addLike')
      target.parentElement.classList.add('btn-secondary', 'removeLike')
      target.parentElement.innerHTML = `<i class="fas fa-heart-broken mr-1" data-id="${commodityID}"></i>移除最愛`
    })
  } else if (target.matches('.addCart')) {
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