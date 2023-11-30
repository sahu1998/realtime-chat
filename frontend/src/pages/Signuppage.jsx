import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postApiHandler } from "../apiHandler/apiHandler";
import { toast } from "react-toastify";
const schema = yup.object().shape({
  name: yup
    .string()
    .required("*Name is required")
    .matches(/^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$/, "*Use only alphabats"),
  email: yup
    .string()
    .matches(
      /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/,
      "*Incorrect Email"
    )
    .required("*Email is required"),
  password: yup
    .string()
    .required("*Password is required")
    .min(8, "*Minimum 8 characters "),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});
const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const onSubmit = async (values) => {
    console.log("values: ", values);
    const { name, email, password, image } = values;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", image[0]);
    const resp = await postApiHandler("/user/register", formData);
    if (resp.status === 201) {
      navigate("/login")
    }
    console.log("resp: ", resp);
  };
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
              <div className="col-12 mb-2">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control border-secondary border-2"
                  id="name"
                  {...register("name")}
                />
              </div>
              <div className="col-12 mb-2">
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
              <div className="col-12 mb-2">
                <label htmlFor="image" className="form-label">
                  Image
                </label>
                <input
                  type="file"
                  className="form-control border-secondary border-2"
                  id="image"
                  {...register("image")}
                />
              </div>

              <div className="col-12 mb-2">
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
              <div className="col-12 mb-2">
                <label htmlFor="confirm-password" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control border-secondary border-2"
                  id="confirm-password"
                  {...register("confirmPassword")}
                />
              </div>
              <div className="col-12 mb-2">
                <button className="btn btn-primary w-100" type="submit">
                  Signup
                </button>
              </div>
              <div className="text-end">
                <Link to={"/login"} className="">
                  Already have an account? Login...
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

export default SignupPage;
