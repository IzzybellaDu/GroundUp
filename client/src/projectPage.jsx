import { useState, useEffect } from "react";

export default function ProjectPage() {
  // Dummy project data
  const [project, setProject] = useState(null);

  useEffect(() => {
    // Simulate fetching from a database
    const dummyData = {
      concerns: "Budget constraints, timeline risks, and resource limitations.",
      benefits: "Improved efficiency, better customer satisfaction, and cost savings.",
      summary: "This project is focused on modernising operations to achieve long-term sustainability."
    };

    // mimic async load
    setTimeout(() => setProject(dummyData), 500);
  }, []);

  if (!project) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <section className="bg-red-100 p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-2">Project Concerns / Considerations</h2>
        <p>{project.concerns}</p>
      </section>

      <section className="bg-green-100 p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-2">Project Benefits</h2>
        <p>{project.benefits}</p>
      </section>

      <section className="bg-blue-100 p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-2">Project Summary</h2>
        <p>{project.summary}</p>
      </section>
    </div>
  );
}
