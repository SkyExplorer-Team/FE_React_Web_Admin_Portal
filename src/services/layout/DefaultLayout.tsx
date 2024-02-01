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

const App: React.FC = () => {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [nationalSelect, setNationalData] = useState< readonly SelectData[]>([]);
  const [airportSelect, setAirportSelect] = useState< readonly SelectData[]>([]);
  const [airplaneSelect, setAirplaneSelect] = useState< readonly SelectData[]>([]);
  const [airportsData, setAirportsData] = useState< AirportData[]>([]);
  const [airplanesData, setAirplanesData] = useState< AirplaneData[]>([]);
  const [schedulesData, setSchedulesData] = useState< ScheduleData[]>([]);
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
    setIsLoading(false)
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  }, [token]);

  const basicProps = { isLoading, setIsLoading, fetchAllData }
  
  switch (true) {
    case pathname === "/dashboard":
      contentComponent = <MainComponent />;
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
    }


  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

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
