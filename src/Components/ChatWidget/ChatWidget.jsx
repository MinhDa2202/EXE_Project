import React, { useState, useRef, useEffect } from 'react';

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const toggleChat = () => {
    setOpen(!open);
    if (!open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      from: 'user',
      text: input,
      timestamp: getCurrentTime(),
      id: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('https://localhost:7235/api/Ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });

      const data = await res.json();
      
      let aiReply;
      
      // Xử lý response từ Gemini AI
      if (data && data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          aiReply = candidate.content.parts[0].text;
        } else {
          aiReply = 'Không nhận được phản hồi từ AI.';
        }
      } else {
        aiReply = 'Không nhận được phản hồi từ AI.';
      }
      
      if (!aiReply || aiReply.trim() === '') {
        aiReply = JSON.stringify(data, null, 2);
      }

      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          from: 'ai',
          text: aiReply,
          timestamp: getCurrentTime(),
          id: Date.now() + 1
        }]);
      }, 1000);

    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          from: 'ai',
          text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
          timestamp: getCurrentTime(),
          id: Date.now() + 1
        }]);
      }, 1000);
    }
  };

  return (
    <>
      {open && (
        <div className="chat-widget" style={{
          position: 'fixed',
          bottom: 90,
          right: 20,
          width: 420,
          height: 600,
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 8px 25px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'chatSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          zIndex: 9999,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          {/* Header với thông tin hỗ trợ */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: 40,
                height: 40,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                🎧
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '2px' }}>
                  Hỗ trợ khách hàng
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  opacity: 0.9,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    background: isOnline ? '#10b981' : '#ef4444',
                    borderRadius: '50%',
                    boxShadow: `0 0 0 2px rgba(${isOnline ? '16, 185, 129' : '239, 68, 68'}, 0.3)`
                  }}></div>
                  {isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
                </div>
              </div>
            </div>
            <button
              onClick={toggleChat}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#fff',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            >
              ×
            </button>
          </div>

          {/* Khu vực hiển thị tin nhắn */}
          <div style={{
            flex: 1,
            padding: '24px 20px',
            overflowY: 'auto',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            scrollBehavior: 'smooth'
          }}>
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: '#fff',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>👋</div>
                <div style={{
                  color: '#2d3748',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Chào mừng đến với Recloop Mart!
                </div>
                <div style={{
                  color: '#64748b',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  Tôi có thể hỗ trợ bạn đăng tin bán, tìm kiếm sản phẩm<br />
                  và hướng dẫn giao dịch an toàn. Hãy nhắn tin cho tôi nhé!
                </div>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={msg.id || idx} style={{
                display: 'flex',
                marginBottom: 20,
                justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
                animation: 'messageSlideIn 0.3s ease-out'
              }}>
                {msg.from === 'ai' && (
                  <div style={{
                    width: 36,
                    height: 36,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    marginRight: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '700',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                  }}>
                    🤖
                  </div>
                )}
                
                <div style={{ maxWidth: '75%' }}>
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: msg.from === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                    background: msg.from === 'user'
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : '#fff',
                    color: msg.from === 'user' ? '#fff' : '#2d3748',
                    fontSize: '15px',
                    lineHeight: '1.5',
                    boxShadow: msg.from === 'user'
                      ? '0 4px 16px rgba(102, 126, 234, 0.3)'
                      : '0 4px 16px rgba(0, 0, 0, 0.08)',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    border: msg.from === 'ai' ? '1px solid #e2e8f0' : 'none',
                    position: 'relative'
                  }}>
                    {msg.text}
                  </div>
                  
                  {/* Timestamp */}
                  {msg.timestamp && (
                    <div style={{
                      fontSize: '11px',
                      color: '#94a3b8',
                      marginTop: '6px',
                      textAlign: msg.from === 'user' ? 'right' : 'left',
                      paddingLeft: msg.from === 'ai' ? '8px' : '0',
                      paddingRight: msg.from === 'user' ? '8px' : '0'
                    }}>
                      {msg.timestamp}
                    </div>
                  )}
                </div>
                
                {msg.from === 'user' && (
                  <div style={{
                    width: 36,
                    height: 36,
                    background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
                    borderRadius: '50%',
                    marginLeft: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4a5568',
                    fontSize: '16px',
                    fontWeight: '600',
                    flexShrink: 0,
                    border: '2px solid #fff',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    👤
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div style={{
                display: 'flex',
                marginBottom: 20,
                justifyContent: 'flex-start',
                animation: 'messageSlideIn 0.3s ease-out'
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  marginRight: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '700',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}>
                  🤖
                </div>
                <div style={{
                  padding: '14px 18px',
                  borderRadius: '20px 20px 20px 6px',
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    background: '#94a3b8',
                    borderRadius: '50%',
                    animation: 'typingDot 1.4s infinite ease-in-out'
                  }}></div>
                  <div style={{
                    width: 8,
                    height: 8,
                    background: '#94a3b8',
                    borderRadius: '50%',
                    animation: 'typingDot 1.4s infinite ease-in-out 0.2s'
                  }}></div>
                  <div style={{
                    width: 8,
                    height: 8,
                    background: '#94a3b8',
                    borderRadius: '50%',
                    animation: 'typingDot 1.4s infinite ease-in-out 0.4s'
                  }}></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Khu vực nhập liệu */}
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid #e2e8f0',
            background: '#fff',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px'
          }}>
            <form onSubmit={sendMessage} style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '12px',
              position: 'relative'
            }}>
              <div style={{
                flex: 1,
                position: 'relative',
                background: '#f8fafc',
                borderRadius: '24px',
                border: '2px solid #e2e8f0',
                transition: 'all 0.3s ease',
                ...(input.trim() ? {
                  borderColor: '#667eea',
                  background: '#fff',
                  boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                } : {})
              }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhắn tin cho chúng tôi..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(e);
                    }
                  }}
                  disabled={isTyping}
                  style={{
                    width: '100%',
                    minHeight: '20px',
                    maxHeight: '120px',
                    padding: '14px 50px 14px 18px',
                    border: 'none',
                    borderRadius: '24px',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    background: 'transparent',
                    outline: 'none',
                    resize: 'none',
                    lineHeight: '1.4',
                    color: '#2d3748',
                    overflow: 'hidden'
                  }}
                  rows={1}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                  }}
                />
                
                {/* Send button integrated into input */}
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: 'none',
                    background: input.trim() && !isTyping 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : '#e2e8f0',
                    color: input.trim() && !isTyping ? '#fff' : '#94a3b8',
                    cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    boxShadow: input.trim() && !isTyping 
                      ? '0 4px 12px rgba(102, 126, 234, 0.3)' 
                      : 'none',
                    ...(input.trim() && !isTyping ? {
                      ':hover': {
                        transform: 'translateY(-50%) scale(1.05)',
                        boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)'
                      }
                    } : {})
                  }}
                  onMouseEnter={(e) => {
                    if (input.trim() && !isTyping) {
                      e.target.style.transform = 'translateY(-50%) scale(1.05)';
                      e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(-50%)';
                    if (input.trim() && !isTyping) {
                      e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                    }
                  }}
                >
                  {isTyping ? (
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #94a3b8',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                  )}
                </button>
              </div>
            </form>
            
            {/* Quick suggestions */}
            {messages.length === 0 && (
              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '12px',
                flexWrap: 'wrap'
              }}>
                {['Cách đăng tin bán', 'Liên hệ người bán', 'An toàn giao dịch'].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(suggestion)}
                    style={{
                      padding: '6px 12px',
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      fontSize: '12px',
                      color: '#64748b',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#e2e8f0';
                      e.target.style.color = '#475569';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#f1f5f9';
                      e.target.style.color = '#64748b';
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        className="chat-button"
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 12px 24px rgba(102, 126, 234, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.3)';
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" fill="#fff" viewBox="0 0 24 24">
          <path d="M12 3C6.48 3 2 6.97 2 12c0 1.86.63 3.58 1.69 5L2 21l4.34-1.38C8.42 20.37 10.16 21 12 21c5.52 0 10-3.97 10-9s-4.48-9-10-9z"/>
        </svg>
      </button>

      <style>{`
        @keyframes chatSlideIn {
          from { 
            opacity: 0; 
            transform: translateY(40px) scale(0.9);
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes messageSlideIn {
          from { 
            opacity: 0; 
            transform: translateY(10px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        
        @keyframes typingDot {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        /* Responsive styles */
        @media (max-width: 480px) {
          .chat-widget {
            width: calc(100vw - 20px) !important;
            height: calc(100vh - 100px) !important;
            bottom: 80px !important;
            right: 10px !important;
            left: 10px !important;
            border-radius: 16px !important;
          }
          
          .chat-button {
            width: 56px !important;
            height: 56px !important;
            bottom: 16px !important;
            right: 16px !important;
          }
          
          .chat-header {
            padding: 16px 20px !important;
          }
          
          .chat-messages {
            padding: 20px 16px !important;
          }
          
          .chat-input-area {
            padding: 16px 20px !important;
          }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;
