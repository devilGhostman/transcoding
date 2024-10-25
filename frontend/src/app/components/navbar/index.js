import Link from "next/link";
import React from "react";

const navbarOption = [
  { id: "1", name: "Home", link: "/" },
  { id: "2", name: "Upload", link: "/upload" },
];
const Navbar = () => {
  return (
    <div className="w-full h-10 flex justify-end items-center px-4">
      {navbarOption.map((item) => (
        <Link
          href={item.link}
          key={item.id}
          className="mx-4 mt-4 hover:cursor-pointer hover:text-red-500"
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default Navbar;
