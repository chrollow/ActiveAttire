import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import auth from "../../assets/images/auth.png";
import { Link } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../components/Spinner";
import Checkbox from "@mui/material/Checkbox";
import SeoData from "../../SEO/SeoData";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import GoogleIcon from "@mui/icons-material/Google";
import backgroundImage from "../../assets/images/banner.png";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../components/googleSignIn/config";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    password: Yup.string()
      .min(5, "Password must be at least 5 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    address: Yup.string().required("Address is required"),
    isSeller: Yup.boolean(),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/register`,
        values
      );
      const user = userCredential.user;

      if (response.status === 201) {
        toast.success("User Registered Successfully! Please Login...");
        resetForm();
        navigate("/login");
      } else if (response.status === 200) {
        toast.error("Email is already registered! Please Login...");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong! Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SeoData
        title="Sign up - New User"
        description="Register new user with details"
      />
      {isSubmitting ? (
        <Spinner />
      ) : (
        <div className="container bg-primaryBg mt-5 sm:mt-0 md:mt-0 lg:mt-0 py-[2px]">
          <div className="flex items-center flex-col sm:flex-row md:flex-row lg:flex-row my-10 bg bg-white rounded-xl shadow-lg w-full h-[600px]">
            {/* Left Section */}
            <div
              className="flex flex-col w-full h-full bg-center bg-no-repeat bg-cover gap-y-10 rounded-tl-xl rounded-bl-xl"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            ></div>

            {/* Form Section */}
            <div className="flex flex-col w-full p-5 h-900 gap-y-10">
              <Formik
                initialValues={{
                  name: "",
                  email: "",
                  phone: "",
                  password: "",
                  confirmPassword: "",
                  address: "",
                  isSeller: false,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form className="w-[90%] mx-auto transition-all">
                    <div className="pt-3 space-y-4 text-base leading-6 text-gray-700 sm:text-lg sm:leading-7">
                      {/* Name Field */}
                      <div className="relative">
                        <Field
                          type="text"
                          name="name"
                          className="w-full h-6 text-sm text-gray-900 placeholder-transparent border-b-2 peer focus:border-blue-400 focus:outline-none"
                          placeholder="Full Name"
                        />
                        <label className="absolute left-0 text-xs text-gray-600 transition-all -top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-1 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:text-xs">
                          Full Name
                        </label>
                        <ErrorMessage name="name" component="div" className="text-red-500 text-xs" />
                      </div>

                      {/* Email Field */}
                      <div className="relative">
                        <Field
                          type="email"
                          name="email"
                          className="w-full h-8 text-sm text-gray-900 placeholder-transparent border-b-2 peer focus:outline-none focus:border-blue-400"
                          placeholder="Email Address"
                        />
                        <label className="absolute left-0 text-xs text-gray-600 transition-all -top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:text-xs">
                          Email Address
                        </label>
                        <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
                      </div>

                      {/* Phone Field */}
                      <div className="relative">
                        <Field
                          type="text"
                          name="phone"
                          className="w-full h-8 text-sm text-gray-900 placeholder-transparent border-b-2 peer focus:outline-none focus:border-blue-400"
                          placeholder="Mobile Number"
                        />
                        <label className="absolute left-0 text-xs text-gray-600 transition-all -top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:text-xs">
                          Mobile Number
                        </label>
                        <ErrorMessage name="phone" component="div" className="text-red-500 text-xs" />
                      </div>

                      {/* Password Fields */}
                      <div className="relative">
                        <Field
                          type={showPassword ? "text" : "password"}
                          name="password"
                          className="w-full h-8 text-sm text-gray-900 placeholder-transparent border-b-2 peer focus:border-blue-400 focus:outline-none"
                          placeholder="Password"
                        />
                        <label className="absolute left-0 text-xs text-gray-600 transition-all -top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:text-xs">
                          Password
                        </label>
                        <ErrorMessage name="password" component="div" className="text-red-500 text-xs" />
                      </div>

                      <div className="relative">
                        <Field
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          className="w-full h-8 text-sm text-gray-900 placeholder-transparent border-b-2 peer focus:border-blue-400 focus:outline-none"
                          placeholder="Confirm Password"
                        />
                        <label className="absolute left-0 text-xs text-gray-600 transition-all -top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:text-xs">
                          Confirm Password
                        </label>
                        <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs" />
                      </div>

                      {/* Address Field */}
                      <div className="relative">
                        <Field
                          type="text"
                          name="address"
                          className="w-full h-8 text-sm text-gray-900 placeholder-transparent border-b-2 peer focus:outline-none focus:border-blue-400"
                          placeholder="Address"
                        />
                        <label className="absolute left-0 text-xs text-gray-600 transition-all -top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:text-xs">
                          Address
                        </label>
                        <ErrorMessage name="address" component="div" className="text-red-500 text-xs" />
                      </div>

                      {/* Checkbox */}
                      <div className="relative">
                        <Checkbox
                          size="small"
                          onChange={(e) => setFieldValue("isSeller", e.target.checked)}
                          inputProps={{
                            "aria-label": "controlled",
                          }}
                        />
                        <span className="text-[12px] text-gray-700 font-[500]">
                          Register as Seller
                        </span>
                      </div>

                      {/* Submit Button */}
                      <div className="relative flex flex-col">
                        <button
                          type="submit"
                          className="uppercase bg-gray-700 text-white text-[14px] font-[500] rounded-sm px-2 py-1"
                          disabled={isSubmitting}
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
              <div className="relative w-full mt-4">
                <Link to="/login">
                  <button className=" text-primaryBlue w-[90%] font-[600] text-[12px] ml-[5%] px-4 py-2 transition-all">
                    Existing User? Log in
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
