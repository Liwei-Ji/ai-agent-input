import { useState, useEffect, useCallback } from "react";
import { data } from "./cards";
import { CardGroup } from "./components/CardGroup";
import { Sidebar } from "./components/Sidebar";
import { FeatureDetail } from "./components/FeatureDetail";
import ApplePage from "./pages/pages";

function App() {
  const [currentView, setCurrentView] = useState<'wayfinders' | 'apple'>('wayfinders');
  const [activeId, setActiveId] = useState("");
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  const getSlug = (title: string) => title.replace(/\s+/g, "-").toLowerCase();

  const handleScroll = useCallback(() => {
    if (selectedFeature || currentView === 'apple') return;

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
  }, [activeId, selectedFeature, currentView]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (selectedFeature) {
      const foundGroup = data.find(group =>
        group.features?.some(f => f.title === selectedFeature.title)
      );
      if (foundGroup) {
        setActiveId(getSlug(foundGroup.title));
      }
    }
  }, [selectedFeature]);

  // 如果目前是 Apple 頁面，直接渲染 ApplePage 並傳入返回回調
  if (currentView === 'apple') {
    return <ApplePage onBack={() => setCurrentView('wayfinders')} />;
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar
        groups={data}
        activeId={activeId}
        onManualActive={(id) => {
          setActiveId(id);
          setSelectedFeature(null);
        }}
        onAppleClick={() => setCurrentView('apple')} // 點擊時切換狀態
      />

      <main className="ml-0 flex-1 md:ml-64 p-4 lg:p-8">
        <div className="mx-auto max-w-[1000px] font-sans">
          {selectedFeature ? (
            <FeatureDetail
              feature={selectedFeature}
              onBack={() => setSelectedFeature(null)}
              onNavigate={(nextFeature) => setSelectedFeature(nextFeature)}
            />
          ) : (
            data.map((group) => (
              <section id={getSlug(group.title)} key={group.title}>
                <CardGroup
                  group={group}
                  onFeatureClick={setSelectedFeature}
                />
              </section>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;