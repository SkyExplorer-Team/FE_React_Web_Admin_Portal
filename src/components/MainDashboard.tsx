import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocation, faPlane, faCalendarDay, faCreditCard } from "@fortawesome/free-solid-svg-icons";

type DashboardData = {
  airportData: number
  airplaneData: number
  scheduleData: number
  transactionData: number
};

function MainComponent({ dashboardData }: { dashboardData: DashboardData }) {
  return (
    <>
      <div id="main">
        <header className="mb-3">
          <a href="#" className="burger-btn d-block d-xl-none">
            <i className="bi bi-justify fs-3"></i>
          </a>
        </header>

        <div className="page-heading">
          <div className="page-title">
            <div className="row">
              <div className="col-12 col-md-6 order-md-1 order-last">
              </div>
                <div className="col-12 col-md-6 order-md-2 order-first">
                <nav
                  aria-label="breadcrumb"
                  className="breadcrumb-header float-start float-lg-end"
                >
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="index.html">Dashboard</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Layout Default
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
          <section className="section">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Dashboard</h4>
              </div>
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-xl-3 col-md-6 mb-4">
                      <div className="card border-left-primary shadow h-100 p-4">
                          <div className="card-body">
                              <div className="row no-gutters align-items-center">
                                  <div className="col mr-2">
                                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                          Airpots</div>
                                      <div className="h5 mb-0 font-weight-bold text-gray-800">{dashboardData.airportData}</div>
                                  </div>
                                  <div className="col-auto">
                                    <FontAwesomeIcon icon={faMapLocation} style={{color: "#dddfeb" , fontSize: "2em" }} />
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="col-xl-3 col-md-6 mb-4">
                      <div className="card border-left-primary shadow h-100 p-4">
                          <div className="card-body">
                              <div className="row no-gutters align-items-center">
                                  <div className="col mr-2">
                                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                          Airplanes</div>
                                      <div className="h5 mb-0 font-weight-bold text-gray-800">{dashboardData.airplaneData}</div>
                                  </div>
                                  <div className="col-auto">
                                    <FontAwesomeIcon icon={faPlane} style={{color: "#dddfeb" , fontSize: "2em" }} />
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="col-xl-3 col-md-6 mb-4">
                      <div className="card border-left-primary shadow h-100 p-4">
                          <div className="card-body">
                              <div className="row no-gutters align-items-center">
                                  <div className="col mr-2">
                                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                          Schedules</div>
                                      <div className="h5 mb-0 font-weight-bold text-gray-800">{dashboardData.scheduleData}</div>
                                  </div>
                                  <div className="col-auto">
                                    <FontAwesomeIcon icon={faCalendarDay} style={{color: "#dddfeb" , fontSize: "2em" }} />
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="col-xl-3 col-md-6 mb-4">
                      <div className="card border-left-primary shadow h-100 p-4">
                          <div className="card-body">
                              <div className="row no-gutters align-items-center">
                                  <div className="col mr-2">
                                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                          Transactions</div>
                                      <div className="h5 mb-0 font-weight-bold text-gray-800">{dashboardData.transactionData}</div>
                                  </div>
                                  <div className="col-auto">
                                    <FontAwesomeIcon icon={faCreditCard} style={{color: "#dddfeb" , fontSize: "2em" }} />
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default MainComponent;
