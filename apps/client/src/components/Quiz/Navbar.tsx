import { useEffect, useState } from 'react';
import { Sidebar } from '../Sidebar';
import { useWindowSize } from '../hooks/useWindowSize';

type NavbarProps = {
  // eslint-disable-next-line no-unused-vars
};

const Navbar = ({}: NavbarProps) => {
  const [screenWidth] = useWindowSize();

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const handleSidebarClick = () => {
    setSidebarIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (screenWidth > 768) {
      setSidebarIsOpen(true);
    }
  }, [screenWidth]);

  return (
    <>
      <aside
        id="default-sidebar"
        className={`fixed inset-0 z-30 w-full translate-x-0 transform transition-transform sm:translate-x-0 md:h-full ${
          sidebarIsOpen ? 'pointer-events-auto sm:h-full' : 'pointer-events-none sm:h-64'
        }`}
        aria-label="Sidebar"
      >
        <Sidebar handleClick={handleSidebarClick} isOpen={sidebarIsOpen} />
      </aside>
    </>
  );
};
export default Navbar;
