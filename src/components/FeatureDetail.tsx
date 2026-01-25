import { useEffect, useMemo } from "react"; 
import { useTranslation } from "react-i18next";
import { data } from "../cards";
import { PreviewManager } from "./previews/PreviewManager";

interface Props {
  feature: any;
  onBack: () => void;
  onNavigate: (feature: any) => void; // 接收導航函數
}

export const FeatureDetail = ({ feature, onBack, onNavigate }: Props) => {
  const { t } = useTranslation();

  // 1. 將所有分組中的 features 攤平成一個單層陣列，方便計算前後順序
  const allFeatures = useMemo(() => {
    return data.flatMap((group) => group.features || []);
  }, []);

  // 2. 找到目前卡片在攤平陣列中的索引位置
  const currentIndex = allFeatures.findIndex((f) => f.title === feature.title);
  const prevFeature = allFeatures[currentIndex - 1];
  const nextFeature = allFeatures[currentIndex + 1];

  // 當 feature 切換時，強制滾動到頁面頂部
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [feature]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 頂部返回導航 */}
      <nav className="sticky top-0 z-20 py-4 bg-gray-50/80 backdrop-blur-md mb-6">
        <button 
          onClick={onBack}
          className="group flex items-center gap-3 text-sm font-bold text-gray-400 hover:text-gray-900 transition-all"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm group-hover:border-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-all">
            <i className="fa-solid fa-arrow-left text-xs" />
          </div>
          <span>{t("ui.back")}</span>
        </button>
      </nav>

      {/* 內容佈局 */}
      <div className="flex flex-col space-y-12 items-stretch">
        {/* 文字區 */}
        <div className="space-y-10">
          <header>
            <h1 className="text-5xl font-black text-gray-900 mb-6 leading-[1.1]">{t(feature.title)}</h1>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">{t(feature.subtitle)}</p>
          </header>

          <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
            {feature.description ? (
              feature.description.map((desc: string, index: number) => <p key={index}>{t(desc)}</p>)
            ) : (
              <p>{t("detail.default_paragraph_1")}</p>
            )}
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:sticky lg:top-24 space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-[2rem] min-h-[500px] flex items-center justify-center bg-gray-50/50">
            <PreviewManager featureTitle={feature.title} />
            </div>

            {/* 底部導覽按鈕區域*/}
            <div className="flex items-center justify-between gap-4 pt-6">
              {/* 左側按鈕：第一張顯示「返回列表」，其餘顯示「上一張」 */}
              {currentIndex === 0 ? (
                <button
                  onClick={onBack}
                  className="flex flex-1 items-center gap-3 p-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-all group"
                >
                  <i className="fa-solid fa-list text-gray-400 group-hover:text-gray-900" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{t("ui.back")}</div>
                    <div className="text-sm font-bold text-gray-900">Guide Overview</div>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate(prevFeature)}
                  className="flex flex-1 items-center gap-3 p-4 rounded-2xl border border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50 transition-all group"
                >
                  <i className="fa-solid fa-chevron-left text-gray-400 group-hover:text-blue-600" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Previous</div>
                    <div className="text-sm font-bold text-gray-900">{t(prevFeature.title)}</div>
                  </div>
                </button>
              )}

              {/* 右側按鈕：如果有下一張就顯示 */}
              {nextFeature && (
                <button
                  onClick={() => onNavigate(nextFeature)}
                  className="flex flex-1 items-center justify-end gap-3 p-4 rounded-2xl border border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50 transition-all group text-right"
                >
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Next</div>
                    <div className="text-sm font-bold text-gray-900">{t(nextFeature.title)}</div>
                  </div>
                  <i className="fa-solid fa-chevron-right text-gray-400 group-hover:text-blue-600" />
                </button>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};