import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// كاشف أخطاء رئيسي (Error Boundary) لالتقاط أي خطأ في التطبيق
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: '20px', textAlign: 'center', fontFamily: 'Cairo'}}>
          <h2 style={{color: '#DC2626'}}>⚠️ خطأ في التطبيق</h2>
          <p style={{color: '#1F2937'}}>حدث خطأ أثناء تحميل التطبيق. يرجى التحقق من الـ Console أو إرسال هذه الرسالة للمطور.</p>
          <pre style={{background: '#f4f4f4', padding: '10px', borderRadius: '8px', textAlign: 'left', direction: 'ltr'}}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
