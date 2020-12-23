import Api from './main/Api';


const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3010"
    : "http://193.110.3.88:3010";
const shop = document.querySelector('.shop');
const cardArr = shop.querySelectorAll('.shop-card');
const cards = shop.querySelector('.shop-cards');
const name = shop.querySelector('.shop-header__name')
const userData = JSON.parse(localStorage.getItem("userData"));
const api = new Api('http://localhost:3010', userData?.token);
const starsQuantity = shop.querySelector('.shop__stars-quantity span');
const form = shop.querySelector('form');
const popup = shop.querySelector('.shop-popup');
let id;

const createCard = (data) => {
    const dis = data.quantity < 1 ? 'disabled' : '';
    let pattern;
    return pattern = `<div style="${data.quantity < 1 ? 'border: none': ''}" class="shop-card"  id="${data._id}">
        <div class="shop-card__back" style="${data.quantity < 1 ? 'display: flex;' : 'display: none;'}">РАСКУПЛЕНО</div>
        <div class="shop-card__wrapper">
            <div class="shop-card__name">${data.name}</div>
            <div class="shop-card__desc">${data.description}</div>
            <div class="shop-card__quan">Осталось: <span> ${data.quantity}</span>шт.</div>
        </div>
        <div class="shop-card__wrapper">
            <div class="shop-card__cost">${data.cost + '*'}</div>
            <button ${dis} class="shop-card__choose">Купить</button>
        </div>
    </div>`;
} 


shop.addEventListener('click', (e) => {
  if(e.target.classList.contains('shop-card__choose')) {
    id = e.target.closest('.shop-card').id;
    popup.classList.add('shop-popup_on');
    console.log(document.getElementById(`${id}`).querySelector('.shop-card__quan span').textContent)
  }
  if(e.target.classList.contains('shop-popup__close')) {
    popup.classList.remove('shop-popup_on');
    form.querySelector(".form__server-error").textContent = '';
    form.elements.address.value = '';
  }
  if(e.target.classList.contains('shop-header__out')) {
    localStorage.removeItem("userData");
    window.location.reload();
  }

})

form.addEventListener('submit', (e) => {
  api.buyGift(form.elements.name.value, form.elements.address.value, id)
    .then((res) => {
      if(res.ok) {
        form.querySelector(".form__server-success").textContent = 'Покупка прошла успешно!';
      }
      return res.json();
    })
    .then((data) => {
      const stars = shop.querySelector('.shop__stars-quantity span');
      if(data.error) {
        form.querySelector(".form__server-error").textContent = data.error;
      } else {
        document.getElementById(`${id}`).querySelector('.shop-card__quan span').textContent = data.giftsQuantity;
        stars.textContent = data.starsToSpendQuantity;
      }
      
    })
    .catch((err) => {
      form.querySelector(".form__server-error").textContent = err;
    })
    e.preventDefault();
})

api
  .getUser()
  .then((res) => {
    if (res.ok) {

    }
    if (res.status === 500) {
      throw new Error("Ошибка на сервере");
    }
    if (res.status === 404) {
      throw new Error("Ошибка 404");
    }
    if (res.status === 401) {
      throw new Error("Требуется аутентификация");
    }
    return res.json();
  })
  .then((data) => {
    name.textContent = data.user.name;
    starsQuantity.textContent = data.user.starsToSpendQuantity;
    localStorage.setItem(
      "userData",
      JSON.stringify({
        ...userData,
        starsToGiftQuantity: data.user.starsToGiftQuantity,
      })
    );
  })
  .catch((err) => {
    
  });

api.getAllGifts()
  .then((res) => {
    if (res.ok) {

    }
    if (res.status === 500) {
      throw new Error("Ошибка на сервере");
    }
    if (res.status === 404) {
      throw new Error("Ошибка 404");
    }
    if (res.status === 401) {
      throw new Error("Требуется аутентификация");
    }
    return res.json();
  })
  .then((gifts) => {
      gifts.map((gift) => {
        cards.insertAdjacentHTML('beforeend', createCard(gift))
      })
  })
