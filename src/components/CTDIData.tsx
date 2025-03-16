import { useState, useEffect } from "react";
import SpinnerCss from "./Spinner";

interface CTDI {
  id: number;
  databaseId: string | null;
  parameter_uji: string;
  instansi: string;
  data_pesawat: string;
  CTDI_Vol_ukur: string;
  CTDI_Vol_konsol: string;
  deviasi: string;
  tanggal_uji: string;
}

export default function CTDIData() {
  const [ctdi, setCtdi] = useState<CTDI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchDepartures = async () => {
    try {
      const response = await fetch("api/ctdi.json", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = (await response.json()) as any;

      setCtdi(data.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDepartures();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartureId, setSelectedDepartureId] = useState<number | null>(null);

  const openModal = (id: number | null) => {
    setSelectedDepartureId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id: any) => {
    try {
      const response = await fetch(`/api/ctdi.json`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: id,
      });

      if (response.status === 200) {
        alert("Successfully deleted departure");
        // Trigger re-fetch or update state
        window.location.href = "/departure";
      }
    } catch (error) {
      console.error("Error deleting departure:", error);
    } finally {
      closeModal();
    }
  };

  const renderDepartures = () => {
    return ctdi.map((data, i) => {
      return (
        <tr key={data.id}>
          <td className="text-center w-7 px-3 py-2">{++i}</td>
          <td className="text-center px-3 py-2">{data.parameter_uji}</td>
          <td className="text-center px-3 py-2">{data.instansi}</td>
          <td className="text-center px-3 py-2">{data.data_pesawat}</td>
          <td className="text-center px-3 py-2">{data.CTDI_Vol_ukur}</td>
          <td className="text-center px-3 py-2">{data.CTDI_Vol_konsol}</td>
          <td className="text-center w-20 px-3 py-2">{data.deviasi}</td>
          <td className="text-center px-3 py-2">{data.tanggal_uji}</td>
          <td className="text-center px-3 py-2">
            <span className="px-3 py-1 bg-green-400 rounded-lg">
              <a href={`/ctdi/${data.databaseId}`} target="_blank">
                edit
              </a>
            </span>
            {/* <span className="px-2 py-1 bg-red-400 rounded-lg ml-1">
              <button onClick={() => openModal(data.id)}>Delete</button>
            </span> */}
          </td>
        </tr>
      );
    });
  };

  return (
    <>
      {/* <RootLayout title="Departure Dashboard"> */}
      {/* <DepartureRoute> */}
      <div className="px-10 py-10">
        <div>
          <h1 className="text-4xl tracking-wide mb-6">CTDI DATA DASHBOARD</h1>
        </div>
        <div className="mb-3">
          <span className="px-3 py-3 bg-sky-950 text-white">
            <a href="/">Home</a>
          </span>
          <span className="px-3 py-3 bg-sky-950 text-white">
            <a href="/add-ctdi-data">Add Data</a>
          </span>
          <span className="px-3 py-3 bg-sky-950 text-white">
            <a href="/viewdeparture" target="_blank">
              View Departure
            </a>
          </span>
        </div>

        <table className="my-4 w-full border-collapse">
          <thead className="text-lg mb-5">
            <tr>
              <th className="text-center w-7 px-3">#</th>
              <th className="text-center px-3">Parameter Uji</th>
              <th className="text-center px-3">Instansi Pemohon Uji</th>
              <th className="text-center px-3">Data Pesawat</th>
              <th className="text-center px-3">CTDI Vol terukur</th>
              <th className="text-center px-3">CTDI Vol Konsol</th>
              <th className="text-center px-3">%Deviasi</th>
              <th className="text-center px-3">Tanggal Uji</th>
              <th className="text-center px-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-xl">{renderDepartures()}</tbody>
        </table>
        {isLoading ? <SpinnerCss /> : null}
        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this?</h3>
              <div className="flex justify-end space-x-4">
                <button onClick={() => handleDelete(selectedDepartureId)} className="bg-fuchsia-500 text-white px-4 py-2 rounded">
                  Yes
                </button>
                <button onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded">
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* </DepartureRoute> */}
      {/* </RootLayout> */}
    </>
  );
}
