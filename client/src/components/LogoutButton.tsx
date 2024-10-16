import { handleLogout } from "@/lib/actions/auth.actions";

const LogoutButton = () => {
  return (
    <div
      className="cursor-pointer w-100 mx-auto text-red-100 font-bold"
      onClick={handleLogout}>
      Log out
    </div>
  );
};

export default LogoutButton;
