import { useState, useEffect, useCallback } from "react";
import { data } from "./cards";
import { CardGroup } from "./components/CardGroup";
import { Sidebar } from "./components/Sidebar";
import { FeatureDetail } from "./components/FeatureDetail";

function App() {
  const [activeId, setActiveId] = useState("");
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  const getSlug = (title: string) => title.replace(/\s+/g, "-").toLowerCase();

  const handleScroll = useCallback(() => {
    if (selectedFeature) return;

    const sections = document.querySelectorAll("section[id]");
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
      setActiveId(getSlug(data[data.length - 1].title));
      return;
    }

    let currentActive = "";
    sections.forEach((section) => {
      const element = section as HTMLElement;
      if (element.offsetTop <= scrollPosition) {
        currentActive = element.id;
      }
    });

    if (currentActive !== activeId) {
      setActiveId(currentActive);
    }
  }, [activeId, selectedFeature]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar 
        groups={data} 
        activeId={activeId} 
        onManualActive={(id) => {
          setActiveId(id);
          setSelectedFeature(null);
        }} 
      />
      
      <main className="ml-0 flex-1 md:ml-64 p-4 lg:p-8">
        <div className="mx-auto max-w-[1000px] font-sans">
          {selectedFeature ? (
            <FeatureDetail 
              feature={selectedFeature} 
              onBack={() => setSelectedFeature(null)} 
              // 這裡正確傳入導航函數
              onNavigate={(nextFeature) => setSelectedFeature(nextFeature)}
            />
          ) : (
            data.map((group) => (
              <CardGroup 
                key={group.title} 
                group={group} 
                onFeatureClick={setSelectedFeature} 
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;