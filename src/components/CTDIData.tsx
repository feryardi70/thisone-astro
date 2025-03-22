import { useState, useEffect } from "react";
import SpinnerCss from "./Spinner";
import { baseUrl } from "../lib/baseUrl";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ctdi, setCtdi] = useState<CTDI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchDepartures = async (page: number) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${baseUrl}/api/ctdi.json?page=${page}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      clearTimeout(timeoutId);
      const { data, pagination } = (await response.json()) as any;

      setCtdi(data.data);
      setTotalPages(data.pagination.total_pages);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDepartures(currentPage);
  }, [currentPage]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartureId, setSelectedDepartureId] = useState<number | null>(null);

  const [filters, setFilters] = useState({
    parameter_uji: "",
    instansi: "",
    data_pesawat: "",
    date: "",
    year: "",
  });

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    const queryParams = new URLSearchParams();

    selectedFilters.forEach((filter) => {
      if (filters[filter]) {
        queryParams.append(filter, filters[filter]);
      }
    });

    queryParams.append("page", currentPage.toString());

    try {
      const response = await fetch(`/api/ctdi.json?${queryParams}`);
      const { data, pagination } = await response.json();

      setCtdi(data);
      setTotalPages(pagination?.total_pages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSignOut = async () => {
    try {
      const response = await fetch(`/api/login.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        //alert("Successfully deleted departure");
        // Trigger re-fetch or update state
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error occured:", error);
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
            <span className="text-blue-950 px-3 py-1 bg-green-400 rounded-lg">
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
        <div className="flex justify-between">
          <h1 className="text-4xl tracking-wide mb-6">CTDI DATA DASHBOARD</h1>
          <button onClick={() => handleSignOut()} className="underline py-2 px-2">
            Sign Out
          </button>
        </div>
        <div className="mb-3">
          <span className="px-3 py-3 bg-sky-950 text-white">
            <a href="/">Home</a>
          </span>
          <span className="px-3 py-3 bg-sky-950 text-white">
            <a href="/add-ctdi-data">Add Data</a>
          </span>
          <span className="px-3 py-3 bg-sky-950 text-white">
            <button onClick={() => setShowFilters(!showFilters)} className="underline">
              Search
            </button>
          </span>
        </div>

        {showFilters && (
          <div className="text-blue-950">
            <p className="text-fuchsia-50">Please select the data you want to filter by below.</p>

            {/* Dropdown to select filters */}
            <select
              multiple
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, (option) => option.value);
                setSelectedFilters(values);
              }}
              className="bg-blue-200 border p-2 mb-2"
            >
              <option value="parameter_uji">Parameter Uji</option>
              <option value="instansi">Instansi</option>
              <option value="data_pesawat">Data Pesawat</option>
              <option value="date">Tanggal</option>
              <option value="year">Tahun</option>
            </select>

            {/* Dynamic Inputs Based on Selected Filters */}
            <div className="flex">
              <div className="flex gap-4">
                {selectedFilters.includes("parameter_uji") && <input className="py-3 pl-1" type="text" placeholder="Parameter Uji" value={filters.parameter_uji} onChange={(e) => setFilters({ ...filters, parameter_uji: e.target.value })} />}
                {selectedFilters.includes("instansi") && <input className="py-1 pl-1" type="text" placeholder="Instansi" value={filters.instansi} onChange={(e) => setFilters({ ...filters, instansi: e.target.value })} />}
                {selectedFilters.includes("data_pesawat") && <input className="py-1 pl-1" type="text" placeholder="Data Pesawat" value={filters.data_pesawat} onChange={(e) => setFilters({ ...filters, data_pesawat: e.target.value })} />}
                {selectedFilters.includes("date") && <input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />}
                {selectedFilters.includes("year") && <input className="py-1 pl-1" type="number" placeholder="Year" value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })} />}
              </div>

              <span>
                <button onClick={handleSearch} className="px-1 py-3 bg-green-400">
                  Search
                </button>
              </span>
            </div>
          </div>
        )}

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

      <div className="mb-4">
        <button className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
          Previous
        </button>
        <span className="mx-4 text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
          Next
        </button>
      </div>
      {/* </DepartureRoute> */}
      {/* </RootLayout> */}
    </>
  );
}
