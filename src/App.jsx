import { useEffect, useState } from "react";
import "./App.css";
import { useDispatch } from "react-redux";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { Footer, Header } from "./components";

function App() {
  const [loading, setLoading] = useState(true); // to show loading till the data of user is not fetched from appwrite
  const dispatch = useDispatch();

  useEffect(() => {
    authService // auth object
      .getCurrentUser() // auth function call
      .then((userData) => {
        if (userData)
          dispatch(login({ userData })); // if userdata is present set data
        else dispatch(logout()); // if not then null
      })
      .finally(() => setLoading(false)); // disable loading
  }, []); // work after the website is render

  //condtional rendering
  return !loading ? (
    <div className="min-h-screen flex flex-wrap content-between bg-gray-800">
      <div className="w-full block">
        <Header />
        <main>Todo: {/*Outlet*/}</main>
        <Footer />
      </div>
    </div>
  ) : (
    <h1>Loading....</h1> // add later css
  );
}

export default App;
