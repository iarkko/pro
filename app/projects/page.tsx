async function getProjects() {
    const res = await fetch("http://localhost:3000/api/projects", {
        cache: "no-store",
    });
    return res.json() as Promise<Project[]>;
}

type Project = {
    id: string;
    title: string;
    description?: string;
};

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <div style={{ padding: 20}}>
            <h1>Projects</h1>

            {projects.map((p) => (
                <div key={p.id} style={{ marginBottom : 10}}>
                    <h3>{p.title}</h3>
                    <p>{p.description ?? ""}</p>
                </div>
            ))}
        </div>
    );
} 
