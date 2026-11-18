import React, { useMemo } from "react";

const Footer: React.FC = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  return (
    <footer className="py-1 bg-dark text-light">
      <div className="container text-center">
        <p>
          <small>
            Copyright &copy;{currentYear} 2025 HOTWAVE Co,Ltd.All Rights Reserved.
          </small>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
