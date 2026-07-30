import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="p-4 text-center text-primary">نظام البقالات</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
