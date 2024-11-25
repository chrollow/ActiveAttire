import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const UserProfile = () => {
  const { auth, setAuth } = useAuth();
  const [profile, setProfile] = useState(false);
  const [emailSection, setEmailSection] = useState(false);
  const [phoneSection, setPhoneSection] = useState(false);

  const [imageUrl, setImageUrl] = useState(auth?.user?.profilePicture);

  const handleProfile = () => setProfile(!profile);
  const handleEmail = () => setEmailSection(!emailSection);
  const handlePhone = () => setPhoneSection(!phoneSection);

  console.log("auth.user:", auth?.user?.profilePicture);

  const [isUploaded, setIsUploaded] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    auth?.user?.profilePicture || ""
  );

  useEffect(() => {
    if (auth?.user?.profilePicture) {
      setProfilePictureUrl(auth.user.profilePicture);
    }
  }, [auth]);

  const nameValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
  });

  const emailValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const phoneValidationSchema = Yup.object().shape({
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "profile_img");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dvhcgepit/image/upload",
        formData
      );

      const imageUrl = response.data.secure_url;
      setProfilePictureUrl(imageUrl);

      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/update-details`,
        {
          profilePicture: imageUrl,
          email: auth?.user?.email,
          newName: name,
        }
      );

      setAuth({
        ...auth,
        user: {
          ...auth.user,
          profilePicture: imageUrl,
        },
      });
      localStorage.removeItem("auth");
      localStorage.setItem("auth", JSON.stringify(auth));

      sessionStorage.removeItem("auth");
      sessionStorage.setItem("auth", JSON.stringify(auth));

      toast.success("Profile picture uploaded successfully!");
      setIsUploaded(true); // Set the image upload state to true
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const updatedData = {
        ...(values.name && { newName: values.name }),
        ...(values.email && { newEmail: values.email }),
        ...(values.phone && { newPhone: values.phone }),
        email: auth?.user?.email, // Ensure this is the correct current email
      };

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/update-details`,
        updatedData
      );

      setAuth({
        ...auth,
        user: response.data.user, // Use updated user from the response
      });

      localStorage.setItem("auth", JSON.stringify(response.data.user));
      toast.success(response.data.message);
      setSubmitting(false);
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      if (
        error.response?.status === 401 &&
        error.response.data?.errorType === "invalidUser"
      ) {
        toast.error("User not found!");
      } else if (error.response?.status === 500) {
        toast.error("Something went wrong! Please try again later.");
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-start w-full gap-10 p-5">
        <div className="flex gap-5">
          <div className="font-[600] text-[16px]">Profile Picture</div>
        </div>
        <div className="flex gap-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="flex flex-col max-h-[50px] min-h-[50px] w-[420px]"
          />
          {!isUploaded ? (
            <button
              onClick={handleProfilePictureUpload}
              className=" text-black font-[600] w-[80px] h-[40px] px-4 py-2 border-black hover:border-b-2"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          ) : (
            <button
              onClick={handleProfilePictureUpload} // This can be the same function if the button is intended to update the image
              className=" text-black font-[600] w-[80px] h-[40px] px-4 py-2 border-black hover:border-b-2"
            >
              Update
            </button>
          )}
        </div>
        {/* Name Section */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex gap-5">
            <div className="font-[600] text-[16px]">Personal Information</div>
            <button
              className="text-[14px] text-primaryBlue font-[500]"
              onClick={handleProfile}
            >
              {!profile ? "Edit" : "Cancel"}
            </button>
          </div>
          {profile ? (
            <Formik
              initialValues={{ name: auth?.user?.name }}
              validationSchema={nameValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="flex items-center gap-6">
                  <div className="border-2 p-2 flex flex-col max-h-[50px] min-h-[50px] w-[220px]">
                    <label htmlFor="name" className="text-[10px]">
                      Name
                    </label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="text-[14px] focus:outline-none"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primaryBlue text-white font-[600] w-[80px] h-[40px] px-4 py-2 rounded-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </Form>
              )}
            </Formik>
          ) : (
            <div className="border-2 p-2 w-[220px] min-h-[50px] text-slate-500">
              {auth?.user?.name}
            </div>
          )}
        </div>

        {/* Email Section */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex gap-5">
            <div className="font-[600] text-[16px]">Email Address</div>
            <button
              className="text-[14px] text-primaryBlue font-[500]"
              onClick={handleEmail}
            >
              {!emailSection ? "Edit" : "Cancel"}
            </button>
          </div>
          {emailSection ? (
            <Formik
              initialValues={{ email: auth?.user?.email }}
              validationSchema={emailValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="flex gap-6">
                  <div className="border-2 p-2 w-[220px]">
                    <Field
                      type="email"
                      name="email"
                      className="border-2 p-2 w-[220px] focus:outline-primaryBlue focus:outline-1"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primaryBlue text-white font-[600] w-[80px] h-[40px] px-4 py-2 rounded-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </Form>
              )}
            </Formik>
          ) : (
            <div className="border-2 p-2 w-[220px] text-slate-500">
              {auth?.user?.email}
            </div>
          )}
        </div>

        {/* Phone Section */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex gap-5">
            <div className="font-[600] text-[16px]">Mobile Number</div>
            <button
              className="text-[14px] text-primaryBlue font-[500]"
              onClick={handlePhone}
            >
              {!phoneSection ? "Edit" : "Cancel"}
            </button>
          </div>
          {phoneSection ? (
            <Formik
              initialValues={{ phone: auth?.user?.phone }}
              validationSchema={phoneValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="flex gap-6">
                  <div className="border-2 p-2 w-[220px]">
                    <Field
                      type="tel"
                      name="phone"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      minLength="10"
                      maxLength="10"
                      className="border-2 p-2 w-[220px] focus:outline-primaryBlue focus:outline-1"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primaryBlue text-white font-[600] w-[80px] h-[40px] px-4 py-2 rounded-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </Form>
              )}
            </Formik>
          ) : (
            <div className="border-2 p-2 w-[220px] text-slate-500">
              {auth?.user?.phone}
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div>
          <h3 className="text-[16px] font-[600] mt-4">FAQs</h3>
          {/* FAQ content */}
        </div>

        {/* Deactivate Account */}
        <div className="text-[14px] text-primaryBlue font-[500] mt-4 -mb-4">
          <Link to="./deactivate">Deactivate Account</Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;