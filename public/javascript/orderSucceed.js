const token = localStorage.getItem('token')
const orderId = document.querySelector('#orderId').innerHTML
axios({
  method: 'PUT',
  url: `/api/order/updateOrder/${orderId}`,
  headers: {
    Authorization: `Bearer ${token}`
  }
})
axios({
  method: 'GET',
  url: '/api/users/userAccountData',
  headers: {
    Authorization: `Bearer ${token}`
  }
})
.then(data => {
  const { email, password } = data.data.result
  axios({
    method: 'POST',
    url: '/users/login/orderBack',
    data: { email, password }
  })
})