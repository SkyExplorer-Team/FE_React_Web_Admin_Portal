import React, { useCallback,  useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Footer from "../../components/AppFooter";
import Header from "../../components/AppHeader";
import { fetchNationalData } from "../utils/NationalsData";
import MainComponent from "../../components/MainDashboard";
import ManageAccount from "../pages/ManageAccount";
import AddAccount from "../pages/AddAcount";
import EditAccount from "../pages/EditAccount";
import domainApi from "../config/domainApi";
import ManageAirports from "../pages/ManageAirport";
import ManageAirplanes from "../pages/ManageAirplane";
import ManageSchedules from "../pages/ManageSchedule";
import ManageTransactions from "../pages/ManageTransaction";

type UserData = {
  name: string;
  email: string
  id_role: string;
  id: string,
  role: {id: string, name:string}
};

interface SelectData {
   value: string;
   label: string;
}

type National = {
  id: string
  name: string
}

type AirportData = {
  id: string
  name: string
  abv: string
  national_id: string
  city: string
  lat: number
  lng: number
  national: National
};

type AirplaneData = {
  id: string
  name: string
  code: string
  speed: number
};

type RelationData = {
  id: string
  name: string
}

type ScheduleData = {
  id: string
  airplane_id: string
  from_id: string
  to_id: string
  price: number
  time_departure: string
  time_arrive: string
  airplane : RelationData
  fromData: RelationData
  toData: RelationData
}

type TransactionData = {
  id: string
  amount: number
  description: string
  payment_method: string
  status: string
  transaction_date: string
  booking_id: string
  };

type DashboardData = {
  airportData: number
  airplaneData: number
  scheduleData: number
  transactionData: number
};

const App: React.FC = () => {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [dashboardData, setDashboardData] = useState< DashboardData>({
  airportData: 0,
  airplaneData: 0,
  scheduleData: 0,
  transactionData: 0,
});
  const [nationalSelect, setNationalData] = useState< readonly SelectData[]>([]);
  const [airportSelect, setAirportSelect] = useState< readonly SelectData[]>([]);
  const [airplaneSelect, setAirplaneSelect] = useState< readonly SelectData[]>([]);
  const [airportsData, setAirportsData] = useState< AirportData[]>([]);
  const [airplanesData, setAirplanesData] = useState< AirplaneData[]>([]);
  const [schedulesData, setSchedulesData] = useState< ScheduleData[]>([]);
  const [transactionData, setTransactionData] = useState< TransactionData[]>([]);
  const token = localStorage.getItem('token');
  let contentComponent: React.ReactNode;
  
  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await fetchNationalData();
            setNationalData(data);

      
      const responseDataUsers = await fetch(`${domainApi}/api/v1/users`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (responseDataUsers.ok) {
        const data = await responseDataUsers.json();
        setUserData(data.data);
      } else {
        console.error('Error fetching users data:', responseDataUsers.status);
      }


    const responseAirportsData = await fetch(`${domainApi}/api/v1/airports`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (responseAirportsData.ok) {
      const data = await responseAirportsData.json();
      const airportsOption: readonly SelectData[] = data.data.map((airport: AirportData) => ({
        value: airport.id,
        label: airport.name,
      }));
      setAirportsData(data.data);
      setAirportSelect(airportsOption)
    } else {
      console.error('Error fetching Airports data:', responseAirportsData.status);
    }

    const responseAirplanesData = await fetch(`${domainApi}/api/v1/airplanes`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (responseAirplanesData.ok) {
      const data = await responseAirplanesData.json();
      const airplaneSelect: readonly SelectData[] = data.data.map((airplane: AirplaneData) => ({
        value: airplane.id,
        label: airplane.name,
      }));
      setAirplaneSelect(airplaneSelect)
      setAirplanesData(data.data);
    } else {
      console.error('Error fetching Airplanes data:', responseAirplanesData.status);
    }

    const responseSchedulesData = await fetch(`${domainApi}/api/v1/schedules`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (responseSchedulesData.ok) {
      const data = await responseSchedulesData.json();
      setSchedulesData(data.data);
    } else {
      console.error('Error fetching Schedules data:', responseSchedulesData.status);
    }

    const responseTransactionData = await fetch(`${domainApi}/api/v1/transactions`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (responseTransactionData.ok) {
      const data = await responseTransactionData.json();
      setTransactionData(data.data)
      // setTransactionData([{id: '4dc4da25-5c00-4b8b-ae5a-fd9037b7f69c',
      //   amount: 300000,
      //   description: 'Flight Booking A',
      //   payment_method: 'Transfer',
      //   status: 'Pending',
      //   transaction_date: '2024-02-01 03:50:00.000',
      //   booking_id: '2'}, {id: '2',
      //   amount: 270000,
      //   description: 'Flight Booking B',
      //   payment_method: 'Transfer Rekening',
      //   status: 'Confirmed',
      //   transaction_date: '2024-03-04 03:50:00.000',
      //   booking_id: '2'}]);
    } else {
      console.error('Error fetching Transactions data:', responseTransactionData.status);
    }
    setIsLoading(false)
    } catch (error) {
      console.error('Error during fetch:', error);
    }
    
  }, [token]);

  const basicProps = { isLoading, setIsLoading, fetchAllData }
  
  switch (true) {
    case pathname === "/dashboard":
      contentComponent = <MainComponent dashboardData={dashboardData}/>;
      break;
    case pathname === "/account":
      contentComponent = <ManageAccount usersData={userData} />;
      break;
    case pathname === "/account/add":
      contentComponent = <AddAccount />;
      break;
    case pathname.includes("/account/update/"):
      contentComponent = <EditAccount />;
      break;
    case pathname === "/airport":
      contentComponent = <ManageAirports basicProps={basicProps} airportsData={ airportsData } nationalSelect={nationalSelect} />;
      break;
    case pathname === "/airplane":
      contentComponent = <ManageAirplanes basicProps={basicProps} airplanesData={ airplanesData } />;
      break;
    case pathname === "/schedule":
      contentComponent = <ManageSchedules basicProps={basicProps} schedulesData={schedulesData } airportSelect={airportSelect} airplaneSelect={airplaneSelect} />;
      break;
    case pathname === "/transaction":
      contentComponent = <ManageTransactions basicProps={basicProps} transactionData={transactionData} />;
      break;
    }


  useEffect(() => {
    fetchAllData();
    setDashboardData((prevData) => ({
      ...prevData,
      scheduleData: schedulesData.length,
      airplaneData: airplanesData.length,
      airportData: airportsData.length,
      transactionData: transactionData.length,
    }));
  }, [airplanesData.length, airportsData.length, dashboardData, fetchAllData, schedulesData.length, transactionData.length]);
  

  return (
      <div id="wrapper">
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content" >
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
