import { Button } from "./Custom/Button";

const ServiceCard = ({ title, description, image, buttonText, onClick, tag }) => {
  return (
    <div className="m-2 flex max-w-xs flex-col rounded-lg border border-slate-200 bg-white p-5 text-slate-900 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <img src={image} alt={title || ""} className="h-72 w-full rounded-md object-cover object-center" />
      <div className="mb-2 mt-5 space-y-2">
        {tag && (
          <span className="block text-xs font-bold uppercase tracking-wide text-violet-700">
            {tag}
          </span>
        )}
        <h2 className="text-2xl font-bold tracking-wide text-slate-900 font-arabic">{title}</h2>
      </div>
      <p className="mb-4 text-sm leading-6 text-slate-700">{description}</p>
      <Button type="button" onClick={onClick} className="mt-auto w-full">
        {buttonText}
      </Button>
    </div>
  );
};

export default ServiceCard;
