import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Coinpage from "./pages/Coinpage";
import Homepage from "./pages/Homepage";
import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Route path="/" component={Homepage} exact />
        <Route path="/coins/:id" component={Coinpage} />
      </div>
    </BrowserRouter>
  );
}

export default App;
