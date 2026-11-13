import { Link } from "react-router-dom";
import { CardDescription, CardFooter, CardHeader, CardTitle } from "./Custom/Card";

export default function ServiceCard({
  title,
  description,
  image,
  buttonText,
  to,
  state,
  externalUrl,
  eager,
}) {
  const content = (
    <>
      <img
        className="service-image"
        src={image}
        alt=""
        width="480"
        height="270"
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <span className="ml-auto rounded-md border border-input bg-background px-4 py-2 text-sm font-medium group-hover:bg-violet-700 group-hover:text-white">
          {buttonText}
        </span>
      </CardFooter>
    </>
  );

  const className = "service-card service-card-link group rounded-lg border bg-card text-card-foreground shadow-sm";
  return externalUrl ? (
    <a className={className} href={externalUrl} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <Link className={className} to={to} state={state}>
      {content}
    </Link>
  );
}
