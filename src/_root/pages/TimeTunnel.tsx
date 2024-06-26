import TimeTunnelCard from "@/components/capsules/TimeTunnelCard";
import useCapsuleState from "@/states/capsuleState";

function TimeTunnel() {

    const permittedCapsules = useCapsuleState(state => state.permittedCapsules);
    const capsulesToDisplay = permittedCapsules === null ? [] : permittedCapsules.filter(x => x.locked && (x.unlockDate <= Date.now()));
    capsulesToDisplay.sort((x, y) => y.unlockDate - x.unlockDate);

    return (
        <div className="flex flex-1">
            <div className="common-container">
                <div className="flex-start gap-3 justify-start w-full max-w-5xl">
                    <h2 className="h3-bold md:h2-bold text-left w-full">Time Tunnel</h2>
                </div>
                <div className="w-full max-w-5xl">
                    {capsulesToDisplay.length === 0
                    ? <p>No capsules to view yet...</p>
                    : (capsulesToDisplay.map((capsule, index) => (
                        <TimeTunnelCard key={index} capsule={capsule} />
                    )))}
                </div>
            </div>
        </div>    
    );
}

export default TimeTunnel;