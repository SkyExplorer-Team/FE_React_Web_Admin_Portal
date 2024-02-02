import domainApi from "../config/domainApi";
const token = localStorage.getItem('token');

interface NationalData {
  name: string;
  id: string;
}

interface NationalData {
    readonly value: string;
    readonly label: string;
  }

export const fetchNationalData = async (): Promise<readonly NationalData[]> => {
  try {
    const response = await fetch(`${domainApi}/api/v1/nationals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const nationalOptions: readonly NationalData[] = data.data.map((national: NationalData) => ({
        value: national.id,
        label: national.name,
      }));

      return nationalOptions;
    } else {
      console.error('Error fetching national data:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error during fetch:', error);
    return [];
  }
};
