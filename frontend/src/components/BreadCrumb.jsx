import { useLocation, Link } from "react-router-dom";

export default function Breadcrumb() {
  const location = useLocation();

  const paths = location.pathname
  .split("/")
  .filter(Boolean)
  .slice(0, -1);


  return (
    <div className="text-sm mb-6 text-gray-400">
      {paths.map((p, i) => {
        const to = "/" + paths.slice(0, i + 1).join("/");
        return (
          <span key={i}>
            <Link to={to} className="hover:underline capitalize">
              {p}
            </Link>
            {i !== paths.length - 1 && " / "}
          </span>
        );
      })}
    </div>
  );
}
