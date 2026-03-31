import { useTranslation } from "react-i18next";
import type { CardGroup } from "../cards";

interface Props {
  groups: CardGroup[];
  activeId: string;
  onManualActive: (id: string) => void;
}

export const Sidebar = ({ groups, activeId, onManualActive }: Props) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="fixed top-0 left-0 h-full w-64 hidden md:flex flex-col">

      <div className="flex-1 flex flex-col justify-center px-4 overflow-y-auto">
        {groups.map((group) => {
          const id = group.title.replace(/\s+/g, "-").toLowerCase();
          const isActive = activeId === id;

          return (
            <a
              key={group.title}
              href={`#${id}`}
              onClick={() => onManualActive(id)}
              className={`group relative mb-1 flex items-center py-2.5 px-4 text-sm transition-all duration-200 rounded-xl ${isActive
                  ? "text-blue-600 font-bold bg-blue-50"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
            >
              {/* 指示線 */}
              <div className={`absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r-full transition-opacity ${isActive ? "opacity-100" : "opacity-0"
                }`} />

              <i className={`${group.icon} mr-3 w-5 text-center ${isActive ? "text-blue-600" : "text-gray-400"}`} />
              <span className="truncate flex-1">{t(group.title)}</span>
              {group.features && group.features.length > 0 && (
                <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-medium transition-colors ${isActive
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100/50 text-gray-400 group-hover:bg-gray-200/50 group-hover:text-gray-500"
                  }`}>
                  {group.features.length}
                </span>
              )}
            </a>
          );
        })}
      </div>

      {/* 語系切換 */}
      <div className="mt-auto p-6 bg-gray-50/50">
        <div className="flex bg-white rounded-lg p-1 border border-gray-200">
          {["en", "zh-TW", "ja"].map((lng) => {
            // 定義語系顯示名稱的對應表
            const langNames: Record<string, string> = {
              en: "EN",
              "zh-TW": "繁中",
              ja: "日本語",
            };

            return (
              <button
                key={lng}
                onClick={() => changeLanguage(lng)}
                className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all ${i18n.language === lng
                    ? "bg-gray-900 text-white"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                  }`}
              >
                {/* 使用對應表顯示名稱 */}
                {langNames[lng]}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};