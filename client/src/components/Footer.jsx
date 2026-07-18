const Footer = () => {
  return (
    <footer className=" border-t border-gray-300 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} ShopSphere. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
