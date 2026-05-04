async function getProjects() {
    const res = await fetch("http://localhost:3000/api/projects", {
        cache: "no-store",
    });
    return res.json();
}

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <div style={{ padding: 20}}>
            <h1>Projects</h1>

            {projects.map((p: any) => (
                <div key={p.id} style={{ marginBottom : 10}}>
                    <h3>{p.title}</h3>
                    <p>{p.sedc}</p>
                </div>
            ))}
        </div>
    );
} 