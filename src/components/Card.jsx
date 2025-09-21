// components/ServiceCard.jsx
const ServiceCard = ({ title, description, image, buttonText, onClick, tag }) => {
  return (
    <div className="max-w-xs p-6 rounded-md shadow-md  transform transition-transform duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-xl bg-[#00000050]  text-[#ffffffd3] border-none m-2">
      <img
        src={image}
        alt=""
        className="object-cover object-center w-full rounded-md h-72 "
      />
      <div className="mt-6 mb-2 space-y-2">
        {tag && (
          <span className="block text-xs font-medium tracking-widest uppercase text-violet-400">
            {tag}
          </span>
        )}
        <h2 className="text-2xl font-semibold tracking-wide text-[#ffffffed] font-arabic">{title}</h2>
      </div>
      <p className="text-[#ffffffd3] mb-4">{description}</p>
      <button
        type="button"
        onClick={onClick}
        className="w-full bg-violet-700 text-white py-3 rounded-lg hover:bg-purple-800 transition duration-300 text-lg"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default ServiceCard;
