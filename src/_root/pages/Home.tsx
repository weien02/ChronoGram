import Dashboard from "@/components/homepage/Dashboard";

function Home() {

    return (
        <div className="flex flex-1">
            <div className="common-container" style={{
                  overflowY: 'auto',
                }}>
                <div className="flex-start gap-3 justify-start w-full max-w-5xl">
                    <h2 className="h3-bold md:h2-bold text-left w-full">Home</h2>
                </div>
                <Dashboard />
            </div>
        </div>    
    );
}

export default Home;
