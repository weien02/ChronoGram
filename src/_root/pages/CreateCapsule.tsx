import CreateCapsuleForm from "@/components/capsules/CreateCapsuleForm";

function CreateCapsule() {
  return (
    <div className="flex flex-1">
        <div className="common-container">
            <div className="max-w-5xl flex-start gap-3 justify-start w-full">
                <h2 className="h3-bold md:h2-bold text-left w-full">Create Capsule</h2>
            </div>
                <CreateCapsuleForm />
        </div>
    </div>    
);
}

export default CreateCapsule;