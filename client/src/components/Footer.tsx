import LogoutButton from "./LogoutButton";

const Footer = ({ user }: FooterProps) => {
  return (
    <footer className="footer">
      <div className={"footer_email"}>
        <h1 className="text-14 truncate text-gray-700 font-semibold">
          {user?.username}
        </h1>
      </div>
      <LogoutButton />
    </footer>
  );
};

export default Footer;
