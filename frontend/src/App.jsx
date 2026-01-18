import './App.css'

function App() {

  return (
    <Router>
      <Route path="/" element={<Navigate to="/login" />} />
    </Router>
  )
}

export default App
