import React, { useEffect, useState } from "react";
import client from "../api/client";

export default function LeavePage() {
  const [leaves, setLeaves] = useState([]);

  const loadLeaves = async () => {
    const res = await client.get("/leaves");
    setLeaves(res.data);
  };

  const approve = async (id) => {
    await client.put(`/leaves/${id}/approve`);
    loadLeaves();
  };

  const reject = async (id) => {
    await client.put(`/leaves/${id}/reject`);
    loadLeaves();
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Leave Requests</h1>

      <table className="w-full bg-white shadow-sm rounded-xl">
        <thead>
          <tr className="text-left border-b">
            <th className="p-3">Employee</th>
            <th className="p-3">Start</th>
            <th className="p-3">End</th>
            <th className="p-3">Reason</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {leaves.map((l) => (
            <tr key={l.id} className="border-b">

              <td className="p-3">{l.emp_id}</td>
              <td className="p-3">{l.start_date}</td>
              <td className="p-3">{l.end_date}</td>
              <td className="p-3">{l.reason}</td>
              <td className="p-3">{l.status}</td>

              <td className="p-3 space-x-2">
                <button
                  onClick={() => approve(l.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => reject(l.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}