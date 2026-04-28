import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addressAPI, ordersAPI } from '../api';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import './Checkout.css';

const STEPS = ['Адрес', 'Доставка', 'Подтверждение'];

export default function Checkout() {
  const [step, setStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({ city: '', street: '', house: '', apartment: '' });
  const [delivery, setDelivery] = useState('standard');
  const [loading, setLoading] = useState(false);

  const { items, fetchCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    fetchCart();
    addressAPI.getAll().then((r) => {
      const list = r.data?.results || r.data || [];
      setAddresses(list);
      if (list.length > 0) setSelectedAddress(list[0].id);
    });
  }, [isAuthenticated]);

  const totalPrice = items.reduce((acc, item) => {
    const price = item.product?.price || 0;
    const discount = item.product?.discount || 0;
    return acc + Math.round(price * (1 - discount / 100)) * item.quantity;
  }, 0);

  const deliveryCost = delivery === 'express' ? 299 : delivery === 'pickup' ? 0 : 149;

  const handleAddAddress = async () => {
    if (!newAddress.city || !newAddress.street) { toast.error('Заполните обязательные поля'); return; }
    try {
      const { data } = await addressAPI.create({
        ...newAddress,
        full_address: `${newAddress.city}, ${newAddress.street}, ${newAddress.house}${newAddress.apartment ? ', кв. ' + newAddress.apartment : ''}`,
      });
      setAddresses((a) => [...a, data]);
      setSelectedAddress(data.id);
      toast.success('Адрес добавлен');
    } catch {
      toast.error('Ошибка добавления адреса');
    }
  };

  const handleOrder = async () => {
    if (!selectedAddress) { toast.error('Выберите адрес'); return; }
    setLoading(true);
    try {
      const { data } = await ordersAPI.create({
        address: selectedAddress,
        delivery_type: delivery,
        items: items.map((i) => ({ product: i.product.id, quantity: i.quantity })),
      });
      toast.success('Заказ оформлен!');
      navigate(`/orders/${data.id}`);
    } catch {
      toast.error('Ошибка оформления заказа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container checkout">
      <h1 className="checkout__title">Оформление заказа</h1>

      {/* STEPPER */}
      <div className="stepper">
        {STEPS.map((s, i) => (
          <div key={s} className={`stepper__step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <div className="stepper__circle">{i < step ? '✓' : i + 1}</div>
            <span className="stepper__label">{s}</span>
            {i < STEPS.length - 1 && <div className="stepper__line" />}
          </div>
        ))}
      </div>

      <div className="checkout__layout">
        <div className="checkout__main">

          {/* STEP 0: ADDRESS */}
          {step === 0 && (
            <div className="checkout__section">
              <h2>Адрес доставки</h2>
              {addresses.map((addr) => (
                <label key={addr.id} className={`address-option ${selectedAddress === addr.id ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress === addr.id}
                    onChange={() => setSelectedAddress(addr.id)}
                  />
                  <span>{addr.full_address || `${addr.city}, ${addr.street}, ${addr.house}`}</span>
                </label>
              ))}

              <div className="new-address">
                <h3>Новый адрес</h3>
                <div className="new-address__grid">
                  {[
                    ['city', 'Город *'],
                    ['street', 'Улица *'],
                    ['house', 'Дом'],
                    ['apartment', 'Квартира'],
                  ].map(([field, label]) => (
                    <input
                      key={field}
                      placeholder={label}
                      value={newAddress[field]}
                      onChange={(e) => setNewAddress({ ...newAddress, [field]: e.target.value })}
                      className="checkout__input"
                    />
                  ))}
                </div>
                <button className="checkout__add-addr-btn" onClick={handleAddAddress}>
                  + Добавить адрес
                </button>
              </div>

              <button
                className="checkout__next-btn"
                onClick={() => { if (!selectedAddress) { toast.error('Выберите адрес'); return; } setStep(1); }}
              >
                Далее →
              </button>
            </div>
          )}

          {/* STEP 1: DELIVERY */}
          {step === 1 && (
            <div className="checkout__section">
              <h2>Способ доставки</h2>
              {[
                { value: 'standard', label: 'Стандартная', desc: '3–5 дней', price: '149 ₽' },
                { value: 'express', label: 'Экспресс', desc: '1–2 дня', price: '299 ₽' },
                { value: 'pickup', label: 'Самовывоз', desc: 'Из пункта выдачи', price: 'Бесплатно' },
              ].map((opt) => (
                <label key={opt.value} className={`delivery-option ${delivery === opt.value ? 'active' : ''}`}>
                  <input type="radio" name="delivery" value={opt.value} checked={delivery === opt.value} onChange={() => setDelivery(opt.value)} />
                  <div className="delivery-option__info">
                    <strong>{opt.label}</strong>
                    <span>{opt.desc}</span>
                  </div>
                  <span className="delivery-option__price">{opt.price}</span>
                </label>
              ))}

              <div className="checkout__btns">
                <button className="checkout__back-btn" onClick={() => setStep(0)}>← Назад</button>
                <button className="checkout__next-btn" onClick={() => setStep(2)}>Далее →</button>
              </div>
            </div>
          )}

          {/* STEP 2: CONFIRM */}
          {step === 2 && (
            <div className="checkout__section">
              <h2>Подтверждение заказа</h2>
              <div className="confirm-items">
                {items.map((item) => (
                  <div key={item.id} className="confirm-item">
                    <img src={item.product?.image || '/placeholder.png'} alt={item.product?.name} />
                    <span className="confirm-item__name">{item.product?.name}</span>
                    <span className="confirm-item__qty">× {item.quantity}</span>
                    <span className="confirm-item__price">
                      {(Math.round(item.product?.price * (1 - (item.product?.discount || 0) / 100)) * item.quantity).toLocaleString()} ₽
                    </span>
                  </div>
                ))}
              </div>

              <div className="checkout__btns">
                <button className="checkout__back-btn" onClick={() => setStep(1)}>← Назад</button>
                <button className="checkout__submit-btn" onClick={handleOrder} disabled={loading}>
                  {loading ? 'Оформляем...' : '✓ Оформить заказ'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR SUMMARY */}
        <div className="checkout__sidebar">
          <h3>Ваш заказ</h3>
          <div className="checkout__sidebar-rows">
            <div className="checkout__sidebar-row"><span>Товары</span><span>{totalPrice.toLocaleString()} ₽</span></div>
            <div className="checkout__sidebar-row"><span>Доставка</span><span>{deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} ₽`}</span></div>
          </div>
          <div className="checkout__sidebar-total">
            <span>Итого</span>
            <span>{(totalPrice + deliveryCost).toLocaleString()} ₽</span>
          </div>
        </div>
      </div>
    </div>
  );
}
