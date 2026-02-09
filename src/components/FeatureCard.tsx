import { useTranslation } from "react-i18next";

interface Props {
  feature: any;
  onClick: () => void;
}

export const FeatureCard = ({ feature, onClick }: Props) => {
  const { t } = useTranslation();

  const baseUrl = import.meta.env.BASE_URL;
  const imageSrc = feature.img?.startsWith("http")
    ? feature.img
    : `${baseUrl}${feature.img}`;

  return (
    <div
      role="button"
      onClick={onClick}
      className="group cursor-pointer flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-blue-200"
    >
      <div className="mb-4 h-32 w-full overflow-hidden rounded-xl bg-gray-50 p-4">
        <img
          src={imageSrc}
          alt={t(feature.title)}
          className="h-full w-full object-contain transition-transform group-hover:scale-110"
        />
      </div>
      <div className="text-base font-bold text-gray-900">{t(feature.title)}</div>
      <div className="mt-2 text-xs text-gray-400 text-center leading-relaxed line-clamp-2">
        {t(feature.subtitle)}
      </div>
    </div>
  );
};