// import { useEffect, useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import authImg from "../../assets/images/auth.png";
// import axios from "axios";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useAuth } from "../../context/auth";
// import Spinner from "../../components/Spinner";
// import Cookies from "js-cookie";
// import SeoData from "../../SEO/SeoData";
// import GoogleIcon from "@mui/icons-material/Google";
// import backgroundImage from "../../assets/images/banner.png";

// // For Google signin
// import {
//   googleAuth,
//   googleProvider,
// } from "../../components/googleSignIn/config";
// import { signInWithPopup } from "firebase/auth";
// import { getMessaging, getToken, deleteToken } from "firebase/messaging";
// import { messaging } from "../../components/googleSignIn/config";


// const Login = () => {
//   //hooks
//   const [showPassword, setShowPassword] = useState(false);
//   const { auth, setAuth, isAdmin } = useAuth();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handlePasswordToggle = () => {
//     setShowPassword(!showPassword);
//   };

//   useEffect(() => {
//     if (auth.token) {
//       isAdmin ? navigate("/admin/dashboard") : navigate("/user/dashboard");
//     }
//   }, [navigate, auth, isAdmin]);

//   // Form validation schema
//   const validationSchema = Yup.object({
//     email: Yup.string()
//       .email("Invalid email address")
//       .required("Email is required"),
//     password: Yup.string()
//       .min(5, "Password must be at least 5 characters")
//       .required("Password is required"),
//   });

//   // Form submission handler
//   const handleFormSubmit = async (values) => {
//     setIsSubmitting(true);
//     try {
//       toast(
//         "The backend is starting up, please wait for a minute if the loader is visible."
//       );

//       const response = await axios.post(
//         `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/login`,
//         values
//       );

//       if (response.status === 200) {
//         toast.success("Logged in Successfully!");
//         setAuth({
//           ...auth,
//           user: response.data.user,
//           token: response.data.token,
//         });

//         // Save token and user to localStorage
//         localStorage.setItem("token", response.data.token);
//         localStorage.setItem("user", JSON.stringify(response.data.user));
//         Cookies.set("auth", JSON.stringify(response.data), {
//             expires: 7,
//         });

//         navigate(location.state || "/");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       // Handle errors
//       if (
//         error.response?.status === 401 &&
//         error.response.data?.errorType === "invalidPassword"
//       ) {
//         toast.error("Wrong password!");
//       } else if (
//         error.response?.status === 401 &&
//         error.response.data?.errorType === "invalidUser"
//       ) {
//         toast.error("User not Registered!");
//       } else if (error.response?.status === 500) {
//         toast.error("Something went wrong! Please try after sometime.");
//         navigate("/login");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Google Sign-in code
//   const [value, setValue] = useState("");
//   const handleClick = () => {
//     signInWithPopup(googleAuth, googleProvider)
//       .then((data) => {
//         const email = data.user.email;
//         setValue(email);
//         localStorage.setItem("email", email);
//         setAuth({
//           ...auth,
//           user: data.user,
//           token: data.user.getIdToken,
//         });

//         Cookies.set("auth", JSON.stringify(data), {
//           expires: 7,
//         });
//         navigate(location.state || "/");
//       })
//       .catch((error) => {
//         console.error("Google Sign-In Error:", error);
//       });
//   };

//   useEffect(() => {
//     const storedEmail = localStorage.getItem("email");
//     if (storedEmail) {
//       setValue(storedEmail);
//       navigate(location.state || "/");
//     }
//   }, [navigate, location.state]);

//   return (
//     <>
//       <SeoData
//         title="Log in - Existing User"
//         description="Log in with user details"
//       />
//       {isSubmitting ? (
//         <Spinner />
//       ) : (
//         <div className="container bg-primaryBg mt-5 mx-auto sm:mt-0 md:mt-0 lg:mt-0 py-[2px]">
//           <div className="flex items-center flex-col sm:flex-row md:flex-row lg:flex-row my-10 bg bg-white rounded-xl shadow-lg w-full h-[600px]">
//             {/* Left view */}
//             <div
//               className="flex flex-col w-full h-full bg-center bg-no-repeat bg-cover gap-y-10 rounded-tl-xl rounded-bl-xl"
//               style={{ backgroundImage: `url(${backgroundImage})` }}
//             ></div>

//             {/* Form */}
//             <div className="flex flex-col w-full p-5 h-900 gap-y-10">
//               <div className="w-full h-full">
//                 <Formik
//                   initialValues={{ email: "", password: "" }}
//                   validationSchema={validationSchema}
//                   onSubmit={handleFormSubmit}
//                 >
//                   {({ isSubmitting }) => (
//                     <Form className="w-[90%] mx-auto transition-all">
//                       <div className="pt-3 space-y-4 text-base leading-6 text-gray-700 sm:text-lg sm:leading-7">
//                         <div className="relative">
//                           <Field
//                             type="email"
//                             name="email"
//                             className="w-full h-8 text-sm text-gray-900 placeholder-transparent border-b-2 peer focus:outline-none focus:border-blue-400"
//                             placeholder="Email address"
//                           />
//                           <label
//                             className="absolute left-0 text-xs text-gray-600 transition-all -top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:text-xs"
//                           >
//                             Email Address
//                           </label>
//                           <ErrorMessage
//                             name="email"
//                             component="div"
//                             className="text-red-500 text-sm"
//                           />
//                         </div>

//                         <div className="relative">
//                           <Field
//                             type={showPassword ? "text" : "password"}
//                             name="password"
//                             className="w-full h-8 text-sm text-gray-900 placeholder-transparent border-b-2 peer focus:outline-none focus:border-blue-400"
//                             placeholder="Password"
//                           />
//                           <label
//                             className="absolute left-0 text-xs text-gray-600 transition-all -top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:text-xs"
//                           >
//                             Password
//                           </label>
//                           <span
//                             className="absolute cursor-pointer right-3 bottom-2 hover:text-black"
//                             onClick={handlePasswordToggle}
//                           >
//                             {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
//                           </span>
//                           <ErrorMessage
//                             name="password"
//                             component="div"
//                             className="text-red-500 text-sm"
//                           />
//                         </div>

//                         <div className="relative flex flex-col">
//                           <button
//                             type="submit"
//                             disabled={isSubmitting}
//                             className="uppercase bg-gray-700 text-white text-[14px] font-[500] rounded-sm px-2 py-1"
//                           >
//                             {isSubmitting ? "Logging in..." : "Log in"}
//                           </button>
//                         </div>

//                         <div className="relative flex flex-col">
//                           {!value && (
//                             <button
//                               type="button"
//                               onClick={handleClick}
//                               className="flex items-center justify-center bg-primaryBlue uppercase text-white text-[14px] font-[500] rounded-xl px-4 py-2"
//                             >
//                               <GoogleIcon className="mr-2" /> Log in with Google
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </Form>
//                   )}
//                 </Formik>
//               </div>

//               <div className="relative w-full text-center -mt-7">
//                 <Link
//                   to="/forgot-password"
//                   className=" text-primaryBlue font-[500] text-[12px]"
//                 >
//                   Forgot Password?
//                 </Link>
//                 <br />
//                 <Link
//                   to="/register"
//                   className=" text-primaryBlue font-[500] text-[12px]"
//                 >
//                   New to ActiveAttire? Create an account
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Login;

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import authImg from "../../assets/images/auth.png";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/auth";
import Spinner from "../../components/Spinner";
import Cookies from "js-cookie";
import SeoData from "../../SEO/SeoData";
import GoogleIcon from "@mui/icons-material/Google";
import backgroundImage from "../../assets/images/banner.png";

// For Google signin
import {
  googleAuth,
  googleProvider,
} from "../../components/googleSignIn/config";
import { signInWithPopup } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";
import { messaging } from "../../components/googleSignIn/config";

const Login = () => {
  // hooks
  const [showPassword, setShowPassword] = useState(false);
  const { auth, setAuth, isAdmin } = useAuth(); // Destructure from useAuth context
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (auth.token) {
      // Check if the user is logged in and redirect accordingly
      isAdmin ? navigate("/admin/dashboard") : navigate("/user/dashboard");
    }
  }, [navigate, auth, isAdmin]);

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(5, "Password must be at least 5 characters")
      .required("Password is required"),
  });

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      toast("The backend is starting up, please wait for a minute if the loader is visible.");
  
      // Get FCM token and log it
      const messagingInstance = getMessaging();
      const fcmToken = await getToken(messagingInstance, { vapidKey: "BGVH_Ks5teTNhdhsEm-PzIMl0A7cRDQJUtoZnw0cLU9ai7RKxLtdMveTm8dygEXj2oZGf55XTcO0QQeuE1S80aM" }) // Replace with your VAPID key
        .then((currentToken) => {
          if (currentToken) {
            console.log("FCM Token:", currentToken);
            return currentToken; // Return the token
          } else {
            console.log("No FCM token available. Ensure permission is granted.");
            return null;
          }
        })
        .catch((err) => {
          console.log("Error fetching FCM token:", err);
          return null;
        });
  
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/login`,
        { ...values, fcmToken } // Include fcmToken in the request body
      );
  
      if (response.status === 200) {
        toast.success("Logged in Successfully!");
  
        // Update the auth context state with the user and token
        setAuth({
          user: response.data.user,
          token: response.data.token,
        });
  
        // Save token and user to localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        Cookies.set("auth", JSON.stringify(response.data), { expires: 7 });
  
        // Redirect user to the appropriate page
        navigate(location.state || "/");
      }
    } catch (error) {
      console.error("Error:", error);
      if (
        error.response?.status === 401 &&
        error.response.data?.errorType === "invalidPassword"
      ) {
        toast.error("Wrong password!");
      } else if (
        error.response?.status === 401 &&
        error.response.data?.errorType === "invalidUser"
      ) {
        toast.error("User not Registered!");
      } else if (error.response?.status === 500) {
        toast.error("Something went wrong! Please try after sometime.");
        navigate("/login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  

  // Google Sign-in code
  const [value, setValue] = useState("");
  const handleClick = () => {
    signInWithPopup(googleAuth, googleProvider)
      .then((data) => {
        const email = data.user.email;
        setValue(email);
        localStorage.setItem("email", email);

        // Update auth context after Google login
        setAuth({
          user: data.user,
          token: data.user.getIdToken(),
        });

        Cookies.set("auth", JSON.stringify(data), { expires: 7 });
        navigate(location.state || "/");
      })
      .catch((error) => {
        console.error("Google Sign-In Error:", error);
      });
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setValue(storedEmail);
      navigate(location.state || "/");
    }
  }, [navigate, location.state]);

  return (
    <>
      <SeoData
        title="Log in - Existing User"
        description="Log in with user details"
      />
      {isSubmitting ? (
        <Spinner />
      ) : (
        <div className="container bg-primaryBg mt-5 mx-auto sm:mt-0 md:mt-0 lg:mt-0 py-[2px]">
          <div className="flex items-center flex-col sm:flex-row md:flex-row lg:flex-row my-10 bg bg-white rounded-xl shadow-lg w-full h-[600px]">
            {/* Left view */}
            <div
              className="flex flex-col w-full h-full bg-center bg-no-repeat bg-cover gap-y-10 rounded-tl-xl rounded-bl-xl"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            ></div>

            {/* Form */}
            <div className="flex flex-col w-full p-5 h-900 gap-y-10">
              <div className="w-full h-full">
                <Formik
                  initialValues={{ email: "", password: "" }}
                  validationSchema={validationSchema}
                  onSubmit={handleFormSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="w-[90%] mx-auto transition-all">
                      <div className="pt-3 space-y-4 text-base leading-6 text-gray-700 sm:text-lg sm:leading-7">
                        <div className="relative">
                          <Field
                            type="email"
                            name="email"
                            className="w-full h-8 text-sm text-gray-900 placeholder-transparent border-b-2 peer focus:outline-none focus:border-blue-400"
                            placeholder="Email address"
                          />
                          <label
                            className="absolute left-0 text-xs text-gray-600 transition-all -top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:text-xs"
                          >
                            Email Address
                          </label>
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>

                        <div className="relative">
                          <Field
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="w-full h-8 text-sm text-gray-900 placeholder-transparent border-b-2 peer focus:outline-none focus:border-blue-400"
                            placeholder="Password"
                          />
                          <label
                            className="absolute left-0 text-xs text-gray-600 transition-all -top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:text-xs"
                          >
                            Password
                          </label>
                          <span
                            className="absolute cursor-pointer right-3 bottom-2 hover:text-black"
                            onClick={handlePasswordToggle}
                          >
                            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                          </span>
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>

                        <div className="relative flex flex-col">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="uppercase bg-gray-700 text-white text-[14px] font-[500] rounded-sm px-3 py-2 w-full"
                          >
                            Login
                          </button>
                          <Link
                            to="/forgot-password"
                            className="text-[14px] mt-1 text-[#0d6dfd]"
                          >
                            Forgot your password?
                          </Link>
                        </div>

                        <div className="w-full text-center">
                          <div className="h-[5px] bg-gray-400 w-[20%] mx-auto mb-3 mt-5"></div>
                          <button
                            className="bg-[#db4437] text-white flex items-center justify-center gap-x-2 py-2 px-5 w-full"
                            onClick={handleClick}
                          >
                            <GoogleIcon />
                            Continue with Google
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;

