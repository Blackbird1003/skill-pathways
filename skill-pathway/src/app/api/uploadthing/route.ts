import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Export routes for API
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
