import { useEffect, useState, useRef } from 'react';
import { chatAPI } from '../api';
import useAuthStore from '../store/authStore';
import { Link } from 'react-router-dom';
import './Chat.css';

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  
  // --- НОВЫЕ СОСТОЯНИЯ ДЛЯ ПОИСКА ---
  const [searchEmail, setSearchEmail] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;
    chatAPI.getChats()
      .then((r) => setChats(r.data?.results || r.data || []))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!activeChat) return;
    chatAPI.getMessages(activeChat).then((r) => {
      setMessages(r.data?.results || r.data || []);
    });
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- ФУНКЦИЯ ПОИСКА И СОЗДАНИЯ ЧАТА ---
  const handleSearchContact = async (e) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;
    
    setSearchLoading(true);
    try {
      // 1. Ищем пользователя по email
      // Убедись, что в api.js добавлен метод searchUserByEmail
      const res = await chatAPI.searchUserByEmail(searchEmail);
      const foundUser = res.data;

      if (foundUser && foundUser.id) {
        // 2. Создаем или получаем существующий чат
        const chatRes = await chatAPI.createChat({ 
          // Отправляем ID в зависимости от того, как ожидает твой бэкенд
          // Обычно это либо opponent_id, либо конкретно seller/buyer
          opponent_id: foundUser.id 
        });
        
        const newChat = chatRes.data;

        // 3. Проверяем, нет ли уже такого чата в списке
        const exists = chats.find(c => c.id === newChat.id);
        if (!exists) {
          setChats((prev) => [newChat, ...prev]);
        }
        
        setActiveChat(newChat.id);
        setSearchEmail('');
      }
    } catch (err) {
      console.error(err);
      alert("Пользователь с таким email не найден или произошла ошибка");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeChat) return;
    try {
      const { data } = await chatAPI.sendMessage({ chat: activeChat, text });
      setMessages((m) => [...m, data]);
      setText('');
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAuthenticated) return (
    <div className="container chat-empty">
      <p>🔒 Войдите, чтобы открыть чат</p>
      <Link to="/login" className="chat-login-btn">Войти</Link>
    </div>
  );

  return (
    <div className="container chat-page">
      <h1 className="chat-title">Чат</h1>
      <div className="chat-layout">
        
        <aside className="chat-sidebar">
          {/* --- ФОРМА ПОИСКА ПО EMAIL --- */}
          <form className="chat-search-form" onSubmit={handleSearchContact}>
            <input 
              type="email"
              placeholder="Найти по email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={searchLoading}>
              {searchLoading ? '...' : '+'}
            </button>
          </form>

          {loading ? (
            <p className="chat-loading">Загрузка...</p>
          ) : chats.length === 0 ? (
            <p className="chat-no-chats">Нет диалогов</p>
          ) : (
            <div className="chat-list">
              {chats.map((c) => (
                <button
                  key={c.id}
                  className={`chat-item ${activeChat === c.id ? 'active' : ''}`}
                  onClick={() => setActiveChat(c.id)}
                >
                  <div className="chat-item__avatar">
                    {(c.seller?.username || c.buyer?.username || 'U')[0].toUpperCase()}
                  </div>
                  <div className="chat-item__info">
                    <span className="chat-item__name">
                      {/* Показываем имя собеседника, а не своё */}
                      {c.seller?.id === user?.id ? c.buyer?.username : c.seller?.username || 'Пользователь'}
                    </span>
                    <span className="chat-item__last">{c.last_message || 'Нет сообщений'}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </aside>

        <div className="chat-window">
          {!activeChat ? (
            <div className="chat-window__empty">
              <p>💬</p>
              <p>Выберите диалог или введите email для поиска</p>
            </div>
          ) : (
            <>
              <div className="chat-messages">
                {messages.map((msg) => {
                  const isMine = msg.sender?.id === user?.id || msg.sender === user?.id;
                  return (
                    <div key={msg.id} className={`chat-msg ${isMine ? 'mine' : 'theirs'}`}>
                      <p className="chat-msg__text">{msg.text}</p>
                      <span className="chat-msg__time">
                        {new Date(msg.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <form className="chat-input-area" onSubmit={handleSend}>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Написать сообщение..."
                  className="chat-input"
                />
                <button type="submit" className="chat-send-btn">➤</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}