import { useState } from 'react';
import { Sidebar } from '../Sidebar';

type NavbarProps = {
  // eslint-disable-next-line no-unused-vars
};

const Navbar = ({}: NavbarProps) => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const handleSidebarClick = () => {
    setSidebarIsOpen((prev) => !prev);
  };

  return (
    <>
      <aside
        id="default-sidebar"
        className="fixed left-0 top-0 z-30 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0"
        aria-label="Sidebar"
      >
        <Sidebar handleClick={handleSidebarClick} isOpen={sidebarIsOpen} />
      </aside>
    </>
  );
};
export default Navbar;
