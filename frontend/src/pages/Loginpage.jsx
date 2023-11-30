import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { postApiHandler } from "../apiHandler/apiHandler";

const Loginpage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (values) => {
    const resp = await postApiHandler("/user/login", values);
    console.log("resp: ", resp);
    if (resp.status === 200) {
      localStorage.setItem("user", JSON.stringify(resp.data))
      localStorage.setItem("authorization", resp.data.token)  
      navigate("/");
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-center">
        <div className="w-50">
          <img src="assets/chat_login_signup.jpg" className="img-fluid" />
        </div>
        <div className="w-50 bg-white p-1">
          {/* <div className="border border-secondary border-2 rounded p-4"> */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-12 py-2 fw-bold fs-3">Chat</div>
              <div className="col-12 mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control border-secondary border-2"
                  id="email"
                  {...register("email")}
                />
              </div>
              <div className="col-12 mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control border-secondary border-2"
                  id="password"
                  {...register("password")}
                />
              </div>
              <div className="col-12 mb-3">
                <button className="btn btn-primary w-100" type="submit">
                  Login
                </button>
              </div>
              <div className="text-end">
                <Link to={"/signup"} className="">
                  Don't have an account? Signup...
                </Link>
              </div>
            </div>
          </form>
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default Loginpage;
