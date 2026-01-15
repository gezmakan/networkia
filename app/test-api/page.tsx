"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function TestAPIPage() {
  const { data: session } = useSession();
  const [circles, setCircles] = useState<any[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    if (session?.user) {
      addLog("Session loaded");
    }
  }, [session]);

  const testCircleInit = async () => {
    try {
      addLog("Testing POST /api/circles/init...");
      const response = await fetch("/api/circles/init", {
        method: "POST",
      });
      const data = await response.json();
      addLog(`Circle init response: ${JSON.stringify(data).substring(0, 100)}`);
      if (response.ok) {
        setCircles(data.circles || []);
      }
    } catch (error) {
      addLog(`Error: ${error}`);
    }
  };

  const testGetCircles = async () => {
    try {
      addLog("Testing GET /api/circles...");
      const response = await fetch("/api/circles");
      const data = await response.json();
      addLog(`Circles response: ${data.length} circles found`);
      setCircles(data);
    } catch (error) {
      addLog(`Error: ${error}`);
    }
  };

  const testGetContacts = async () => {
    try {
      addLog("Testing GET /api/contacts...");
      const response = await fetch("/api/contacts");
      const data = await response.json();
      addLog(`Contacts response: ${data.length} contacts found`);
      setContacts(data);
    } catch (error) {
      addLog(`Error: ${error}`);
    }
  };

  const testCreateInteraction = async () => {
    if (contacts.length === 0) {
      addLog("No contacts available. Fetch contacts first.");
      return;
    }

    try {
      const contactId = contacts[0].id;
      addLog(`Testing POST /api/interactions for contact ${contactId}...`);
      const response = await fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId,
          title: "Test Interaction",
          body: "This is a test interaction created from the test page",
          date: new Date().toISOString(),
        }),
      });
      const data = await response.json();
      addLog(`Interaction created: ${data.id}`);
    } catch (error) {
      addLog(`Error: ${error}`);
    }
  };

  const testGetInteractions = async () => {
    if (contacts.length === 0) {
      addLog("No contacts available. Fetch contacts first.");
      return;
    }

    try {
      const contactId = contacts[0].id;
      addLog(`Testing GET /api/interactions?contactId=${contactId}...`);
      const response = await fetch(`/api/interactions?contactId=${contactId}`);
      const data = await response.json();
      addLog(`Interactions response: ${data.length} interactions found`);
      setInteractions(data);
    } catch (error) {
      addLog(`Error: ${error}`);
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Test API Endpoints</h1>
          <p>Please sign in to test the API endpoints</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test API Endpoints</h1>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Circle Tests</h2>
            <div className="space-y-2">
              <button
                onClick={testCircleInit}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Initialize Circles
              </button>
              <button
                onClick={testGetCircles}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Get Circles
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Interaction Tests</h2>
            <div className="space-y-2">
              <button
                onClick={testGetContacts}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Get Contacts (Step 1)
              </button>
              <button
                onClick={testCreateInteraction}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Create Interaction (Step 2)
              </button>
              <button
                onClick={testGetInteractions}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Get Interactions (Step 3)
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Circles ({circles.length})
            </h3>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded max-h-60 overflow-y-auto">
              {circles.map((circle) => (
                <div key={circle.id} className="mb-2">
                  <span className="font-medium">{circle.name}</span>
                  {" - "}
                  <span className={circle.isActive ? "text-green-600" : "text-gray-400"}>
                    {circle.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Interactions ({interactions.length})
            </h3>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded max-h-60 overflow-y-auto">
              {interactions.map((interaction) => (
                <div key={interaction.id} className="mb-2 border-b pb-2">
                  <div className="font-medium">{interaction.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(interaction.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Logs</h3>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
