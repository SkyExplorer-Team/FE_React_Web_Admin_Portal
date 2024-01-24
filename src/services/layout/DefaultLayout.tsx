import React, { ReactNode } from "react";
import Footer from "../../components/AppFooter";
import Header from "../../components/AppHeader"


interface DefaultLayoutProps {
  contentComponent: ReactNode;
}

const App: React.FC<DefaultLayoutProps> = ({ contentComponent }) => {
  return (
    <div id="wrapper">
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <Header />
          <div className="container-fluid" style={{ minHeight: "80vh"}}>
            {contentComponent}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default App;
