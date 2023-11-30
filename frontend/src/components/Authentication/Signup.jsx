import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postApiHandler } from "../../apiHandler/apiHandler";
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
  // confirmPassword: yup
  //   .string()
  //   .oneOf([yup.ref("password"), null], "Passwords must match"),
});
const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const history = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitHandler = async (values) => {
    const { name, email, password, image } = values;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", image[0]);
    const response = await postApiHandler("/user/register", formData);
    console.log(response);
    if (response.status === 201) {
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("authorization", response.data.token)
      history("/");
    } else {
      toast({
        title: "Error Occured!",
        description: response.data.error,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <VStack spacing="5px">
        <FormControl id="first-name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input placeholder="Enter Your Name" {...register("name")} />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            placeholder="Enter Your Email Address"
            {...register("email")}
          />
        </FormControl>
        <FormControl id="register_password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter Password"
              {...register("password")}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="register_confirm_password" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={show ? "text" : "password"}
              placeholder="Confirm password"
              {...register("confirmPassword")}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="pic">
          <FormLabel>Upload your Picture</FormLabel>
          <Input type="file" p={1.5} accept="image/*" {...register("image")} />
        </FormControl>
        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          type="submit"
        >
          Sign Up
        </Button>
      </VStack>
    </form>
  );
};

export default Signup;
