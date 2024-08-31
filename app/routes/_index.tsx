import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { getUser } from "~/data-access/UserDAO.server";

export const loader: LoaderFunction = async ({}) => {
  const resp = await getUser("chankruze@gmail.com");
  console.log(resp);
  return json({ resp });
};

export const meta: MetaFunction = () => {
  return [
    { title: "chokidar - secure your android!" },
    {
      name: "description",
      content: "Protect your smartphone from unauthorized access!",
    },
  ];
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Welcome to Remix</h1>
      <ul className="list-disc mt-4 pl-6 space-y-2">
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/start/quickstart"
            rel="noreferrer"
          >
            5m Quick Start
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/start/tutorial"
            rel="noreferrer"
          >
            30m Tutorial
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer"
          >
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
