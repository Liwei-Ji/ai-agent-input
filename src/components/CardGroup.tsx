import { useTranslation } from "react-i18next";
import type { CardGroup as CardGroupType } from "../cards";
import { FeatureCard } from "./FeatureCard";

interface Props {
  group: CardGroupType;
  onFeatureClick: (feature: any) => void;
}

export const CardGroup = ({ group, onFeatureClick }: Props) => {
  const { t } = useTranslation();
  const groupId = group.title.replace(/\s+/g, "-").toLowerCase();

  return (
    <section id={groupId} className="mb-12">
      <div className="mb-6 flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        {/* text-blue-500 圖標顏色*/}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
            <i className={`${group.icon} text-xl`} />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900">{t(group.title)}</h2>
          <p className="text-sm text-gray-500">{t(group.subtitle)}</p>
        </div>
      </div>

      {group.features && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {group.features.map((feature) => (
            <FeatureCard 
              key={feature.title} 
              feature={feature} 
              onClick={() => onFeatureClick(feature)} 
            />
          ))}
        </div>
      )}
    </section>
  );
};