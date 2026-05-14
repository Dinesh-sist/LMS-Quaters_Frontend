import TopNavbar from "./UI/TopNavbar";

export default function Dashboard() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-animated {
          background: linear-gradient(135deg, #1a2e5a, #2d4a8a, #e87722, #1a2e5a);
          background-size: 300% 300%;
          animation: gradientMove 15s ease-in-out infinite;
        }
      `}</style>
      <div className="gradient-animated absolute inset-0 -z-10" />
      <div className="relative h-full w-full overflow-hidden">
        <div className="relative z-10 flex h-full flex-col">
          <TopNavbar titleColor="text-white" />

      
              
            </div>

       
        </div>
      </div>

  );
}
