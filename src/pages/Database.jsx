import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Database() {
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState("");

  const exportToExcel = async () => {
    try {
      setExporting(true);
      setMessage("");

      // Fetch users directly for export
      const response = await fetch("http://localhost:3002/api/users");
      const data = await response.json();

      if (!data.success) {
        throw new Error("Failed to fetch database");
      }

      // Prepare data for Excel
      const excelData = data.users.map((user, index) => ({
        No: index + 1,
        Name: user.name,
        Phone: user.phone,
        Score: user.score,
        "Date Created": new Date(user.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      ws["!cols"] = [
        { wch: 5 }, // No
        { wch: 20 }, // Name
        { wch: 15 }, // Phone
        { wch: 10 }, // Score
        { wch: 25 }, // Date Created
      ];

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Scream Game Users");

      // Generate Excel file and download
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const fileData = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const fileName = `scream_database_${new Date().toISOString().split("T")[0]}.xlsx`;
      saveAs(fileData, fileName);

      setMessage(
        `✨ Magic! ${data.users.length} records exported successfully!`
      );
    } catch (err) {
      console.error("Error exporting database:", err);
      setMessage("❌ Magic failed! Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="bg-image georgia-font min-h-screen w-full flex flex-col items-center justify-center px-6">
      {/* Header Section */}
      <div className="mb-8">
        <img src="/indomart.png" alt="indomart" className="mx-auto mb-8" />
      </div>

      {/* Main Content */}
      <div className="text-center max-w-2xl">
        <h1 className="text-[4em] md:text-[6em] font-black mb-8 main-color uppercase">
          database
        </h1>
        <p className="text-[1.2em] mb-16 opacity-80 main-color">
          Convert your scream game database into spreadsheet
        </p>

        {/* Magic Button */}
        <button
          onClick={exportToExcel}
          disabled={exporting}
          className={`bg-blue-600 hover:bg-blue-700 rounded-full px-16 md:px-24 py-6 md:py-8 text-[1.2em] md:text-[1.5em] font-black transition-all duration-300 transform text-white uppercase ${
            exporting
              ? "opacity-50 cursor-not-allowed scale-95"
              : "hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
          }`}
        >
          {exporting ? (
            <div className="flex items-center gap-4">
              <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-white"></div>
              creating magic...
            </div>
          ) : (
            "✨ magic export ✨"
          )}
        </button>

        {/* Status Message */}
        {message && (
          <div className="mt-12 text-center">
            <p className="text-[0.9em] bg-black/20 rounded-2xl px-8 py-4 backdrop-blur-sm main-color">
              {message}
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-16 text-center opacity-70 main-color">
          <p className="text-[1.1em] mb-6 font-bold uppercase">how it works:</p>
          <div className="text-[0.9em] space-y-3 bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <p>• Click the magic button</p>
            <p>• Database automatically converts to Excel</p>
            <p>• File downloads to your computer</p>
            <p>• Open with Excel, Google Sheets, or any spreadsheet app</p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-16">
        <img src="/festival.png" alt="festival" className="mx-auto" />
      </div>
    </div>
  );
}
