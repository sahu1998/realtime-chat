import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import { useForm } from "react-hook-form";
import { postApiHandler } from "../../apiHandler/apiHandler";

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const navigate = useNavigate();
  const { setUser } = ChatState();

  const submitHandler = async (values) => {
    setLoading(true);
console.log(values);
    if (!values.email || !values.password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    const resp = await postApiHandler("/user/login", values);
    console.log("resp: ", resp);
    if (resp.status === 200) {
      localStorage.setItem("user", JSON.stringify(resp.data));
      localStorage.setItem("authorization", resp.data.token);
      navigate("/");
    } else {
      toast({
        title: "Error Occured!",
        description: resp.data.error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <VStack spacing="10px">
        <FormControl id="login_email" isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            placeholder="Enter Your Email Address"
            autoComplete="current-email"
            {...register("email")}
          />
        </FormControl>
        <FormControl id="login_password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter password"
              {...register("password")}
              autoComplete="current-password"
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          type="submit"
          isLoading={loading}
        >
          Login
        </Button>
      </VStack>
    </form>
  );
};

export default Login;
