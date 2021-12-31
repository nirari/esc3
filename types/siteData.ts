import { ContentResponse } from "./api";

export type SiteDataResponse = ContentResponse<{
  blogTitle?: string;
  siteDescription?: string;
  about?: string;
}>;