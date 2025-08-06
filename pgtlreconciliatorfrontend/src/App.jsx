import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import apiCall from "../utils/apicall";

export default function App() {
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [subject, setSubject] = useState("");
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [jobPage, setJobPage] = useState(1);
  const [results, setResults] = useState(null);
  const [activeJobId, setActiveJobId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchJobs = async (page = 1) => {
    const res = await apiCall().get(`/reconcile?page=${page}&per_page=${10}`);
    const mainres = res?.data?.data;

    setJobs(mainres?.data || []);
    setTotalPages(mainres?.pageInfo?.totalPages);
    setJobPage(page);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("upload1", fileA);
    formData.append("upload2", fileB);
    formData.append("name", subject);

    await apiCall(true).post("/reconcile", formData);
    fetchJobs(1);
  };

  const viewResults = async (jobId) => {
    const res = await apiCall().get(`/reconcile/${jobId}`);
    console.log(res?.data);
    setResults(res?.data?.data);
    setActiveJobId(jobId);
    setModalOpen(true);
    setCurrentPage(1);
  };

  console.log(results);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">🧾 Financial Reconciliation Tool</h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label>Subject</label>
              <Input
                type="text"
                onChange={(e) => setSubject(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <label>File A</label>
              <Input
                type="file"
                onChange={(e) => setFileA(e.target.files[0])}
                className="mt-2"
              />
            </div>
            <div>
              <label>File B</label>
              <Input
                type="file"
                onChange={(e) => setFileB(e.target.files[0])}
                className="mt-2"
              />
            </div>
          </div>
          <Button onClick={handleSubmit}>Submit Reconciliation</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">
            📋Reconciliation Job List
          </h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border text-sm">
              <thead>
                <tr>
                  <th className="border px-2 py-1 text-left bg-gray-100">
                    Job Name
                  </th>
                  <th className="border px-2 py-1 text-left bg-gray-100">
                    Status
                  </th>
                  <th className="border px-2 py-1 text-left bg-gray-100">
                    Created At
                  </th>
                  <th className="border px-2 py-1 text-left bg-gray-100">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="border px-2 py-1">{job.name}</td>
                    <td className="border px-2 py-1">{job.status}</td>
                    <td className="border px-2 py-1">
                      {new Date(job.createdAt).toLocaleString()}
                    </td>
                    <td className="border px-2 py-1">
                      <Button size="sm" onClick={() => viewResults(job.id)}>
                        View Result
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <Button
                  key={index}
                  variant={jobPage === index + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => fetchJobs(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>
              📊 Reconciliation Result for Job #{activeJobId}
            </DialogTitle>
          </DialogHeader>
          {results && (
            <Tabs defaultValue="missingInB" className="w-full">
              <TabsList>
                {Object.keys(results).map((key) => (
                  <TabsTrigger key={key} value={key}>
                    {key}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Object.entries(results).map(([key, entries]) => {
                const startIndex = (currentPage - 1) * rowsPerPage;
                const paginatedEntries = entries.slice(
                  startIndex,
                  startIndex + rowsPerPage
                );

                return (
                  <TabsContent key={key} value={key}>
                    <div className="overflow-x-auto">
                      <table className="table-auto w-full border text-sm">
                        <thead>
                          <tr>
                            {paginatedEntries.length > 0 &&
                              Object.keys(paginatedEntries[0]).map((col) => (
                                <th
                                  key={col}
                                  className="border px-2 py-1 text-left bg-gray-100"
                                >
                                  {col}
                                </th>
                              ))}
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedEntries.map((row, idx) => (
                            <tr key={idx}>
                              {Object.values(row).map((val, i) => (
                                <td key={i} className="border px-2 py-1">
                                  {val}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {entries.length > rowsPerPage && (
                        <div className="flex justify-center mt-4 space-x-2">
                          {Array.from({
                            length: Math.ceil(entries.length / rowsPerPage),
                          }).map((_, index) => (
                            <Button
                              key={index}
                              variant={
                                currentPage === index + 1
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(index + 1)}
                            >
                              {index + 1}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
