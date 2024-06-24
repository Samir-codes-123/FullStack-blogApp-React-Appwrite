import { logout } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import authService from "./appwrite/auth";

function LogoutBtn() {
  const dispatch = useDispatch(); // to logout and change ui
  const logoutHandler = () => {
    authService
      .logout() // delete session
      .then(() => {
        // it is a promise
        dispatch(logout()); // state update onclick
      })
      .catch((error) => {
        throw error;
      });
  };

  return (
    <button
      className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
