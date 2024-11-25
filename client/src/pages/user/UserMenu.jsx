import { useAuth } from "../../context/auth";
import { Link, NavLink, useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import BarChartIcon from "@mui/icons-material/BarChart";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { GiCrossMark } from "react-icons/gi";
import profileImage from "../../assets/images/profile.png";

const UserMenu = ({ toggleMenu }) => {
  const { auth, setAuth, LogOut } = useAuth(); // Access auth state here
  const profilePictureUrl = auth?.user?.profilePicture; // Use the profilePicture from auth or fallback to empty string
  console.log("auth:", auth);
  console.log("auth.user:", auth?.user);
  console.log("profilePicture:", auth?.user?.profilePicture);

  console.log("profile URL" + profilePictureUrl);

  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
    LogOut();
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setPhoneSection(false);

    try {
      setProfile(false);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/update-details`,
        {
          newPhone: phone,
          email: auth?.user?.email,
        }
      );
      setAuth({
        ...auth,
        user: {
          ...auth.user,
          phone: phone,
        },
      });
      localStorage.removeItem("auth");
      localStorage.setItem("auth", JSON.stringify(response.data));

      toast.success(response.data.message);
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
    <div className="flex flex-col w-full gap-4">
      <div className="flex gap-4 p-3 bg-white shadow-md rounded-2xl">
        <div className="flex items-center justify-center">
          {profilePictureUrl && (
            <div className="mt-4">
              <img
                src={profilePictureUrl || profileImage}
                alt="Profile Picture"
                className="w-[100px] h-[100px] rounded-full"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center p-1">
          {/* <div className="text-[14px]">Hello,</div> */}
          <div className="font-[600] text-[16px]">
            {auth?.user?.name?.charAt(0).toUpperCase() +
              auth?.user?.name?.slice(1)}
          </div>
        </div>
        <div
          className="hover:scale-[1.06] absolute right-4 top-2 cursor-pointer sm:hidden"
          onClick={toggleMenu}
        >
          <GiCrossMark />
        </div>
      </div>

      <div className="flex flex-col justify-center bg-white sm:shadow-md rounded-2xl">
        <div className="flex flex-col justify-center border-b-[1px]">
          <div className="flex flex-row items-center gap-6 pl-[10px] py-[8px]">
            <PersonIcon className="text-gray-400 text-[16px]" />
            <div className="font-[600] text-[14px] text-slate-500">
              ACCOUNT SETTINGS
            </div>
          </div>
          <div className="flex flex-col  text-black font-[300] text-[14px] mb-2 mt-0 ">
            <NavLink
              to="./profile"
              onClick={scrollToTop}
              className={({ isActive }) =>
                isActive ? "font-[600] text-gray-400 bg-[#f1f3f5]" : ""
              }
            >
              <div className=" h-[40px] px-[60px] flex items-center hover:text-gray-400 hover:bg-[#f1f3f5]">
                Profile Information
              </div>
            </NavLink>
          </div>
        </div>

        <div className="flex flex-col justify-center border-b-[1px]">
          <div className="flex flex-row items-center gap-6 pl-[10px] py-[8px]">
            <BarChartIcon className="text-gray-400 text-[16px]" />
            <div className="font-[600] text-[14px] text-slate-500">
              DASHBOARD
            </div>
          </div>
          <div className="flex flex-col  text-black font-[300] text-[14px] mb-2 mt-0 ">
            <NavLink
              to="/user/orders "
              onClick={scrollToTop}
              className={({ isActive }) =>
                isActive ? "font-[600] text-gray-400 bg-[#f1f3f5]" : ""
              }
            >
              <div className=" h-[40px] px-[60px] flex items-center hover:text-gray-400 hover:bg-[#f1f3f5]">
                My Orders
              </div>
            </NavLink>

            <NavLink
              to="/user/wishlist"
              onClick={scrollToTop}
              className={({ isActive }) =>
                isActive ? "font-[600] text-gray-400 bg-[#f1f3f5]" : ""
              }
            >
              <div className=" h-[40px] px-[60px] flex items-center hover:text-gray-400 hover:bg-[#f1f3f5]">
                My Wishlist
              </div>
            </NavLink>
          </div>
        </div>

        <div className="flex flex-col justify-center border-b-[1px]">
          <div className="flex flex-row items-center gap-6 pl-[10px] py-[8px] group">
            <PowerSettingsNewIcon className="text-gray-400 text-[16px]" />
            <button
              className="font-[600] text-[14px] w-full h-[40px] flex items-center text-slate-500 group-hover:text-gray-400"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;