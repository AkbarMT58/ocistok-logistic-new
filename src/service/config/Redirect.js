import { Navigate } from "react-router-dom";

const Redirect = (path) => {
  //return redirect(path);

  return  <Navigate to="/dashboard" replace={true} />

  
};


export default Redirect;
