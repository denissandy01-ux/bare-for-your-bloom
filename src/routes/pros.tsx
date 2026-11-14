import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/pros")({ beforeLoad: () => { throw redirect({ to: "/discover", statusCode: 301 }); } });
