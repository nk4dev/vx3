import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useSearchParams,
} from "react-router-dom";
import "./App.css";
import Auth from "./components/Auth";
import "./components/Auth.css";

// Home component

// main router component
function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Auth />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
